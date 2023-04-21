import { successStatus } from '@/config';
import NodemailerService from '@/services/nodemailer.service';
import ReservationService from '@/services/reservation.service';
import { NextFunction, Request, Response } from 'express';
class ReservationController {
  private reservationService = new ReservationService();
  private nodemailerService = new NodemailerService();
  public bookReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { customerId, note, contacts, underName, bookingTime, attrs } = req.body;
      const results = await this.reservationService.bookReservation({ customerId, note, contacts, underName, bookingTime, attrs });
      this.nodemailerService.sendBookingConfirmationEmail(contacts.email, underName, bookingTime);
      res.status(201).json({ code: 201, success: true, data: results, message: successStatus.BOOK_RESERVATION_SUCCESSFULLY });
    } catch (error) {
      next(error);
    }
  };

  public getAllReservations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { skip, limit, filter, sort } = req.query;
      const { total, reservations } = await this.reservationService.getAllReservations({
        skip: parseInt(skip?.toString()),
        limit: parseInt(limit?.toString()),
        filter: filter?.toString(),
        sort: sort?.toString(),
      });
      res.status(200).json({ code: 200, success: true, data: reservations, total, took: reservations.length });
    } catch (error) {
      next(error);
    }
  };

  public updateReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.query;
      const { customerId, contacts, note, underName, bookingTime, reservationFor, attrs } = req.body;
      const results = await this.reservationService.updateReservation(id.toString(), {
        reservationFor,
        customerId,
        note,
        contacts,
        underName,
        bookingTime,
        attrs,
      });
      res.status(200).json({ code: 200, success: true, data: results, message: successStatus.UPDATE_SUCCESSFULLY });
    } catch (error) {
      next(error);
    }
  };

  public deleteReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.query;
      await this.reservationService.deleteReservation(id.toString());
      res.status(200).json({ code: 200, success: true, message: successStatus.DELETE_SUCCESSFULLY });
    } catch (error) {
      next(error);
    }
  };
}

export default ReservationController;
