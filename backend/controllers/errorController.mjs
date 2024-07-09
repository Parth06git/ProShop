import AppError from "../utils/appError.mjs";

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateEntryDB = (err) => {
  const value = err.errmsg.match(
    /(["'])(?:(?=(\\?))\2.)*?\1/
  )[0];
  const message = `Duplicate field value ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(
    (el) => el.message
  );
  const message = `Invalid input data. ${errors.join(
    ". "
  )}`;
  return new AppError(message, 400);
};

const handleJWTError = (err) => {
  if (err.name.startsWith("J")) {
    return new AppError(
      "Invalid Token! Please Login again",
      401
    );
  } else {
    return new AppError(
      "Token expired! Please Login again",
      401
    );
  }
};

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith("/api")) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // Render Website
  else {
    res.status(err.statusCode).render("error", {
      title: "Error",
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      console.error("Error 💥", err);
      res.status(500).json({
        status: "fail",
        message: "Something is wrong",
      });
    }
  }
  // Render Website
  else {
    if (err.isOperational) {
      res.status(err.statusCode).render("error", {
        title: "Error",
        msg: err.message,
      });
    } else {
      res.status(err.statusCode).render("error", {
        title: "Error",
        msg: "Please Try again later",
      });
    }
  }
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else {
    if (err.name === "CastError")
      err = handleCastErrorDB(err);
    if (err.code === 11000)
      err = handleDuplicateEntryDB(err);
    if (err.name === "ValidationError")
      err = handleValidationErrorDB(err);
    if (
      err.name === "JsonWebTokenError" ||
      err.name === "TokenExpiredError"
    )
      err = handleJWTError(err);

    sendErrorProd(err, req, res);
  }
};
