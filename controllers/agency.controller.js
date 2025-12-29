const StatusCodes = require("http-status-codes");
const Agency = require("../models/Agency");
const path = require("path");
const fs = require("fs").promises;

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
const addImage = async (req, res) => {
  const { id } = req.params;
  const file = req.file;
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).send("No id provided. Failure");
  }
  //fetch matching agency
  let agency;
  try {
    agency = await Agency.findById(id);
    if (!agency) {
      return res.status().send("No adviser found. Failure");
    }
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Error while fetching agency. Failure");
  }
  //Get out if something is wrong
  if (!file || Object.keys(agency).length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).send("No upload. Failure");
  }
  // Save
  try {
    const uploadPath = path.join(
      __dirname,
      "../public/images/agencies",
      id,
      file.originalname
    );
    const directory = path.dirname(uploadPath);
    await fs.mkdir(directory, { recursive: true }, () => {});
    await fs.writeFile(uploadPath, file.buffer, () => {});
    agency.photo = file.originalname;
    await agency.save();
    return res.status(StatusCodes.CREATED).send("File attached successfully");
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(`Server error: ${error} `);
  }
};
module.exports = { create, getAll, getOne, addImage };
