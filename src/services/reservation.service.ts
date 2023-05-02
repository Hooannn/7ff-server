import Reservation, { IReservation } from '@/models/Reservation';
import mongoose from 'mongoose';
class ReservationService {
  private Reservation = Reservation;
  public async bookReservation(reqReservation: Partial<IReservation>) {
    const reservation = new this.Reservation(reqReservation);
    await reservation.save();
    return reservation;
  }

  public async getAllReservations({ skip, limit, filter, sort }: { skip?: number; limit?: number; filter?: string; sort?: string }) {
    const parseFilter = JSON.parse(filter ? filter : '{}');
    const parseSort = JSON.parse(sort ? sort : '{ "bookingTime": "-1" }');
    const total = await this.Reservation.countDocuments(parseFilter).sort(parseSort);
    const reservations = await this.Reservation.find(parseFilter, null, { limit, skip }).sort(parseSort);
    return { total, reservations };
  }

  public async getUserReservations({ customerEmail, sort }: { customerEmail: string; sort: string }) {
    if (sort === 'status') {
      const orderOfStatus = ['Processing', 'Cancelled'];
      return this.Reservation.aggregate([
        { $match: { 'contacts.email': customerEmail } },
        { $addFields: { __order: { $indexOfArray: [orderOfStatus, '$status'] } } },
        { $sort: { __order: 1 } },
      ]);
    }
    return await this.Reservation.find({
      'contacts.email': customerEmail,
    }).sort(sort ? { [sort]: 1 } : { createdAt: -1 });
  }

  public async deleteReservation(reservationId: string) {
    return this.Reservation.findByIdAndDelete(reservationId);
  }

  public async updateReservation(reservationId: string, reservation: IReservation) {
    return await this.Reservation.findOneAndUpdate({ _id: reservationId }, reservation, { returnOriginal: false });
  }
}

export default ReservationService;
