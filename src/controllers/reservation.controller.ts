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
}

export default ReservationController;
