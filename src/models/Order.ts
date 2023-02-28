import { Schema, model, Types } from 'mongoose';

interface IOrder {
  customerId: Types.ObjectId;
  items: {
    productId: Types.ObjectId;
    quantity: number;
  }[];
  totalPrice: number;
  discount?: number;
  note?: string;
  status: string;
}

const orderSchema = new Schema<IOrder>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: Number,
      },
    ],
    totalPrice: Number,
    discount: {
      type: Number,
      default: 0,
    },
    note: String,
    status: {
      type: String,
      enum: ['Processing', 'Delivering', 'Done', 'Cancelled'],
      default: 'Processing',
    },
  },
  { timestamps: true },
);

export default model('Order', orderSchema);
