import express from 'express';

import { saveSubscription } from '../controllers/pushNotificationController.js';
import { getAllNotificationsByProject } from '../controllers/pushNotificationController.js';

const notificationRouter = express.Router();

// notificationRouter.post('/send', sendPushNotification);
notificationRouter.post('/subscribe', saveSubscription);
notificationRouter.get('/get/:id', getAllNotificationsByProject);

export default notificationRouter;
