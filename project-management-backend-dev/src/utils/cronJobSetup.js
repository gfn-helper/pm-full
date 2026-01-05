//run a cron service
// get the tasks which are due past
//take the user Id of the users assigned for that
//send the notification to the task assignee ---> push and email both should be sent
import cron from 'node-cron';
import Tasks from '../models/Tasks.js';
import User from '../models/User.js';
import { pushNotificationToUser } from '../services/pushNotificationService.js';
import { sendEmailNotification } from '../services/emailNotificationService.js';

export async function notificationSchedular() {
  console.log('Cron running');
  cron.schedule('0 */3 * * *', async () => {
    console.log('Task Executed');

    const now = new Date();

    console.log(now);

    try {
      const overDueTasks = await Tasks.find({ dueDate: { $lt: now } });

      for (const task of overDueTasks) {
        const payload = {
          title: `Overdue Reminder for Task ${task.key}`,
          projectId: task.projectId,
          message: `The task "${task.title}" is overdue! Please take action.`,
        };
        const user = await User.findById(task.assignee);

        if (user) {
          await pushNotificationToUser(user._id, payload);
          await sendEmailNotification(user._id, payload);
        } else {
          console.log(`No assignee found for task "${task.title}"`);
        }
      }
    } catch (error) {
      console.error('Error in cron job:', error);
    }
  });
}
