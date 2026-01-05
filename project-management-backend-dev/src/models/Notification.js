import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    taskId: {
      type: String,
    },
    projectId: {
      type: String,
    },
    title: {
      type: String,
      default: 'Notification',
    },
    message: {
      type: String,
    },
    profileImage: { type: String, default: null },
    unread: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
