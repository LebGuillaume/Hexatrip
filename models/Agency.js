const mongoose = require("mongoose");
const { Schema } = mongoose;
const agencySchema = new Schema(
  {
    adress: { type: String },

    phone: { type: String },
    photo: { type: String },
    title: { type: String },
    email: { type: String },
  },
  { timestamps: true }
);
const Agency = mongoose.model("Agency", agencySchema);
module.exports = Agency;
