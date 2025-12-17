const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const mongoUriAtlas = process.env.MONGODB_URI_ATLAS;
const mongoUriLocalhost =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hexa-trip";

const connectToDatabase = async () => {
  const isProduction = process.env.NODE_ENV === "production";
  const mongoUri = isProduction ? mongoUriAtlas || mongoUriLocalhost : mongoUriLocalhost;

  if (!mongoUri) {
    console.error("MongoDB URI is missing. Set MONGODB_URI (and MONGODB_URI_ATLAS for prod).");
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DBNAME || "hexa-trip",
      tls: isProduction,
    });
    console.log("Connection with db successful");
  } catch (error) {
    console.error("Error during db connection:", error.message);
  }
};

module.exports = connectToDatabase;
