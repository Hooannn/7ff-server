import { errorStatus } from '@/config';
import ProductsService from '../services/products.service';
import { Schema, model, Types } from 'mongoose';
import { HttpException } from '@/exceptions/HttpException';

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
  rating?: number;
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
    rating: Number,
    status: {
      type: String,
      enum: ['Processing', 'Delivering', 'Done', 'Cancelled'],
      default: 'Processing',
    },
  },
  { timestamps: true },
);

async function getPriceAfterDiscount(appliedVoucher: string | null, totalPrice: number, customerId: string) {
  const VoucherModel = model('Voucher');
  let priceAfterDiscount: number | null = null;
  if (appliedVoucher) {
    const voucher = await VoucherModel.findOne({
      _id: appliedVoucher,
      totalUsageLimit: { $gt: 0 },
      usersClaimed: { $nin: customerId },
      expiredDate: { $gt: Date.now() },
    });
    if (!voucher) throw new HttpException(400, errorStatus.VOUCHER_NOT_FOUND);
    if (voucher.discountType === 'percent') {
      priceAfterDiscount = totalPrice - (totalPrice * voucher.discountAmount) / 100;
    } else {
      priceAfterDiscount = totalPrice - voucher.discountAmount / 100;
    }
    await voucher.update({ $inc: { totalUsageLimit: -1 }, $addToSet: { usersClaimed: customerId } });
  }
  return priceAfterDiscount || totalPrice;
}

async function calculateTotalPrice(items: { product: string | Types.ObjectId; quantity: number }[]) {
  const productsService = new ProductsService();
  const { totalPrice, failedProducts } = await productsService.getProductsPrice(items);
  return { totalPrice: totalPrice || 0, failedProducts };
}

orderSchema.pre('save', async function (next) {
  const DEFAULT_SHIPPING_FEE = 20000;
  const { totalPrice, failedProducts } = await calculateTotalPrice(this.items);
  const appliedVoucher = this.voucher?.toString();
  const priceAfterDiscount = await getPriceAfterDiscount(appliedVoucher, totalPrice, this.customerId.toString());
  if (failedProducts.length) this.items = this.items.filter(item => failedProducts.includes(item.product.toString()));
  this.totalPrice = totalPrice < 300000 && this.isDelivery ? priceAfterDiscount + DEFAULT_SHIPPING_FEE : priceAfterDiscount;
  next();
});

orderSchema.pre('findOneAndUpdate', async function (next) {
  const productsService = new ProductsService();
  const modifiedStatus = (this.getUpdate() as any).status;
  const order = await this.model.findOne(this.getQuery());
  const { items } = order;
  if (order.status === modifiedStatus) return next();
  if (modifiedStatus === 'Done') {
    productsService.updateProductSales(items, order.createdAt);
  }
  if (order.status === 'Done') {
    productsService.revertProductSales(items, order.createdAt);
  }
  next();
});

// orderSchema.pre('findOneAndDelete', async function (next) {
//   const productsService = new ProductsService();
//   const order = await this.model.findOne(this.getQuery());
//   const { items, status } = order;
//   if (status === 'Done') productsService.revertProductSales(items, order.createdAt);
//   next();
// });
export default model('Order', orderSchema);
