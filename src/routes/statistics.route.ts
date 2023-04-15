import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import StatisticsController from '@/controllers/statistics.controller';
import adminMiddleware from '@/middlewares/admin.middleware';

class StatisticsRoute implements Routes {
  public path = '/statistics';
  public router = Router();
  private statisticsController = new StatisticsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, adminMiddleware, this.statisticsController.getStatistics);
  }
}

export default StatisticsRoute;
