import express from 'express';
import SprintController from '../controllers/SprintController.js';
import SprintService from '../services/SprintService.js';
import {
  sprintCreateValidator,
  sprintUpdateValidator,
} from '../validators/sprintValidator.js';
import validate from '../middlewares/validate.js';
import checkExist from '../middlewares/checkExist.js';
import Sprint from '../models/Sprint.js';

const sprintRouter = express.Router();
const sprintService = new SprintService();
const sprintController = new SprintController(sprintService);

sprintRouter.get('/', sprintController.getAllSprints);
sprintRouter.get('/:id', sprintController.getSprintById);
sprintRouter.post(
  '/',
  validate(sprintCreateValidator),
  sprintController.createSprint
);
sprintRouter.put(
  '/:id',
  validate(sprintUpdateValidator),
  checkExist(Sprint),
  sprintController.updateSprint
);
sprintRouter.patch(
  '/:id/addTasks',
  validate(sprintUpdateValidator),
  checkExist(Sprint),
  sprintController.addTasksIntoSprint
);
sprintRouter.patch(
  '/:id/removeTasks',
  validate(sprintUpdateValidator),
  checkExist(Sprint),
  sprintController.removeTaskFromSprint
);
sprintRouter.delete('/:id', checkExist(Sprint), sprintController.deleteSprint);

export default sprintRouter;
