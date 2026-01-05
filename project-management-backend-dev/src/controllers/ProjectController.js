export default class ProjectController {
  constructor(projectService) {
    this.projectService = projectService;
  }

  getAllProjects = async (req, res, next) => {
    try {
      const projects = await this.projectService.getAllProjects(req.user._id);

      res.json(projects);
    } catch (error) {
      next(error);
    }
  };

  getProjectById = async (req, res, next) => {
    try {
      const projectId = req.params.id;
      const project = await this.projectService.getProjectById(
        req.user._id,
        projectId
      );

      if (!project) {
        res.status(404);
        return next(new Error('Project by given id not found'));
      }

      res.json({
        success: true,
        result: project,
      });
    } catch {
      res.status(404);
      next(new Error('Project by given id not found(in catch block)'));
    }
  };

  updateProject = async (req, res, next) => {
    try {
      const project = await this.projectService.updateProject(
        req.user._id,
        req.params.id,
        req.body
      );

      res.json({
        success: true,
        result: project,
        message: 'Project updated successfully',
      });
    } catch (error) {
      res.status(400);
      next(error);
    }
  };

  deleteProject = async (req, res, next) => {
    try {
      const project = await this.projectService.deleteProject(
        req.user._id,
        req.params.id
      );
      if (!project) {
        res.status(404);
        return next(new Error('Project by given id not found'));
      }

      res.json({
        success: true,
        result: project,
        message: 'project successfully deleted',
      });
    } catch {
      res.status(404);
      next(new Error('Project by given id not found'));
    }
  };

  createProject = async (req, res, next) => {
    try {
      const project = await this.projectService.createProject(
        req.user._id,
        req.body
      );

      res.json({
        success: true,
        result: project,
        message: 'Project created successfully',
      });
    } catch (error) {
      res.status(400);
      next(error);
    }
  };

  getUserByProjectId = async (req, res, next) => {
    try {
      const project = await this.projectService.getUserByProjectId(
        req.params.id
      );

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
        });
      }

      const users = project.members.map((member) => member.user);

      res.json({
        success: true,
        result: users,
      });
    } catch (err) {
      next(err);
    }
  };

  getProjectsByUserId = async (req, res, next) => {
    try {
      const userId = req.user._id;
      const projects = await this.projectService.getProjectsByUserId(userId);
      console.log(projects);

      res.json({
        success: true,
        result: projects,
      });
    } catch (error) {
      next(error);
    }
  };
}
