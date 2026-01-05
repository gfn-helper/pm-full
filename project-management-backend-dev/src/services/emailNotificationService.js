import User from '../models/User.js';
import mailSender from '../utils/mailSender.js';

export async function sendEmailNotification(assigneeId, payload) {
  try {
    const receiver = User.findById({ _id: assigneeId });
    const receiverEmailId = (await receiver).email;

    const mailResponse = await mailSender(receiverEmailId, payload.title);

    console.log('email has been sent successfully', mailResponse);
  } catch (error) {
    console.log('Error occurred while sending email notification : ', error);
    throw error;
  }
}
