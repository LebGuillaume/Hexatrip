const StatusCodes = require("http-status-codes");
const Adviser = require("../models/Adviser");

//Endpoints pour le front
const getAll = async (req, res) => {
  try {
    const params = req.query;
    let formattedParams = {};
    if (params.town) {
      formattedParams.tags = { $regex: params.town, $options: "i" };
    }
    const advisers = await Adviser.find(formattedParams);
    return res.status(StatusCodes.OK).send(advisers);
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Error while fetching advisers");
  }
};
const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const adviser = await Adviser.findById(id);
    if (!adviser) {
      return res.status(StatusCodes.BAD_REQUEST);
    }
    return res.status(StatusCodes.OK).send(adviser);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Error retrieving adviser");
  }
};
//Endpoints pour le postman
const create = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).send("Missing field(s)");
    }
    await Adviser.create(req.body);
    return res.status(StatusCodes.CREATED).send("Adviser created");
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Creation failed");
  }
};
module.exports = { create, getAll, getOne };
