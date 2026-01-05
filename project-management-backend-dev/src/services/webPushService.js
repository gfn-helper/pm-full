import webPush from 'web-push';
import { config } from '../config/config.js';

webPush.setVapidDetails(
  'mailto: <shaswata@itobuz.com>',
  config.PUBLIC_KEY,
  config.PRIVATE_KEY
);

const webPushNotification = async (subscription, payload) => {
  try {
    
    await webPush.sendNotification(subscription, JSON.stringify(payload));
  } catch (error) {
    console.error(error);
  }
};

export default webPushNotification;
