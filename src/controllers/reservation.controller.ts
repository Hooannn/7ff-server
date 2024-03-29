import { CLIENT_URL, successStatus } from '@/config';
import NodemailerService from '@/services/nodemailer.service';
import ReservationService from '@/services/reservation.service';
import User from '@/models/User';
import { NextFunction, Request, Response } from 'express';
class ReservationController {
  private reservationService = new ReservationService();
  private nodemailerService = new NodemailerService();
  private User = User;

  public bookReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { customerId, note, contacts, underName, bookingTime, attrs } = req.body;
      const { locale } = req.query;
      const results = await this.reservationService.bookReservation({ customerId, note, contacts, underName, bookingTime, attrs });

      const foundUser = await this.User.findOne({ email: contacts.email });
      const mailHref = `${CLIENT_URL}/profile/reservations`;
      this.nodemailerService.sendBookingConfirmationEmail(
        contacts.email,
        Boolean(foundUser),
        results._id.toString(),
        underName,
        bookingTime,
        mailHref,
        locale?.toString(),
      );
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

  public getReservationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reservationId } = req.params;
      const reservation = await this.reservationService.getReservationById({
        reservationId: reservationId.toString(),
      });
      res.status(200).json({ code: 200, success: true, data: reservation });
    } catch (error) {
      next(error);
    }
  };

  public getUserReservations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, sort } = req.query;
      const reservations = await this.reservationService.getUserReservations({
        customerEmail: email?.toString(),
        sort: sort?.toString(),
      });
      res.status(200).json({ code: 200, success: true, data: reservations });
    } catch (error) {
      next(error);
    }
  };

  public updateReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.query;
      const { customerId, contacts, note, underName, bookingTime, reservationFor, attrs, status } = req.body;
      const results = await this.reservationService.updateReservation(id.toString(), {
        reservationFor,
        customerId,
        note,
        contacts,
        underName,
        bookingTime,
        attrs,
        status,
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
