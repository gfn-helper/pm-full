import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import UserService from './UserService.js';
import ProjectService from './ProjectService.js';
import { config } from '../config/config.js';
import User from '../models/User.js';

let io = null;

export function setupSocketIo(server) {
  try {
    io = new Server(server, {
      cors: {
        origin: '*',
      },
    });
    io.on('connection', async (socket) => {
      try {
        //user is connected
        console.log('A user is connected');

        //get the token and verify
        const token = socket.handshake.auth.token;
        const payload = jwt.verify(token, config.JWT_ACCESS_KEY);

        //have the user
        const user = await new UserService().getUserById(payload.userId);

        //get the project to which the user is connected to
        const projects = await new ProjectService().getAllProjects(user._id);
        console.log(projects);

        //make the user join all the rooms that he belongs to
        socket.join(projects.map((project) => project._id.toString()));

        //now update the users status
        await User.findByIdAndUpdate(user._id, { onlineStatus: 'online' });

        //broadcast that user is online to every member of the project the user is part of
        projects.forEach((project) => {
          updateUserStatusInRoom(project, user._id, 'online');
        });
        console.log(projects);

        socket.on('disconnect', async () => {
          console.log('user disconnected', user._id);

          await User.findByIdAndUpdate(user._id, { onlineStatus: 'offline' });
        });
      } catch (error) {
        console.log(error);
        socket.disconnect();
      }
    });
  } catch (error) {
    console.error(error);
  }
}

async function updateUserStatusInRoom(projectId, username, status) {
  try {
    // Emit to the project room that the user's status has changed
    io.to(projectId).emit('userStatusChanged', {
      success: true,
    });
  } catch (err) {
    console.error('Error updating user status:', err);
  }
}
