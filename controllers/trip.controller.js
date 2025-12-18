const { StatusCodes, getStatusCode } = require("http-status-codes");
const Trip = require("../models/Trip");
const { categoryCodes, tags } = require("../helpers/data");

//endpoints pour front :
const getAll = async (req, res) => {
  const params = req.query;
  let formattedParams = {};
  if (params.region && params.region !== "0") {
    formattedParams.duration = parseInt(params.duration);
  }
  if (params.duration && params.duration !== "0") {
    formattedParams.region = parseInt(params.region);
  }
  if (params.town) {
    formattedParams.town = { $regex: params.town, $options: "i" };
  }
  if (params.price) {
    formattedParams.adultPrice = { $lte: params.price };
  }
  if (params.category && params.category !== "0") {
    const category = categoryCodes.find(
      (cat) => cat.code === parseInt(params.category)
    );
    if (category) {
      formattedParams.category = category.name;
    }
  }
  if (params.tags && params.tags !== "0") {
    const tags = tags.find((tag) => tag.code === parseInt(params.tags));
    if (category) {
      formattedParams.tags = tag.name;
    }
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

const getAllBestsellers = async (req, res) => {
  try {
    const trips = await Trip.find({ tags: "bestseller" });
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
const getOne = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).send("No ID provided");
  }
  try {
    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(StatusCodes.BAD_REQUEST).send("No match");
    }
    return res.status(StatusCodes.OK).send(trip);
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Error while retrieving the trip");
  }
};
const patchOne = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).send("No ID provided");
  }
  try {
    const trip = await Trip.findByIdAndUpdate(id, req.body, { new: true });
    if (!trip) {
      return res.status(StatusCodes.NOT_FOUND).send("No resource found");
    }
    return res.status(StatusCodes.OK).send(trip);
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Error while patching the trip");
  }
};
const deleteOne = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).send("No ID provided");
  }
  try {
    const trip = await Trip.findByIdAndDelete(id);
    if (!trip) {
      return res.status(StatusCodes.NOT_FOUND).send("Nothing to delete");
    }
    return res.status(StatusCodes.OK).send(trip);
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Error while deleting the trip");
  }
};
const deleteAll = async (req, res) => {
  try {
    const result = await Trip.deleteMany();
    if (result.deletedCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).send("Nothing to delete");
    }
    return res.status(StatusCodes.OK).send("all Deleted");
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Error while deleting the trips");
  }
};
module.exports = {
  create,
  getAll,
  getOne,
  getAllBestsellers,
  patchOne,
  deleteOne,
  deleteAll,
};
