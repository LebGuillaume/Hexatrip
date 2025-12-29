const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");

const authenticateMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("authorization");
    if (!authHeader) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Missing authorization header");
    }
    const token = authHeader.split(" ")[1];
    const userByToken = jwt.verify(token, process.env.JWT_SECRET);
    const userInDB = await User.findById(userByToken.id).select(
      "-password -__v -updatedAt"
    );

    req.user = userInDB;
    next();
  } catch (error) {
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST);
  }
};

module.exports = { authenticateMiddleware };
