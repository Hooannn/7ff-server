import Reservation, { IReservation } from '@/models/Reservation';
class ReservationService {
  private Reservation = Reservation;
  public async bookReservation(reqReservation: Partial<IReservation>) {
    const reservation = new this.Reservation(reqReservation);
    await reservation.save();
    return reservation;
  }

  public async getAllReservations({ skip, limit, filter, sort }: { skip?: number; limit?: number; filter?: string; sort?: string }) {
    const parseFilter = JSON.parse(filter ? filter : '{}');
    const parseSort = JSON.parse(sort ? sort : '{ "createdAt": "-1" }');
    const total = await this.Reservation.countDocuments(parseFilter).sort(parseSort);
    const reservations = await this.Reservation.find(parseFilter, null, { limit, skip }).sort(parseSort);
    return { total, reservations };
  }

  public async deleteReservation(reservationId: string) {
    return this.Reservation.findByIdAndDelete(reservationId);
  }

  public async updateReservation(reservationId: string, product: IReservation) {
    return await this.Reservation.findOneAndUpdate({ _id: reservationId }, product, { returnOriginal: false });
  }
}

export default ReservationService;
