const express = require("express");

const morgan = require("morgan");
const connectToDatabase = require("./database");
const app = express();
const port = 3000;
app.use(morgan("dev"));

connectToDatabase();
app.use("/", (req, res) => {
  return res.status(200).send("ok");
});
app.use((req, res) => {
  return res.status(404).send("Page note found");
});
app.listen(port, () => {
  console.log(`Hexatrip server running on port: ${port}`);
});
