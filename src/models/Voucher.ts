import { Schema, model } from 'mongoose';

export interface IVoucher {
  code: string;
  discountType: DiscountType;
  discountAmount: number;
  expiredDate?: number;
  usersClaimed: string[];
  totalUsageLimit: number;
}

type DiscountType = 'percent' | 'amount';
const voucherSchema = new Schema<IVoucher>(
  {
    code: { type: String, required: true, unique: true },
    discountType: { type: String, required: true },
    discountAmount: { type: Number, required: true },
    expiredDate: { type: Number, required: false, min: 1 },
    usersClaimed: { type: [String], default: [] },
    totalUsageLimit: { type: Number, default: 1000 },
  },
  { timestamps: true },
);

export default model('Voucher', voucherSchema);
