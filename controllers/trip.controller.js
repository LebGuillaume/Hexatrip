const { StatusCodes } = require("http-status-codes");
const Trip = require("../models/Trip");

//endpoints pour front :
const getAll = async (req, res) => {
  const params = req.query;
  let formattedParams = {};
  if (params.region) {
    formattedParams.region = parseInt(params.region);
  }
  try {
    const trips = await Trip.find(formattedParams);
    return res.status(StatusCodes.OK).send(trips);
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Error while fetching trips");
  }
};
//endpoints pour postman:
const create = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(StatusCodes.BAD_REQUEST).send("Missing field(s)");
    }
    const trip = await Trip.create(req.body);
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Trip created", trip });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Creation failed");
  }
};

module.exports = { create, getAll };
