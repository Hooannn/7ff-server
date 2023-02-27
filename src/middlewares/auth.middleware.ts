import { NextFunction, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { RequestWithUser } from '@interfaces/auth.interface';
import AuthService from '@/services/auth.service';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const authService = new AuthService();
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);
    if (Authorization) {
      const decodedToken = authService.verifyAccessToken(Authorization); // Verify token logic here
      req.auth = decodedToken;
      next();
    } else {
      next(new HttpException(401, 'Authentication token missing'));
    }
  } catch (error) {
    if (error.message === 'jwt expired' || error.message === 'invalid signature') {
      return next(new HttpException(403, error.message)); // 403 for client to refresh token
    }
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
