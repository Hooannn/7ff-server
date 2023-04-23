import { Schema, model, Types } from 'mongoose';

export interface IUser {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  address?: string;
  phoneNumber?: string;
  refreshToken?: string;
  avatar?: string;
  orders?: Types.ObjectId[];
  cartItems?: {
    product: Types.ObjectId;
    quantity: number;
  }[];
  role: IRole;
}

type IRole = 'User' | 'Admin' | 'SuperAdmin';

const userSchema = new Schema<IUser>(
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
        product: {
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

userSchema.pre('save', function (next) {
  if (!this.avatar) this.avatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqtrHsVnbfPaERaPm8v_vcvIXYxCGR0Lnbcw&usqp=CAU';
  next();
});

export default model('User', userSchema);
