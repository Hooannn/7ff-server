import { IContent } from '@/interfaces';
import { Schema, model, Types } from 'mongoose';
interface IViewCount {
  time: number;
  count: number;
}
export interface IProduct {
  name: IContent;
  description: IContent;
  price: number;
  yearlyData: {
    year: string;
    totalSales: number;
    totalUnits: number;
  }[];
  monthlyData: {
    month: string;
    year: string;
    totalSales: number;
    totalUnits: number;
  }[];
  weeklyData: {
    week: string;
    year: string;
    totalSales: number;
    totalUnits: number;
  }[];
  dailyData: {
    time: number;
    totalSales: number;
    totalUnits: number;
  };
  stocks: number;
  category: Types.ObjectId;
  isAvailable: boolean;
  rating: number;
  dailyViewCount?: IViewCount;
  weeklyViewCount?: IViewCount;
  monthlyViewCount?: IViewCount;
  yearlyViewCount?: IViewCount;
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
      required: false,
      default: 1000000,
    },
    dailyData: {
      time: { type: Number, default: 0 },
      totalSales: Number,
      totalUnits: Number,
    },
    yearlyData: [
      {
        year: String,
        totalSales: Number,
        totalUnits: Number,
      },
    ],
    monthlyData: [
      {
        month: String,
        year: String,
        totalSales: Number,
        totalUnits: Number,
      },
    ],
    weeklyData: [
      {
        week: String,
        year: String,
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
    dailyViewCount: {
      time: {
        type: Number,
        default: Date.now(),
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    weeklyViewCount: {
      time: {
        type: Number,
        default: Date.now(),
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    monthlyViewCount: {
      time: {
        type: Number,
        default: Date.now(),
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    yearlyViewCount: {
      time: {
        type: Number,
        default: Date.now(),
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    featuredImages: [{ type: String }],
  },
  { timestamps: true },
);

export default model('Product', productSchema);
