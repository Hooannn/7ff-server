import { successStatus } from '@/config';
import OrdersService from '@/services/orders.service';
import { NextFunction, Request, Response } from 'express';
class OrdersController {
  private ordersService = new OrdersService();
  public getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { skip, limit, filter, sort } = req.query;
      const { total, orders } = await this.ordersService.getAllOrders({
        skip: parseInt(skip?.toString()),
        limit: parseInt(limit?.toString()),
        filter: filter?.toString(),
        sort: sort?.toString(),
      });
      res.status(200).json({ code: 200, success: true, data: orders, total, took: orders.length });
    } catch (error) {
      next(error);
    }
  };

  public deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.query;
      await this.ordersService.deleteOrder(id.toString());
      res.status(200).json({ code: 200, success: true, message: successStatus.DELETE_SUCCESSFULLY });
    } catch (error) {
      next(error);
    }
  };

  public updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.query;
      const order = req.body;
      const updatedOrder = await this.ordersService.updateOrder(id.toString(), order);
      res.status(200).json({ code: 200, success: true, data: updatedOrder, message: successStatus.UPDATE_SUCCESSFULLY });
    } catch (error) {
      next(error);
    }
  };

  public checkoutThenCreateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const checkoutReq = req.body;
      const order = await this.ordersService.createOrder(checkoutReq);
      res.status(201).json({ code: 201, success: true, data: order, message: successStatus.CREATE_SUCCESSFULLY });
    } catch (error) {
      next(error);
    }
  };
}

export default OrdersController;
