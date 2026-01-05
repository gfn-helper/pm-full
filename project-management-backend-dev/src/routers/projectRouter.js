import express from 'express';
import ProjectController from '../controllers/ProjectController.js';
import ProjectService from '../services/ProjectService.js';

import {
  projectCreateValidator,
  projectUpdateValidator,
} from '../validators/projectValidator.js';
import validate from '../middlewares/validate.js';
import checkExist from '../middlewares/checkExist.js';
import Project from '../models/Project.js';

const projectRouter = express.Router();
const projectService = new ProjectService();
const projects = new ProjectController(projectService);

projectRouter.get('/', projects.getAllProjects);
projectRouter.get('/:id', projects.getProjectById);
projectRouter.post(
  '/',
  validate(projectCreateValidator),
  projects.createProject
);
projectRouter.put(
  '/:id',
  validate(projectUpdateValidator),
  checkExist(Project),
  projects.updateProject
);
projectRouter.delete('/:id', checkExist(Project), projects.deleteProject);
projectRouter.get('/get-user/:id', projects.getUserByProjectId);
projectRouter.get('/user-projects', projects.getProjectsByUserId);

export default projectRouter;
