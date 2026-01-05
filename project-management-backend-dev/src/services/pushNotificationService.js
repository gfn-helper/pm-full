import Project from '../models/Project.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Subscription from '../models/SubscriptionModel.js';
import webPushNotification from './webPushService.js';

export async function pushNotificationToProject(projectId, payload) {
  const project = await Project.findById(projectId).populate({
    path: 'members.user',
    select: 'subscription',
  });

  if (!project) {
    throw new Error('Project not found');
  }

  for (const member of project.members) {
    if (!member.user?.subscription) {
      continue;
    }

    const subscription = await Subscription.findOne({
      _id: member.user.subscription,
    });

    console.log('subscription', subscription);

    webPushNotification(subscription, payload);
  }
}
export async function pushNotificationToUser(userId, payload) {
  const user = await User.findById(userId).populate('subscription');

  console.log('user', user);

  if (!user) {
    throw new Error('User not found');
  }

  const notification = await Notification.create({
    userId: user._id.toString(),
    title: payload.title,
    projectId: payload.projectId,
    taskId: payload.taskId,
    message: payload.message,
    profileImage: payload.profileImage,
  });
  console.log('notification', notification);
  const newPayload = { ...payload, createdAt: notification.createdAt };

  console.log('new payload', newPayload);

  if (user.subscription) {
    webPushNotification(user.subscription, newPayload);
  }

  return notification;
}
