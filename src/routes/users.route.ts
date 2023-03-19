import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import UsersController from '@/controllers/users.controller';
import adminMiddleware from '@/middlewares/admin.middleware';

class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  private usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, adminMiddleware, this.usersController.getAllUsers);
    this.router.post(`${this.path}`, adminMiddleware, this.usersController.addUser);
    this.router.delete(`${this.path}`, adminMiddleware, this.usersController.deleteUser);
    this.router.patch(`${this.path}`, adminMiddleware, this.usersController.updateUser);
  }
}

export default UsersRoute;
