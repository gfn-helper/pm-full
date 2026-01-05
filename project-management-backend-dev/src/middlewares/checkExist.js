export default function checkExist(model) {
  return async (req, res, next) => {
    try {
      const id = req.params.id;

      if (!id) {
        res.status(400);
        throw new Error('ID must not be empty');
      }

      const result = await model.findOne({ _id: id });

      if (!result) {
        res.status(404);
        throw new Error('ID not found' + ' ' + req.originalUrl);
      }

      next();
    } catch (error) {
      console.log(error);
      res.status(404);
      next(new Error('ID not found'));
    }
  };
}
