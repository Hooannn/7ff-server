import { Schema, model } from 'mongoose';
import type { IContent } from '@/interfaces';
interface ICategory {
  name: IContent;
  description: IContent;
  icon?: string;
}

const categorySchema = new Schema<ICategory>(
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
    icon: {
      type: String,
    },
  },
  { timestamps: true },
);

export default model('Category', categorySchema);
