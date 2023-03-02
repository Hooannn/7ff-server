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
  { timestamps: false },
);

export default model('Jti', JtiSchema);
