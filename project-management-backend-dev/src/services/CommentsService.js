import Comments from '../models/Comments.js';
import Project from '../models/Project.js';
import Tasks from '../models/Tasks.js';

export default class CommentsService {
  async getCommentsByTasksId(userId, taskId) {
    const comments = await Comments.find({ taskId: taskId }).populate(
      'author',
      'name profileImage'
    );

    const task = await Tasks.findById(taskId);

    if (!task) {
      throw new Error('Task id not found');
    }

    const project = await Project.find({
      _id: task.projectId,
      'members.user': userId,
    });

    if (!project) {
      throw new Error('Unauthorized');
    }

    return comments;
  }

  async updateComments(userId, commentId, commentUpdate = {}) {
    const comments = await Comments.findById(commentId).populate('taskId');

    const project = await Project.find({
      _id: comments.taskId.projectId,
      'members.user': userId,
    });

    if (!project) {
      throw new Error('Unauthorized');
    }

    const updateComment = await Comments.findOneAndUpdate(
      { _id: commentId },
      commentUpdate,
      { new: true }
    );

    return updateComment;
  }

  async deleteComments(userId, commentId) {
    const comments = await Comments.findById(commentId).populate('taskId');

    const project = await Project.find({
      _id: comments.taskId.projectId,
      'members.user': userId,
    });

    if (!project) {
      throw new Error('Unauthorized');
    }

    const deletedComment = await Comments.findByIdAndDelete(commentId);

    return deletedComment;
  }

  async createComments(userId, comments) {
    const task = await Tasks.findById(comments.taskId);

    const project = await Project.find({
      _id: task.projectId,
      'members.user': userId,
    });

    if (!project) {
      throw new Error('Unauthorized');
    }

    const newComments = new Comments({ ...comments, author: userId });

    await newComments.save();

    return newComments;
  }
}
