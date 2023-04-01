import { Schema, model } from 'mongoose';

export interface IVoucher {
  code: string;
  discountType: DiscountType;
  discountAmount: number;
  expiredDate?: string;
}

type DiscountType = 'percent' | 'amount';
const voucherSchema = new Schema<IVoucher>(
  {
    code: { type: String, required: true, unique: true },
    discountType: { type: String, required: true },
    discountAmount: { type: Number, required: true },
    expiredDate: { type: String, required: false },
  },
  { timestamps: true },
);

export default model('Voucher', voucherSchema);
