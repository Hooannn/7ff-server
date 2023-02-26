import { NextFunction, Request, Response } from 'express';
import { knexInstance, TABLES } from '@/db';
class IndexController {
  public index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await knexInstance(TABLES.USERS).insert({ id: 'test', name: 'Khai Hoan' });
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
