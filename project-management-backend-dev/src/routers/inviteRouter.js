import express from 'express';
import {
  inviteUsers,
  acceptUsersInvite,
} from '../controllers/inviteUserController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const inviteRouter = express.Router();

inviteRouter.post('/email', inviteUsers);
inviteRouter.get('/join', isAuthenticated, acceptUsersInvite);

export default inviteRouter;
