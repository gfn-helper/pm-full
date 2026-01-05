import mongoose from 'mongoose';

const commentsSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tasks',
      required: true,
    },
    message: {
      type: 'String',
      required: true,
      trim: true,
      minlength: 1,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attachment: { type: String, default: null },
  },
  { timestamps: true }
);

const Comments = mongoose.model('Comments', commentsSchema);

export default Comments;
