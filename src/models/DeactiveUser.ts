import { Schema, model } from 'mongoose';
import { IUser } from './User';

const deactiveUserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      // unique: true,
    },
    refreshToken: {
      type: String,
    },
    address: {
      type: String,
    },
    avatar: {
      type: String,
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    cartItems: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: Number,
      },
    ],
    role: {
      type: String,
      enum: ['User', 'Admin', 'SuperAdmin'],
      default: 'User',
    },
  },
  { timestamps: true },
);

export default model('DeactiveUser', deactiveUserSchema);
