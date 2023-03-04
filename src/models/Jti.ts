import { Schema, model } from 'mongoose';

interface Jti {
  isUsed: boolean;
}

const JtiSchema = new Schema<Jti>(
  {
    isUsed: {
      type: Boolean,
    },
  },
  { timestamps: true },
);

export default model('Jti', JtiSchema);
