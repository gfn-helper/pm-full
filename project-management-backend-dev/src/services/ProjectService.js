import Project from '../models/Project.js';
import User from '../models/User.js';
class ProjectService {
  async getAllProjects(userId) {
    const projects = await Project.find({ 'members.user': userId });

    return projects;
  }

  async getProjectById(userId, projectId) {
    const project = await Project.findOne({
      _id: projectId,
      'members.user': userId,
    });

    return project;
  }

  async updateProject(userId, projectId, projectUpdate = {}) {
    const project = await Project.findOneAndUpdate(
      {
        _id: projectId,
        'members.user': userId,
        'members.role': 'admin',
      },
      projectUpdate
    );

    return project;
  }

  async deleteProject(userId, projectId) {
    const project = await Project.findOneAndDelete({
      _id: projectId,
      'members.user': userId,
      'members.role': 'admin',
    });

    return project;
  }

  async createProject(userId, project) {
    const newProject = new Project({
      ...project,
      memberLead: userId,
      members: { user: userId, role: 'admin' },
      prefix: project.name
        .split(' ')
        .map((word) => word[0].toUpperCase())
        .join(''),
    });

    await newProject.save();

    return newProject;
  }

  async getUserById(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getUserByProjectId(projectId) {
    const project = Project.findById(projectId).populate(
      'members.user',
      'name email profileImage onlineStatus'
    );

    return project;
  }

  async getProjectsByUserId(userId) {
    const projects = Project.find({ members: { $in: userId } });
    console.log('the projects are:', projects);

    return projects;
  }
}

export default ProjectService;
