import { Schema, model, Types } from 'mongoose';

interface IProduct {
  name: string;
  description: string;
  price: number;
  yearlyTotalSales: number;
  yearlyTotalSoldUnits: number;
  monthlyData: {
    month: string;
    totalSales: number;
    totalUnits: number;
  }[];
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
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
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