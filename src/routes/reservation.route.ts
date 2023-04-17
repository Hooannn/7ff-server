import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import ReservationController from '@/controllers/reservation.controller';

class ReservationRoute implements Routes {
  public path = '/reservation';
  public router = Router();
  private reservationController = new ReservationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.reservationController.bookReservation);
  }
}

export default ReservationRoute;
