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
    },
    password: {
      type: String,
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
