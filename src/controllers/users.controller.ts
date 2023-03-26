import { successStatus } from '@/config';
import UsersService from '@/services/users.service';
import { NextFunction, Request, Response } from 'express';
class UsersController {
  private usersService = new UsersService();
  public getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { skip, limit, filter, sort } = req.query;
      const { total, users } = await this.usersService.getAllUsers({
        skip: parseInt(skip?.toString()),
        limit: parseInt(limit?.toString()),
        filter: filter?.toString(),
        sort: sort?.toString(),
      });
      res.status(200).json({ code: 200, success: true, data: users, total, took: users.length });
    } catch (error) {
      next(error);
    }
  };

  public addUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqUser = req.body;
      const user = await this.usersService.addUser(reqUser);
      res.status(201).json({ code: 201, success: true, data: user, message: successStatus.CREATE_SUCCESSFULLY });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.query;
      await this.usersService.deleteUser(id.toString());
      res.status(200).json({ code: 200, success: true, message: successStatus.DELETE_SUCCESSFULLY });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.query;
      const user = req.body;
      const updatedUser = await this.usersService.updateUser(id.toString(), user);
      res.status(200).json({ code: 200, success: true, data: updatedUser, message: successStatus.UPDATE_SUCCESSFULLY });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
