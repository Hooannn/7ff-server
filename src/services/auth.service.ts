import jwt from 'jsonwebtoken';
import type { AuthJwtPayload } from '@/interfaces/auth.interface';
import { hashSync, compareSync } from 'bcrypt';
import { ACCESS_TOKEN_LIFE, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_LIFE, REFRESH_TOKEN_SECRET, SALTED_PASSWORD } from '@config';
import { HttpException } from '@/exceptions/HttpException';
import User from '@/models/User';
import { errorStatus } from '@config';
class AuthService {
  private jwt = jwt;
  private User = User;
  public async signUpByEmail({ email, password }: { email: string; password: string }) {
    const isEmailExisted = await this.User.findOne({ email });
    if (isEmailExisted) throw new HttpException(409, errorStatus.EMAIL_EXISTED);
    const hashedPassword = hashSync(password, parseInt(SALTED_PASSWORD));
    const user = new this.User({ email, password: hashedPassword, role: 'User' });
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

  public getAccessToken(oldAccessToken: string, refreshToken: string) {
    if (!refreshToken || !oldAccessToken) throw new HttpException(401, errorStatus.NO_CREDENTIALS);
    const { userId: accessUserId, role } = (this.jwt.decode(oldAccessToken) as AuthJwtPayload) || { userId: null, role: null };
    const { userId: refreshUserId } = this.verifyRefreshToken(refreshToken);
    if (accessUserId !== refreshUserId) throw new HttpException(403, errorStatus.INVALID_TOKEN_PAYLOAD);
    return this.jwt.sign({ userId: accessUserId, role }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_LIFE });
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
}
export default AuthService;
