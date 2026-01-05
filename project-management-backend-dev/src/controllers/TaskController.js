import crypto from 'node:crypto';

export default class TaskController {
  constructor(taskService) {
    this.taskService = taskService;
  }

  getAllTasks = async (req, res, next) => {
    try {
      let result;
      if (req.query?.projectId) {
        const { filter, searchInput } = req.query;
        result = await this.taskService.getTasksByProjectId(
          req.user._id,
          req.query.projectId,
          filter,
          searchInput
        );
      } else {
        result = await this.taskService.getAllTasks(req.user._id);
      }
      const includeUsers = req.query?.include === 'users';
      const lastModified = result.length
        ? new Date(Math.max(...result.map((t) => new Date(t.updatedAt).getTime())))
        : new Date(0);
      const etagPayload = result.map((t) => `${t._id}:${t.updatedAt?.toISOString?.() || ''}`).join('|');
      const etag = crypto.createHash('md5').update(etagPayload).digest('hex');
      res.set('ETag', etag);
      res.set('Last-Modified', lastModified.toUTCString());
      const ifNoneMatch = req.headers['if-none-match'];
      const ifModifiedSince = req.headers['if-modified-since'] ? new Date(req.headers['if-modified-since']) : null;
      if (ifNoneMatch === etag || (ifModifiedSince && lastModified <= ifModifiedSince)) {
        return res.status(304).end();
      }
      if (includeUsers) {
        const userIds = [...new Set(result.map((t) => String(t.assignee)).filter(Boolean))];
        const users = userIds.length ? await this.taskService.getUsersByIds(userIds) : [];
        return res.json({ success: true, data: { result }, users: users.map((u) => ({ _id: u._id, name: u.name, profileImage: u.profileImage })) });
      }
      res.json({ success: true, result });
    } catch (error) {
      next(error);
    }
  };

  getTaskById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.taskService.getTaskById(req.user._id, id);

      res.json({ success: true, result: result });
    } catch (error) {
      res.status(404);
      next(error);
    }
  };

  getUserDetailsById = async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400);
        return next(new Error('UserId is missing'));
      }

      const user = await this.taskService.getUserById(id);

      res.json({
        success: true,
        result: {
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
        },
      });
    } catch (error) {
      res.status(401);
      next(error);
    }
  };

  createTask = async (req, res, next) => {
    try {
      req.body.attachments = req.files.map((file) => {
        return file.filename;
      });
      let task = { ...req.body, parentTask: req.body.parentTask || null };

      console.log(task);
      const result = await this.taskService.createTask(req.user._id, task);

      res.json({
        success: true,
        result: result,
        message: 'Task created successfully!',
        user: { id: req.user._id, email: req.user.email },
      });
    } catch (error) {
      next(error);
    }
  };

  updateTask = async (req, res, next) => {
    try {
      const result = await this.taskService.updateTask(
        req.user._id,
        req.params.id,
        req.body
      );

      res.json({
        success: true,
        result: result,
        message: 'Task updated successfully!',
        user: { id: req.user._id, email: req.user.email },
      });
    } catch (error) {
      res.status(404);
      next(error);
    }
  };

  deleteTask = async (req, res, next) => {
    try {
      const { id } = req.params;

      const result = await this.taskService.deleteTask(req.user._id, id);

      res.json({
        success: true,
        result: result,
        message: 'Task deleted successfully!',
        user: { id: req.user._id, email: req.user.email },
      });
    } catch {
      res.status(404);
      next(new Error('Task by given id does not exist'));
    }
  };

  getMultipleUsers = async (req, res, next) => {
    try {
      const ids = req.query.ids?.split(',');

      if (!ids || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'User IDs are required',
        });
      }

      const users = await this.taskService.getUsersByIds(ids);

      const result = users.map((u) => ({
        _id: u._id,
        name: u.name,
        profileImage: u.profileImage,
      }));

      res.json({
        success: true,
        result,
      });
    } catch (error) {
      next(error);
    }
  };

  getTasksBatch = async (req, res, next) => {
    try {
      const ids = req.query.ids?.split(',').filter(Boolean);
      if (!ids || ids.length === 0) {
        return res.status(400).json({ success: false, message: 'Task IDs are required' });
      }
      const tasks = await this.taskService.getTasksByIds(req.user._id, ids);
      const lastModified = tasks.length
        ? new Date(Math.max(...tasks.map((t) => new Date(t.updatedAt).getTime())))
        : new Date(0);
      const etagPayload = tasks.map((t) => `${t._id}:${t.updatedAt?.toISOString?.() || ''}`).join('|');
      const etag = crypto.createHash('md5').update(etagPayload).digest('hex');
      res.set('ETag', etag);
      res.set('Last-Modified', lastModified.toUTCString());
      const ifNoneMatch = req.headers['if-none-match'];
      const ifModifiedSince = req.headers['if-modified-since'] ? new Date(req.headers['if-modified-since']) : null;
      if (ifNoneMatch === etag || (ifModifiedSince && lastModified <= ifModifiedSince)) {
        return res.status(304).end();
      }
      res.json({ success: true, result: tasks });
    } catch (error) {
      next(error);
    }
  };

  taskOfProjectId = async (req, res, next) => {
    try {
      const task = await this.taskService.taskOfProjectId(
        req.user._id,
        req.params.id
      );

      res.json({
        success: true,
        result: task,
      });
    } catch (error) {
      res.status(400);
      next(error);
    }
  };
}
