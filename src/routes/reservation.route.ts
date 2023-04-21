import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import ReservationController from '@/controllers/reservation.controller';
import adminMiddleware from '@/middlewares/admin.middleware';

class ReservationRoute implements Routes {
  public path = '/reservation';
  public router = Router();
  private reservationController = new ReservationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.reservationController.bookReservation);
    this.router.get(`${this.path}`, adminMiddleware, this.reservationController.getAllReservations);
    this.router.patch(`${this.path}`, adminMiddleware, this.reservationController.updateReservation);
    this.router.delete(`${this.path}`, adminMiddleware, this.reservationController.deleteReservation);
  }
}

export default ReservationRoute;
