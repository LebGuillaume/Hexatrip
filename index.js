const express = require("express");
const morgan = require("morgan");
const connectToDatabase = require("./database");
const bodyParser = require("body-parser");
const orderRoutes = require("./routes/order.routes");
const adviserRoutes = require("./routes/adviser.routes");
const agencyRoutes = require("./routes/agency.routes");
const tripRoutes = require("./routes/trips.routes");

const app = express();
const port = 3000;
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connectToDatabase();
app.use("/orders", orderRoutes);
app.use("/advisers", adviserRoutes);
app.use("/agencies", agencyRoutes);
app.use("/trips", tripRoutes);
app.use((req, res) => {
  return res.status(404).send("Page note found");
});
app.listen(port, () => {
  console.log(`Hexatrip server running on port: ${port}`);
});
