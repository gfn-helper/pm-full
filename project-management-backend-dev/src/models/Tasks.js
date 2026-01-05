import mongoose from 'mongoose';

const tasksSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    type: {
      type: String,
      enum: ['bug', 'task', 'story'],
      required: true,
    },
    key: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    tags: {
      type: [String],
      default: [],
    },
    blocks: {
      type: [String],
      default: [],
    },
    blockedBy: {
      type: [String],
      default: [],
    },
    relatesTo: {
      type: [String],
      default: [],
    },
    dueDate: {
      type: Date,
      default: null,
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    storyPoint: {
      type: Number,
      default: 0,
    },
    subTask: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'Task',
        },
      ],
      default: [],
    },
    attachments: {
      type: [String],
      default: [],
    },
    parentTask: {
      type: mongoose.Types.ObjectId,
      ref: 'Task',
      default: null,
    },
  },
  { timestamps: true }
);

tasksSchema.index({ projectId: 1 });

tasksSchema.index({ status: 1 });

tasksSchema.index({ assignee: 1 });

tasksSchema.index({ title: 'text', tags: 'text' });

const Tasks = mongoose.model('Tasks', tasksSchema);

export default Tasks;
