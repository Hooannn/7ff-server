import { Schema, model } from 'mongoose';

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
  category: string;
  available: boolean;
  rating: number;
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
      type: String,
      enum: ['Sandwich', 'Fried', 'Noodle', 'MilkTea', 'Tea', 'RicePaper'],
    },
    available: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 5,
    },
  },
  { timestamps: true },
);

export default model('Product', productSchema);
