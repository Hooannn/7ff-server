import jwt from 'jsonwebtoken';
import type { AuthJwtPayload } from '@/interfaces/auth.interface';
import { ACCESS_TOKEN_LIFE, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_LIFE, REFRESH_TOKEN_SECRET } from '@config';
import { HttpException } from '@/exceptions/HttpException';
class AuthService {
  private jwt = jwt;

  public generateAccessToken({ userId, role }: AuthJwtPayload) {
    return this.jwt.sign({ userId, role }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_LIFE });
  }

  public verifyAccessToken(token: string) {
    return this.jwt.verify(token, ACCESS_TOKEN_SECRET);
  }

  public generateRefreshToken({ userId }: AuthJwtPayload) {
    return this.jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_LIFE });
  }

  public verifyRefreshToken(token: string) {
    return this.jwt.verify(token, REFRESH_TOKEN_SECRET);
  }

  public getAccessToken(oldAccessToken: string, refreshToken: string) {
    if (!refreshToken || !oldAccessToken) throw new HttpException(403, 'INVALID_TOKEN');
    const { userId: accessUserId, role } = this.jwt.decode(oldAccessToken) as AuthJwtPayload;
    const { userId: refreshUserId } = this.jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as AuthJwtPayload;
    if (accessUserId !== refreshUserId) throw new HttpException(403, 'INVALID_TOKEN_INFO');
    return this.jwt.sign({ userId: accessUserId, role }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_LIFE });
  }
}
export default AuthService;
