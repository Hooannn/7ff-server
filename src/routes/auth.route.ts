import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import AuthController from '@/controllers/auth.controller';
import { emailAndPasswordValidator } from '@/validators';
class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  private authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/sign-up/email`, emailAndPasswordValidator(), this.authController.signUpByEmail);
    this.router.post(`${this.path}/sign-in/email`, emailAndPasswordValidator(), this.authController.signInByEmail);
    this.router.post(`${this.path}/refresh`, this.authController.getAccessToken);
  }
}

export default AuthRoute;
