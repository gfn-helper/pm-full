import express from 'express';
import path from 'path';
import multer from 'multer';
import checkExist from '../middlewares/checkExist.js';

import {
  commentsCreateSchema,
  commentUpdateSchema,
} from '../validators/commentsValidators.js';
import CommentsService from '../services/CommentsService.js';
import CommentsController from '../controllers/CommentsController.js';
import validate from '../middlewares/validate.js';
import Comments from '../models/Comments.js';

const storage = multer.diskStorage({
  destination: 'uploads/commentsAttachment',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.random(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);

    cb(null, `${basename}_${uniqueSuffix}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 2000000 } });

const commentsRouter = express.Router();

const commentsService = new CommentsService();
const commentsController = new CommentsController(commentsService);

commentsRouter.get('/', commentsController.getCommentsByTasksId);
commentsRouter.post(
  '/',
  upload.single('attachment'),
  validate(commentsCreateSchema),
  commentsController.createComments
);
commentsRouter.put(
  '/:id',
  validate(commentUpdateSchema),
  checkExist(Comments),
  commentsController.updateComments
);
commentsRouter.delete(
  '/:id',
  checkExist(Comments),
  commentsController.deleteComments
);

export default commentsRouter;
