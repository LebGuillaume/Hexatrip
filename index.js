const express = require("express");
const morgan = require("morgan");
const connectToDatabase = require("./database");
const bodyParser = require("body-parser");
const multer = require("multer");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const expressRateLimit = require("express-rate-limit");
const expressMongoSanitize = require("express-mongo-sanitize");
//routes:
const orderRoutes = require("./routes/order.routes");
const adviserRoutes = require("./routes/adviser.routes");
const agencyRoutes = require("./routes/agency.routes");
const tripRoutes = require("./routes/trips.routes");
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const checkoutRoutes = require("./routes/order.routes");
const { StatusCodes } = require("http-status-codes");
const ExpressMongoSanitize = require("express-mongo-sanitize");
//instance
const app = express();
const port = 3000;
//config
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
dotenv.config();
app.use(helmet());
app.use(xssClean()); // Global security
app.use(ExpressMongoSanitize({ replaceWith: "_" })); // remplace mongo operators $ and
//confg rate limit
const limitOptions = {
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res) => {
    res
      .status(StatusCodes.TOO_MANY_REQUESTS)
      .json({ status: 429, error: "Too many requests" });
  },
  standardHeaders: true,
  legacyheaders: false,
};
app.use(expressRateLimit(limitOptions));
//cors config
const allowedOrigins = ["https://", "http://localhost:3000"];
const corsOption = {
  origin: (origin, callBack) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      //Origin accepted
      callBack(null, true);
    } else {
      callback(new Error("Not allowed by cors"));
    }
  },
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["content-type", "Authorization", "X-Forwarded-for"],
  credentials: true,
};
app.use(cors(corsOption));
//connection to db:
connectToDatabase();

//config multer
app.locals.uploader = multer({
  storage: multer.memoryStorage({}),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are accepted"));
    }
  }, //Maw size : 10Mb
});
//endpoints
app.use("/orders", orderRoutes);
app.use("/advisers", adviserRoutes);
app.use("/agencies", agencyRoutes);
app.use("/trips", tripRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/create-checkout-session", checkoutRoutes);
app.use((req, res) => {
  return res.status(404).send("Page note found");
});
app.listen(port, () => {
  console.log(`Hexatrip server running on port: ${port}`);
});
