import { Schema, Types, model } from 'mongoose';
export interface IReservation {
  customerId?: Types.ObjectId;
  note?: string;
  contacts: {
    phone: string;
    email: string;
  };
  underName?: string;
  bookingTime: string | number;
  reservationFor: string;
  attrs: {
    [key: string]: number | string;
  };
}

const reservationSchema = new Schema<IReservation>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    note: {
      type: String,
      required: false,
    },
    contacts: {
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    underName: {
      type: String,
      required: false,
    },
    bookingTime: {
      type: String || Number,
      required: true,
    },
    reservationFor: {
      type: String,
      required: false,
      default: 'table',
    },
    attrs: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  { timestamps: true },
);

export default model('Reservation', reservationSchema);
