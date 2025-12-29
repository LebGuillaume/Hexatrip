const { body, validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

// Register form validation :
const validateRegister = [
  body("username")
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be at least 3 characters long"),

  body("email").isEmail().withMessage("Email must be a valid email address"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("username")
    .isLength({ min: 4 })
    .withMessage("Username must be at least 4 characters long"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateRegister;
