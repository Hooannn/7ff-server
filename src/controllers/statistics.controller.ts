import { errorStatus } from '@/config';
import { HttpException } from '@/exceptions/HttpException';
import StatisticsService from '@/services/statistics.service';
import { NextFunction, Request, Response } from 'express';
class StatisticsController {
  private statisticsService = new StatisticsService();
  public getStatistics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { from, to } = req.query;
      if (!from || !to) throw new HttpException(400, errorStatus.BAD_REQUEST);
      const results = await this.statisticsService.getStatistics(parseInt(from.toString()), parseInt(to.toString()));
      res.status(200).json({ code: 200, success: true, data: results });
    } catch (error) {
      next(error);
    }
  };
}

export default StatisticsController;
