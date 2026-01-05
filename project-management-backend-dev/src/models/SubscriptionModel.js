import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Types.ObjectId,
    ref: 'Project',
  },
  endpoint: String,
  keys: {
    p256dh: String,
    auth: String,
  },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
