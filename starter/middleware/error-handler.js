const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || `Something went wrong ,please try again later...`,
  };

  if (err.name === "ValidationError") {
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = 400;
  }

  if (err.name === "CastError") {
    customError.message = `No item with id : ${err.value}`;
    customError.statusCode = 404;
  }

  if (err.code && err.code === 11000) {
    customError.statusCode = 400;
    customError.message = `Duplicate value for ${Object.keys(
      err.keyValue
    )} field , please choose different value`;
  }

  return res.status(customError.statusCode).json({ msg: customError.message });
};

module.exports = errorHandlerMiddleware;
