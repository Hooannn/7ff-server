import { CLIENT_URL, successStatus } from '@/config';
import { RequestWithUser } from '@/interfaces';
import { IOrder } from '@/models/Order';
import NodemailerService from '@/services/nodemailer.service';
import OrdersService from '@/services/orders.service';
import UsersService from '@/services/users.service';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
class OrdersController {
  private ordersService = new OrdersService();
  private usersService = new UsersService();
  private nodemailerService = new NodemailerService();

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

  public getOrdersByCustomerId = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { customerId } = req.params;
      const { status } = req.query;
      const { userId, role } = req.auth;
      const orders = await this.ordersService.getOrdersByCustomerId({
        customerId: customerId.toString(),
        // userId,
        // role,
        // status: status as IOrder['status'],
      });
      res.status(200).json({ code: 200, success: true, data: orders });
    } catch (error) {
      next(error);
    }
  };

  public getOrderById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.params;
      const { userId, role } = req.auth;
      const data = await this.ordersService.getOrderById({ orderId, userId, role });
      res.status(200).json({ code: 200, success: true, data });
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
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { customerId, isDelivery, deliveryAddress, deliveryPhone, items, note, voucher } = req.body;
      const order = await this.ordersService.createOrder({ customerId, voucher, isDelivery, deliveryAddress, deliveryPhone, items, note });
      const { email: customerEmail, _id } = await this.usersService.getUserById(customerId.toString());
      await this.usersService.resetCartItems(_id.toString());
      const mailHref = `${CLIENT_URL}/profile/orders`;
      if (customerEmail) this.nodemailerService.sendOrderConfirmationEmail(customerEmail, order, mailHref);
      res.status(201).json({ code: 201, success: true, data: order, message: successStatus.CREATE_SUCCESSFULLY });
    } catch (error) {
      next(error);
    }
  };
}

export default OrdersController;
