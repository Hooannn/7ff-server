import { Schema, model, Types } from 'mongoose';

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
  avatar?: string;
  orders: Types.ObjectId[];
  cartItems: {
    productId: Types.ObjectId;
    quantity: Number;
  }[];
  role: IRole;
}

type IRole = 'User' | 'Admin' | 'SuperAdmin';

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
      max: 25,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    orders: {
      types: [Schema.Types.ObjectId],
      ref: 'Order',
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

export default model('User', userSchema);
