import Express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { config } from './config/config.js';
import loggerMiddleware from './middlewares/logger.js';
import errorHandler from './middlewares/errorHandler.js';
import authRouter from '../src/routers/authRouter.js';
import taskRouter from './routers/tasksRouter.js';
import projectRouter from './routers/projectRouter.js';
import sprintRouter from './routers/sprintRouter.js';
import isAuthenticated from './middlewares/isAuthenticated.js';
import commentsRouter from './routers/commentRouter.js';
import inviteRouter from './routers/inviteRouter.js';
import { createServer } from 'node:http';
import { setupSocketIo } from './services/notificationService.js';
import notificationRouter from './routers/notificationRouter.js';
import { notificationSchedular } from './utils/cronJobSetup.js';

connectDB();

const app = Express();
const port = config.PORT;
const server = createServer(app);

app.use('/uploads', Express.static('uploads'));
app.use(cors());
app.use(Express.json());
app.use(loggerMiddleware);

app.get('/', (req, res) => {
  res.json({ status: 'running' });
});

app.use('/auth', authRouter);
app.use('/tasks', isAuthenticated, taskRouter);
app.use('/project', isAuthenticated, projectRouter);
app.use('/sprint', isAuthenticated, sprintRouter);
app.use('/comments', isAuthenticated, commentsRouter);
app.use('/invite', inviteRouter);
app.use('/notification', notificationRouter);

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
  });
});

app.use(errorHandler);

notificationSchedular()
setupSocketIo(server);

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
