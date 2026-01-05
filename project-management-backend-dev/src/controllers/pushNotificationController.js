import Subscription from '../models/SubscriptionModel.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
// import notificationRouter from '../routers/notificationRouter.js';

export async function saveSubscription(req, res, next) {
  try {
    const { email, subscription } = req.body;

    console.log('subscription object', subscription);

    const user = await User.findOne({ email });

    if (user) {
      const savedSubscription = await Subscription.findOneAndUpdate(
        { endpoint: subscription.endpoint },
        { $set: subscription },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

      await User.findByIdAndUpdate(user._id, {
        subscription: savedSubscription._id,
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function getAllNotificationsByProject(req, res, next) {
  try {
    const { id: projectId } = req.params;
    const page = +req.query.page;
    const limit = +req.query.limit;

    const skip = page * limit;
    console.log({ params: req.params });
    console.log('skip', skip);
    console.log('limit', limit);

    const notifications = await Notification.find({})
      .sort({
        createdAt: 1,
      })
      .skip(skip)
      .limit(limit);

    console.log('notifications', notifications);
    console.log('query', req.query);
    console.log(req.params);

    const total = await Notification.countDocuments({ projectId });

    console.log('All Notifications', notifications.length);

    res.status(200).json({
      success: true,
      result: notifications,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + notifications.length < total,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteNotification(req, res, next) {
  try {
    const { notificationId } = req.params;
    await Notification.deleteOne(notificationId);

    res.status(200).json({ success: true, message: 'deleted successfully' });
  } catch (error) {
    next(error);
  }
}

// export async function markAsAllSeen() {}
