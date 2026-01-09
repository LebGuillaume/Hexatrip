const express = require("express");
const morgan = require("morgan");
const connectToDatabase = require("./database");
const bodyParser = require("body-parser");
const multer = require("multer");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const expressRateLimit = require("express-rate-limit");
const xssMiddleware = require("./middlewares/xssMiddleware");
const mongoSanitize = require("express-mongo-sanitize");
//routes:
const orderRoutes = require("./routes/order.routes");
const advisorRoutes = require("./routes/advisor.routes");
const agencyRoutes = require("./routes/agency.routes");
const tripRoutes = require("./routes/trips.routes");
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const checkoutRoutes = require("./routes/checkout.routes");
const { StatusCodes } = require("http-status-codes");

//instance
const app = express();
const port = 5137;
//config
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
dotenv.config();
app.use(helmet());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(xssMiddleware);

app.use((req, res, next) => {
  Object.defineProperty(req, "query", {
    value: { ...req.query },
    writable: true,
    configurable: true,
    enumerable: true,
  });
  next();
});

app.use(mongoSanitize());

// Global security
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
const allowedOrigins = [
  "http://localhost:5173", // Vite (front)
  process.env.CLIENT_URL_PRODUCTION, // Prod (si défini)
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman/curl
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Forwarded-For"],
  })
);
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
app.use("/advisors", advisorRoutes);
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
console.log("RUNNING FILE =", __filename);
