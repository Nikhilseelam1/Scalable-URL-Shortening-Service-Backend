const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const err = new Error("Validation failed");
    err.statusCode = 422;
    err.errors = error.details.map((d) => ({
      field: d.path.join("."),
      message: d.message,
    }));
    return next(err);
  }

  next();
};

export default validate;