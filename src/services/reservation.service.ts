import Reservation, { IReservation } from '@/models/Reservation';
class ReservationService {
  private Reservation = Reservation;
  public async bookReservation(reqReservation: Partial<IReservation>) {
    const reservation = new this.Reservation(reqReservation);
    await reservation.save();
    return reservation;
  }
}

export default ReservationService;
