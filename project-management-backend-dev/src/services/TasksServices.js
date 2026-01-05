import Project from '../models/Project.js';
import Sprint from '../models/Sprint.js';
import Tasks from '../models/Tasks.js';
import User from '../models/User.js';
import { pushNotificationToUser } from '../services/pushNotificationService.js';
import { sendEmailNotification } from './emailNotificationService.js';
export default class TasksService {
  async createTask(userId, task) {
    const project = await Project.findOne({
      _id: task.projectId,
      'members.user': userId,
    });

    if (!project) {
      throw new Error('Unauthorized');
    }

    const newTask = new Tasks({
      ...task,
      reporter: userId,
      key: project.prefix + '-' + (project.lastKey + 1),
    });

    project.lastKey = project.lastKey + 1;

    await newTask.save();
    await project.save();

    return { newTask, userId: userId };
  }

  async getAllTasks(userId) {
    const tasks = await Tasks.find({ assignee: userId });

    return tasks;
  }

  async getTasksByProjectId(userId, projectId, filter, searchInput) {
    let query = {};
    if (!filter) {
      query = {
        $or: [
          { title: { $regex: searchInput, $options: 'i' } },
          { description: { $regex: searchInput, $options: 'i' } },
        ],
      };
    } else {
      switch (filter.toLowerCase()) {
        case 'priority': {
          query = {
            priority: searchInput,
          };
          break;
        }
        case 'status': {
          query = {
            status: searchInput,
          };
          break;
        }
        case 'tags': {
          query = {
            tags: { $in: [new RegExp(searchInput, 'i')] },
          };
          break;
        }
        case 'assignee': {
          query = {
            assignee: searchInput,
          };
          break;
        }
      }
    }

    const project = await Project.find({
      _id: projectId,
      'members.user': userId,
    });

    if (!project) {
      throw new Error('Unauthorized');
    }

    query.projectId = projectId;

    const subTaskIds = await Tasks.distinct('subTask', {
      projectId,
    });

    if (subTaskIds.length) {
      query._id = { $nin: subTaskIds };
    }
    const tasks = await Tasks.find(query);

    return tasks;
  }

  async getTaskById(userId, taskId) {
    const task = await Tasks.findOne({ _id: taskId });

    const project = await Project.find({
      _id: task.projectId,
      'members.user': userId,
    });

    if (!project) {
      throw new Error('Unauthorized');
    }

    return task;
  }

  async updateTask(userId, taskId, taskUpdate = {}) {
    try {
      const task = await Tasks.findById(taskId);

      if (!task) {
        throw new Error('Task not found');
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const project = await Project.findOne({
        _id: task.projectId,
        'members.user': userId,
      });
      if (!project) {
        throw new Error('Unauthorized');
      }

      const updatedTask = await Tasks.findByIdAndUpdate(taskId, taskUpdate, {
        new: true,
      });
      const payload = {
        title: `Task ${updatedTask.key} of ${project.name} has been updated by ${user.name}`,
        message: `Task ${updatedTask.title} Updated`,
        taskId: updatedTask._id,
        projectId: updatedTask.projectId,
        profileImage: user.profileImage,
      };
      const assigneeId = updatedTask.assignee;

      console.log('assigneeId', assigneeId);

      if (assigneeId) {
        pushNotificationToUser(assigneeId, payload);
        sendEmailNotification(assigneeId, payload);
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async deleteTask(userId, taskId) {
    const task = await Tasks.findById(taskId);

    const project = await Project.find({
      _id: task.projectId,
      'members.user': userId,
    });

    if (!project) {
      throw new Error('Unauthorized');
    }

    const deletedTask = await Tasks.findByIdAndDelete(taskId, {
      new: true,
    });

    const sprintWithDeletedTask = await Sprint.findOne({ tasks: taskId });
    console.log(sprintWithDeletedTask);
    await Sprint.findByIdAndUpdate(sprintWithDeletedTask?._id, {
      $pull: { tasks: taskId },
    });

    const payload = {
      title: `Task "${task.key}" has been deleted by ${userId}`,
    };

    await pushNotificationToUser(userId, payload);

    return deletedTask;
  }

  async getUserById(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getUsersByIds(userIds) {
    const users = await User.find(
      { _id: { $in: userIds } },
      'name profileImage'
    );

    return users;
  }

  async getTasksByIds(userId, ids, projection = '_id title status priority assignee key updatedAt projectId') {
    const tasks = await Tasks.find({ _id: { $in: ids } }, projection);
    const projectIds = [...new Set(tasks.map((t) => String(t.projectId)))];
    const allowed = await Project.find({ _id: { $in: projectIds }, 'members.user': userId }).select('_id');
    const allowedSet = new Set(allowed.map((p) => String(p._id)));
    return tasks.filter((t) => allowedSet.has(String(t.projectId)));
  }

  async taskOfProjectId(userId, projectId) {
    const project = await Project.find({
      _id: projectId,
      'members.user': userId,
    });

    if (!project) {
      throw new Error('Unauthorized');
    }

    const tasks = await Tasks.find({ projectId: projectId });
    return tasks;
  }
}
