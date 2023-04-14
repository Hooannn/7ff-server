import { IContent } from '@/interfaces';
import { Schema, model, Types } from 'mongoose';

export interface IProduct {
  name: IContent;
  description: IContent;
  price: number;
  yearlyTotalSales: number;
  yearlyTotalSoldUnits: number;
  monthlyData: {
    month: string;
    totalSales: number;
    totalUnits: number;
  }[];
  stocks: number;
  category: Types.ObjectId;
  isAvailable: boolean;
  rating: number;
  views?: Types.ObjectId[];
  viewsCount?: number;
  featuredImages?: string[];
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      vi: {
        type: String,
        required: true,
      },
      en: {
        type: String,
        required: true,
      },
    },
    description: {
      vi: {
        type: String,
        required: true,
      },
      en: {
        type: String,
        required: true,
      },
    },
    price: {
      type: Number,
      required: true,
    },
    stocks: {
      type: Number,
      required: true,
    },
    yearlyTotalSales: Number,
    yearlyTotalSoldUnits: Number,
    monthlyData: [
      {
        month: String,
        totalSales: Number,
        totalUnits: Number,
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 5,
    },
    views: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    viewsCount: {
      type: Number,
    },
    featuredImages: [{ type: String }],
  },
  { timestamps: true },
);

export default model('Product', productSchema);
