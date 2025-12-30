const { StatusCodes } = require("http-status-codes");
const Order = require("../models/Order");
const getAll = async (req, res) => {
  try {
    const { email } = req.user;
    const order = await Order.find({ email }).populate("trip");
    return res.status(StatusCodes.OK).send(order);
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Error while fetching orders");
  }
};
module.exports = { getAll };
