const errorMiddleware = (err, req, res, next) => {
  if (err.code === "23505") {
    res.status(400).json({ error: "Duplicate Entry" });
  } else {
    next(err);
  }
};

module.exports = errorMiddleware;
