import Sprint from '../models/Sprint.js';
import Project from '../models/Project.js';

class SprintService {
  async getAllSprint() {
    const sprints = await Sprint.find();

    return sprints;
  }

  async getSprintById(userId, sprintId) {
    const sprint = await Sprint.findById(sprintId);

    const project = await Project.find({
      _id: sprint.projectId,
      'members.user': userId,
    });

    if (!project) {
      throw new Error('Unauthorized');
    }

    return sprint;
  }

  async getSprintByProjectId(userId, projectId) {
    const project = await Project.find({
      _id: projectId,
      'members.user': userId,
    });

    if (!project) {
      throw new Error('Unauthorized');
    }

    const sprint = await Sprint.find({ projectId });

    return sprint;
  }

  async updateSprint(userId, sprintId, sprintUpdate = {}) {
    const sprint = await Sprint.findById(sprintId);

    const project = await Project.find({
      _id: sprint.projectId,
      'members.user': userId,
    });

    if (!project) {
      throw new Error('Unauthorized');
    }

    const updatedSprint = await Sprint.findByIdAndUpdate(
      sprintId,
      sprintUpdate,
      {
        new: true,
      }
    );

    return updatedSprint;
  }

  async addTasksIntoSprint(userId, sprintId, sprintTasks) {
    const sprint = await Sprint.findById(sprintId);

    const project = await Project.find({
      _id: sprint.projectId,
      'members.user': userId,
    });

    if (!project) {
      throw new Error('Unauthorized');
    }

    const updatedSprint = await Sprint.updateOne(
      { _id: sprintId },
      { $push: { tasks: sprintTasks } },
      {
        new: true,
      }
    );

    return updatedSprint;
  }

  async removeTaskFromSprint(userId, sprintId, taskId) {
    const sprint = await Sprint.findById(sprintId);

    const project = await Project.find({
      _id: sprint.projectId,
      'members.user': userId,
    });

    if (!project) {
      throw new Error('Unauthorized');
    }

    const updatedSprint = await Sprint.findByIdAndUpdate(
      sprintId,
      { $pull: { tasks: taskId } },
      {
        new: true,
      }
    );

    return updatedSprint;
  }

  async deleteSprint(userId, sprintId) {
    const sprint = await Sprint.findById(sprintId);

    const project = await Project.find({
      _id: sprint.projectId,
      'members.user': userId,
    });

    if (!project) {
      throw new Error('Unauthorized');
    }

    const deletedSprint = await Sprint.findByIdAndDelete(sprintId);

    return deletedSprint;
  }

  async createSprint(userId, sprint) {
    const project = await Project.findOne({
      _id: sprint.projectId,
      'members.user': userId,
    });

    if (!project) {
      throw new Error('Unauthorized');
    }

    const newSprint = new Sprint({
      ...sprint,
      key: project.prefix + '-' + 'sprint' + '-' + (project.sprintCount + 1),
    });

    project.sprintCount += 1;

    await newSprint.save();
    await project.save();

    return newSprint;
  }
}

export default SprintService;
