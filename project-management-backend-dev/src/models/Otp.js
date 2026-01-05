import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    value: { type: Number, required: true },
    expiry: {
      type: Date,
      required: true,
      default: new Date(Date.now() + 120 * 1000),
    },
  },
  {
    timestamps: true,
  }
);

const Otp = mongoose.model('Otp', otpSchema);

export default Otp;
