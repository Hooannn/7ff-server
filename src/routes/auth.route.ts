import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import AuthController from '@/controllers/auth.controller';
import { emailValidator, passwordValidator } from '@/validators';
class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  private authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/sign-up/email`, [emailValidator(), passwordValidator()], this.authController.signUpByEmail);
    this.router.post(`${this.path}/sign-in/email`, [emailValidator(), passwordValidator()], this.authController.signInByEmail);
    this.router.post(`${this.path}/refresh`, this.authController.getAccessToken);
    this.router.post(`${this.path}/forgot-password`, emailValidator(), this.authController.forgotPassword);
    this.router.post(`${this.path}/reset-password`, passwordValidator(), this.authController.resetPassword);
  }
}

export default AuthRoute;
