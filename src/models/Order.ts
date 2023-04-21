import ProductsService from '../services/products.service';
import { Schema, model, Types } from 'mongoose';

export interface IOrder {
  customerId: Types.ObjectId;
  items: {
    product: Types.ObjectId | string;
    quantity: number;
  }[];
  totalPrice: number;
  voucher: Types.ObjectId;
  note?: string;
  isDelivery: boolean;
  deliveryAddress?: string;
  deliveryPhone?: string;
  status: 'Processing' | 'Delivering' | 'Done' | 'Cancelled';
}

const orderSchema = new Schema<IOrder>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    items: [
      {
        product: {
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
  return priceAfterDiscount || totalPrice;
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
  return originalPrice || currentPrice;
}

async function calculateTotalPrice(items: { product: string | Types.ObjectId; quantity: number }[]) {
  const productsService = new ProductsService();
  const { totalPrice, failedProducts } = await productsService.getProductsPrice(items);
  return { totalPrice: totalPrice || 0, failedProducts };
}

orderSchema.pre('save', async function (next) {
  const { totalPrice, failedProducts } = await calculateTotalPrice(this.items);
  const appliedVoucher = this.voucher?.toString();
  const priceAfterDiscount = await getPriceAfterDiscount(appliedVoucher, totalPrice, () => {
    this.voucher = null;
  });
  if (failedProducts.length) this.items = this.items.filter(item => failedProducts.includes(item.product.toString));
  this.totalPrice = priceAfterDiscount;
  next();
});

// USECASE: Admin update order items or voucher -> calculate totalPrice again
// TODO: Handle update order items case
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
  const originalPrice = await getOriginalPrice(previousVoucher, order.totalPrice);
  const priceAfterDiscount = await getPriceAfterDiscount(modifiedVoucher, originalPrice, () => {
    this.set('voucher', null);
  });
  this.set('totalPrice', priceAfterDiscount);
  next();
});

export default model('Order', orderSchema);
