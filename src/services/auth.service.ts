import jwt, { JwtPayload } from 'jsonwebtoken';
import type { AuthJwtPayload } from '@/interfaces/auth.interface';
import { hashSync, compareSync } from 'bcrypt';
import {
  ACCESS_TOKEN_LIFE,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_LIFE,
  REFRESH_TOKEN_SECRET,
  SALTED_PASSWORD,
  RESETPASSWORD_TOKEN_LIFE,
  RESETPASSWORD_TOKEN_SECRET,
  CLIENT_URL,
} from '@config';
import { HttpException } from '@/exceptions/HttpException';
import User from '@/models/User';
import { errorStatus } from '@config';
import NodemailerService from './nodemailer.service';
import Jti from '@/models/Jti';
class AuthService {
  private jwt = jwt;
  private User = User;
  private Jti = Jti;
  private nodemailerService = new NodemailerService();
  public async signUpByEmail({ email, password, firstName, lastName }: { email: string; password: string; firstName: string; lastName: string }) {
    const isEmailExisted = await this.User.findOne({ email });
    if (isEmailExisted) throw new HttpException(409, errorStatus.EMAIL_EXISTED);
    const hashedPassword = hashSync(password, parseInt(SALTED_PASSWORD));
    const user = new this.User({ email, password: hashedPassword, role: 'User', firstName, lastName });
    await user.save();
    return { email, password };
  }

  public async signInByEmail({ email, password }: { email: string; password: string }) {
    const target = await this.User.findOne({ email });
    if (!target) throw new HttpException(400, errorStatus.UNREGISTERED);
    const isPasswordMatched = compareSync(password, target.password.toString());
    if (!isPasswordMatched) throw new HttpException(400, errorStatus.WRONG_PASSWORD);
    const refreshToken = this.generateRefreshToken({ userId: target._id.toString() });
    const accessToken = this.generateAccessToken({ userId: target._id.toString(), role: target.role.toString() as AuthJwtPayload['role'] });
    const user = await this.User.findByIdAndUpdate(target._id.toString(), { refreshToken }, { returnOriginal: false }).select('-password');
    return { user, refreshToken, accessToken };
  }

  public async getAccessToken(refreshToken: string) {
    if (!refreshToken) throw new HttpException(401, errorStatus.NO_CREDENTIALS);
    const { userId: refreshUserId } = this.verifyRefreshToken(refreshToken);
    const user = await this.User.findById(refreshUserId);
    if (!user) throw new HttpException(400, errorStatus.INVALID_TOKEN_PAYLOAD);
    const accessToken = this.generateAccessToken({ userId: user._id.toString(), role: user.role });
    return { accessToken };
  }

  public async forgotPassword(email: string) {
    const user = await this.User.findOne({ email });
    if (!user) throw new HttpException(400, errorStatus.UNREGISTERED);
    const blackJti = new this.Jti({ isUsed: false });
    await blackJti.save();
    const token = this.generateResetPasswordToken({ email, jti: blackJti._id.toString() });
    const resetPasswordUrl = `${CLIENT_URL}/auth?type=reset&token=${token}`;
    await this.nodemailerService.sendResetPasswordMail(email, resetPasswordUrl);
    return { token };
  }

  public async resetPassword(newPassword: string, token: string) {
    const decodedToken = this.verifyResetPasswordToken(token) as JwtPayload;
    const jti = await this.Jti.findById(decodedToken?.jti.toString());
    if (jti.isUsed) throw new HttpException(400, errorStatus.RESET_PASSWORD_EXPIRED);
    const newHashedPassword = hashSync(newPassword, parseInt(SALTED_PASSWORD));
    await this.User.findOneAndUpdate({ email: decodedToken.email }, { password: newHashedPassword });
    await jti.update({ isUsed: true });
    return { email: decodedToken.email, password: newPassword };
  }

  public async getUser(id: string) {
    return await this.User.findById(id).select('-password -refreshToken');
  }

  public verifyAccessToken(token: string) {
    return this.jwt.verify(token, ACCESS_TOKEN_SECRET);
  }

  private generateAccessToken({ userId, role }: AuthJwtPayload) {
    return this.jwt.sign({ userId, role }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_LIFE });
  }

  private generateRefreshToken({ userId }: AuthJwtPayload) {
    return this.jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_LIFE });
  }

  private verifyRefreshToken(token: string) {
    return this.jwt.verify(token, REFRESH_TOKEN_SECRET) as AuthJwtPayload;
  }

  private generateResetPasswordToken({ email, jti }: { email: string; jti: string }) {
    return this.jwt.sign({ email, jti }, RESETPASSWORD_TOKEN_SECRET, { expiresIn: RESETPASSWORD_TOKEN_LIFE });
  }

  private verifyResetPasswordToken(token: string) {
    return this.jwt.verify(token, RESETPASSWORD_TOKEN_SECRET);
  }
}

export default AuthService;
