const { StatusCodes } = require("http-status-codes");
const authorizeMiddleware =
  (accessGratedRoles = []) =>
  (req, res, next) => {
    if (
      accessGratedRoles.length !== 0 ||
      !accessGratedRoles.includes(req.user.role)
    ) {
      return res.status(StatusCodes.FORBIDDEN).send("Access refused");
    }
    next();
  };
module.exports = { authorizeMiddleware };
