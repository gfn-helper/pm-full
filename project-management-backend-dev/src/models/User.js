import mongoose from 'mongoose';
import { string } from 'yup';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  profileImage: { type: String, default: null },
  projects: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Project',
      },
    ],
    default: [],
  },
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
  preferences: {
    type: Boolean,
    default: true,
  },
  role: { type: String, default: 'admin' },
  onlineStatus: {
    type: String,
    enum: ['offline', 'online'],
    default: 'offline',
  },
});

const User = mongoose.model('User', userSchema);

export default User;
