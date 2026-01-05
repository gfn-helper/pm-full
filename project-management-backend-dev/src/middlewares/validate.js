export default function validate(schema) {
  return async (req, res, next) => {
    try {
      if (!req.body) {
        throw new Error("Request body missing");
      }

      req.body = await schema.validate(req.body);

      next();
    } catch (err) {
      res.status(500);
      next(err);
    }
  };
}
