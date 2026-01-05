import express from 'express';
import path from 'path';
import multer from 'multer';

import TaskController from '../controllers/TaskController.js';
import TasksService from '../services/TasksServices.js';
import {
  tasksCreateValidator,
  tasksUpdateValidator,
} from '../validators/tasksValidator.js';
import validate from '../middlewares/validate.js';
import checkExist from '../middlewares/checkExist.js';
import Tasks from '../models/Tasks.js';

const storage = multer.diskStorage({
  destination: 'uploads/attachments',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.random(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);

    cb(null, `${basename}_${uniqueSuffix}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 2000000 } });

const taskRouter = express.Router();
const taskService = new TasksService();
const taskController = new TaskController(taskService);

taskRouter.get('/users/batch', taskController.getMultipleUsers);
taskRouter.get('/', taskController.getAllTasks);
taskRouter.get('/user/:id', taskController.getUserDetailsById);
taskRouter.get('/batch', taskController.getTasksBatch);
taskRouter.get('/:id', checkExist(Tasks), taskController.getTaskById);
taskRouter.post(
  '/',
  upload.array('attachments', 5),
  validate(tasksCreateValidator),
  taskController.createTask
);
taskRouter.put(
  '/:id',
  validate(tasksUpdateValidator),
  checkExist(Tasks),
  taskController.updateTask
);
taskRouter.delete('/:id', checkExist(Tasks), taskController.deleteTask);
taskRouter.get('/projectId/:id', taskController.taskOfProjectId);

export default taskRouter;
