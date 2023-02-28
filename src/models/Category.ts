import { Schema, model } from 'mongoose';

interface ICategory {
  name: string;
  description: string;
  icon?: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
    },
  },
  { timestamps: true },
);

export default model('Category', categorySchema);
