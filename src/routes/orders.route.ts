import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import adminMiddleware from '@/middlewares/admin.middleware';
import OrdersController from '@/controllers/orders.controller';

class OrdersRoute implements Routes {
  public path = '/orders';
  public router = Router();
  private ordersController = new OrdersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, adminMiddleware, this.ordersController.getAllOrders);
    // this.router.post(`${this.path}`, adminMiddleware, this.ordersController.addVoucher);
    this.router.delete(`${this.path}`, adminMiddleware, this.ordersController.deleteOrder);
    this.router.post(`/checkout`, this.ordersController.checkoutThenCreateOrder);
    this.router.patch(`${this.path}`, adminMiddleware, this.ordersController.updateOrder);
  }
}

export default OrdersRoute;
