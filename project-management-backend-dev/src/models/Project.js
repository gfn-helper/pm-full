import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    projectType: {
      type: String,
      enum: ['kanban', 'scrum'],
      required: true,
    },
    columns: {
      type: [String],
      default: ['todo', 'in-progress', 'done', 'review'],
    },
    members: {
      type: [
        {
          user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
          },
          role: { type: String, enum: ['member', 'admin'] },
        },
      ],
      default: [],
    },
    memberLead: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
      trim: true,
    },
    prefix: {
      type: String,
    },
    lastKey: {
      type: Number,
      default: 0,
      min: 0,
    },
    sprintCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    currentSprint: {
      type: mongoose.Types.ObjectId,
      ref: 'Sprint',
      default: null,
      trim: true,
    }
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
