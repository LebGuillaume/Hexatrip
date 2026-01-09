const StatusCodes = require("http-status-codes");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;
const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).send("Missing fileds(s)");
    }
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Registration failed : You are already registered");
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = {
      username,
      email,
      password: hashedPassword,
      role,
    };
    await User.create(user);
    return res.status(StatusCodes.CREATED).send("User registered successfully");
  } catch (error) {
    console.log(`Error in user registration : ${error}`);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Server Error during registration");
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).send("Missing fileds(s)");
    }
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send("Login failed : Invalid credentials");
    }
    const passwordMatch = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send("Login failed : Invalid credentials");
    }
    const token = jwt.sign(
      {
        id: foundUser._id,
        username: foundUser.username,
        email: foundUser.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1m",
      }
    );
    const { password: _, __v, ...userWithoutSensitiveData } = foundUser._doc;
    return res
      .status(StatusCodes.OK)
      .json({ user: userWithoutSensitiveData, token });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Server Error during login");
  }
};
module.exports = { register, login };
