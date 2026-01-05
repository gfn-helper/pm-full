import express from 'express';
import multer from 'multer';
import path from 'path';

import AuthController from '../controllers/AuthController.js';
import UserService from '../services/UserService.js';
import validate from '../middlewares/validate.js';
import {
  userLoginValidator,
  userSignupValidator,
} from '../validators/userValidator.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const storage = multer.diskStorage({
  destination: 'uploads/profile',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.random(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);

    cb(null, `${basename}_${uniqueSuffix}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 500000 } });

const userService = new UserService();
const authController = new AuthController(userService);
const authRouter = express.Router();

authRouter.post(
  '/signup',
  validate(userSignupValidator),
  authController.signup
);
authRouter.post('/login', validate(userLoginValidator), authController.login);
authRouter.post('/verify', authController.verify);
authRouter.post('/forgot-password', authController.resetPassword);
authRouter.post('/send-otp', authController.sendOtp);
authRouter.get('/refresh-token', isAuthenticated, authController.refreshToken);
authRouter.post(
  '/user-update',
  isAuthenticated,
  upload.single('profileImage'),
  authController.updateUser
);
authRouter.get('/user', isAuthenticated, authController.getUser);

export default authRouter;
