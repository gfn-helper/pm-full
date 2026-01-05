export default class CommentsController {
  constructor(commentsService) {
    this.commentsService = commentsService;
  }

  getCommentsByTasksId = async (req, res, next) => {
    try {
      let result;

      if (req.query?.taskId) {
        result = await this.commentsService.getCommentsByTasksId(
          req.user._id,
          req.query.taskId
        );
      } else {
        return next(new Error('Task Id is required'));
      }
      res.json({ success: true, result: result });
    } catch (error) {
      res.status(404);
      next(error);
    }
  };

  updateComments = async (req, res, next) => {
    try {
      const { id } = req.params;
      const commentUpdate = req.body;

      const result = await this.commentsService.updateComments(
        req.user._id,
        id,
        commentUpdate
      );

      res.json({
        success: true,
        result: result,
        message: 'comment updated successfully',
      });
    } catch (error) {
      res.status(404);
      next(error);
    }
  };

  deleteComments = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.commentsService.deleteComments(
        req.user._id,
        id
      );

      res.json({
        success: true,
        result: result,
        message: 'Comments Successfully deleted',
      });
    } catch (error) {
      res.status(404);
      next(error);
    }
  };

  createComments = async (req, res, next) => {
    try {
      console.log(req.file?.filename);
      req.body.attachment = req.file ? req.file.filename : null;
      const comments = await this.commentsService.createComments(
        req.user._id,
        req.body
      );

      res.json({
        success: true,
        result: comments,
        message: 'Comments created successfully',
      });
    } catch (error) {
      res.status(404);
      next(error);
    }
  };
}
