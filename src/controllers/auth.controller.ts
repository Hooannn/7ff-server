import AuthService from '@/services/auth.service';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { successStatus } from '@/config';
class AuthController {
  private authService = new AuthService();
  public signUpByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      const data = await this.authService.signUpByEmail({ email, password });
      res.status(201).json({ code: 201, success: true, data, message: successStatus.SIGN_UP_SUCCESSFULLY });
    } catch (error) {
      next(error);
    }
  };

  public signInByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      const data = await this.authService.signInByEmail({ email, password });
      res.status(201).json({ code: 201, success: true, data, message: successStatus.SIGN_IN_SUCCESSFULLY });
    } catch (error) {
      next(error);
    }
  };

  public getAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken, refreshToken } = req.body;
      const data = this.authService.getAccessToken(accessToken, refreshToken);
      res.status(201).json({ code: 201, success: true, data, message: successStatus.REFRESH_SUCCESSFULLY });
    } catch (error) {
      next(error);
    }
  };

  public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email } = req.body;
      const data = await this.authService.forgotPassword(email);
      res.status(200).json({ code: 200, success: true, data, message: successStatus.FORGOT_PASSWORD_SUCCESSFULLY });
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { password, token } = req.body;
      const data = await this.authService.resetPassword(password, token);
      res.status(200).json({ code: 200, success: true, data, message: successStatus.RESET_PASSWORD_SUCCESSFULLY });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
