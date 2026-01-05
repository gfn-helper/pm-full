import mongoose from 'mongoose';

const sprintSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
  },
  tasks: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Project',
      },
    ],
    default: [],
  },
  dueDate: { type: Date },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  storyPoint: {
    type: Number,
    default: 0,
  },
  projectId: {
    type: mongoose.Types.ObjectId,
    ref: 'Project',
  },
},
  {
    timestamps: true,
  }
);

const Sprint = mongoose.model('Sprint', sprintSchema);

export default Sprint;
