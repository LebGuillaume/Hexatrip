const StatusCodes = require("http-status-codes");
const Agency = require("../models/Agency");

//front:
const getAll = async (req, res) => {
  try {
    const agencies = await Agency.find();

    return res.status(StatusCodes.OK).send(agencies);
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Error while fetching agencies");
  }
};
//postman:
const create = async (req, res) => {
  try {
    const agencies = await Agency.create(req.body);
    return res.status(StatusCodes.OK).send("Agency created");
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Creation failed");
  }
};
const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const agency = await Agency.findById(id);
    if (!agency) {
      return res.status(StatusCodes.BAD_REQUEST).send("No match");
    }
    return res.status(StatusCodes.OK).send(agency);
  } catch (error) {
    return res.stattus(StatusCodes.BAD_REQUEST).send("Error fetching agency");
  }
};

module.exports = { create, getAll, getOne };
