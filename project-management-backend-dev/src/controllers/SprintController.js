export default class SprintController {
  constructor(sprintService) {
    this.sprintService = sprintService;
  }

  getAllSprints = async (req, res, next) => {
    try {
      let result;
      if (req.query?.projectId) {
        result = await this.sprintService.getSprintByProjectId(
          req.user._id, req.query.projectId
        );
      } else {
        result = await this.sprintService.getAllSprints();
      }

      res.json({ success: true, result });
    } catch (error) {
      next(error);
    }
  };

  getSprintById = async (req, res, next) => {
    try {
      const sprintId = req.params.id;
      const sprint = await this.sprintService.getSprintById(
        req.user._id,
        sprintId
      );

      if (!sprint) {
        res.status(404);
        return next(new Error('sprint by given id not found'));
      }

      res.json({
        success: true,
        result: sprint,
      });
    } catch {
      res.status(404);
      next(new Error('sprint by given id not found'));
    }
  };

  updateSprint = async (req, res, next) => {
    try {
      const sprint = await this.sprintService.updateSprint(
        req.user._id,
        req.params.id,
        req.body
      );

      res.json({
        success: true,
        result: sprint,
        message: 'sprint updated successfully',
      });
    } catch (error) {
      res.status(400);
      next(error);
    }
  };

  addTasksIntoSprint = async (req, res, next) => {
    try {
      const sprint = await this.sprintService.addTasksIntoSprint(
        req.user._id,
        req.params.id,
        req.body.tasks
      );

      res.json({
        success: true,
        result: sprint,
        message: 'tasks added into sprint successfully',
      });
    } catch (error) {
      res.status(400);
      next(error);
    }
  };

  removeTaskFromSprint = async (req, res, next) => {
    try {
      const sprint = await this.sprintService.removeTaskFromSprint(
        req.user._id,
        req.params.id,
        req.body.task
      );

      res.json({
        success: true,
        result: sprint,
        message: 'sprint tasks updated successfully',
      });
    } catch (error) {
      res.status(400);
      next(error);
    }
  };

  deleteSprint = async (req, res, next) => {
    try {
      const sprint = await this.sprintService.deleteSprint(
        req.user._id,
        req.params.id
      );
      if (!sprint) {
        res.status(404);
        return next(new Error('sprint by given id not found'));
      }

      res.json({
        success: true,
        result: sprint,
        message: 'sprint successfully deleted',
      });
    } catch {
      res.status(404);
      next(new Error('sprint by given id not found'));
    }
  };

  createSprint = async (req, res, next) => {
    try {
      const sprint = await this.sprintService.createSprint(
        req.user._id,
        req.body
      );

      res.json({
        success: true,
        result: sprint,
        message: 'sprint created successfully',
      });
    } catch (error) {
      res.status(400);
      next(error);
    }
  };

}
