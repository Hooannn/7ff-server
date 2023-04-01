import { Schema, model, Types } from 'mongoose';

export interface IOrder {
  customerId: Types.ObjectId;
  items: {
    productId: Types.ObjectId;
    quantity: number;
  }[];
  totalPrice: number;
  voucher: Types.ObjectId;
  note?: string;
  isDelivery: boolean;
  deliveryAddress?: string;
  deliveryPhone?: string;
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
    voucher: {
      type: Schema.Types.ObjectId,
      ref: 'Voucher',
    },
    note: String,
    isDelivery: {
      type: Boolean,
      default: false,
    },
    deliveryAddress: String,
    deliveryPhone: String,
    status: {
      type: String,
      enum: ['Processing', 'Delivering', 'Done', 'Cancelled'],
      default: 'Processing',
    },
  },
  { timestamps: true },
);

async function getPriceAfterDiscount(appliedVoucher: string | null, totalPrice: number, voucherExpiredCallback: () => void) {
  const VoucherModel = model('Voucher');
  let priceAfterDiscount: number | null = null;
  if (appliedVoucher) {
    const voucher = (await VoucherModel.findById(appliedVoucher)) as any;
    if (!voucher) return 0;
    if (voucher.expiredDate && voucher.expiredDate < Date.now()) {
      voucherExpiredCallback();
      return 0;
    }
    if (voucher.discountType === 'percent') {
      priceAfterDiscount = totalPrice - totalPrice * voucher.discountAmount;
    } else {
      priceAfterDiscount = totalPrice - voucher.discountAmount;
    }
  }
  return priceAfterDiscount;
}

async function getOriginalPrice(appliedVoucher: string | null, currentPrice: number) {
  const VoucherModel = model('Voucher');
  let originalPrice: number | null = null;
  if (appliedVoucher) {
    const voucher = (await VoucherModel.findById(appliedVoucher)) as any;
    if (!voucher) return 0;
    if (voucher.discountType === 'percent') {
      originalPrice = currentPrice / (1 - voucher.discountAmount);
    } else {
      originalPrice = currentPrice + voucher.discountAmount;
    }
  }
  return originalPrice;
}

orderSchema.pre('save', async function (next) {
  const appliedVoucher = this.voucher?.toString();
  if (!appliedVoucher) return next();
  const priceAfterDiscount = await getPriceAfterDiscount(appliedVoucher, this.totalPrice, () => {
    this.voucher = null;
  });
  this.totalPrice = priceAfterDiscount;
  next();
});

orderSchema.pre('findOneAndUpdate', async function (next) {
  const modifiedVoucher = (this.getUpdate() as any).voucher;
  const order = await this.model.findOne(this.getQuery());
  if ((modifiedVoucher === null || modifiedVoucher === '') && order.voucher) {
    const originalPrice = await getOriginalPrice(order.voucher.toString(), order.totalPrice);
    this.set('totalPrice', originalPrice);
    return next();
  }
  if (!modifiedVoucher) {
    return next();
  }
  const previousVoucher = order.voucher?.toString();
  if (previousVoucher == modifiedVoucher.toString()) {
    return next();
  }
  const currentPrice = order.totalPrice;
  const priceAfterDiscount = await getPriceAfterDiscount(modifiedVoucher, currentPrice, () => {
    this.set('voucher', null);
  });
  this.set('totalPrice', priceAfterDiscount);
  next();
});

export default model('Order', orderSchema);
