const tables = require("../tables");
// controller function to browse all brands
const browse = async (req, res, next) => {
  try {
    const messages = await tables.brand.readAll();

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
// controller function to read brand by id
const read = async (req, res, next) => {
  try {
    const message = await tables.brand.read(req.params.id);
    if (!message) {
      res.sendStatus(404);
    } else {
      res.status(200).json(message);
    }
  } catch (error) {
    next(error);
  }
};
// controller function to edit brand by id
const edit = async (req, res, next) => {
  try {
    const message = await tables.brand.edit(req.body, req.params.id);
    if (message == null) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    next(error);
  }
};
// controller function to add brand
const add = async (req, res, next) => {
  try {
    const message = await tables.brand.add(req.body);
    if (!message) {
      res.sendStatus(404);
    } else {
      res.status(201).json(message);
    }
  } catch (error) {
    next(error);
  }
};
// controller function to delete brand by id
const destroy = async (req, res, next) => {
  try {
    const result = await tables.brand.delete(req.params.id);
    if (result.affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    next(error);
  }
};
// exports the controller functions
module.exports = {
  browse,
  read,
  edit,
  add,
  destroy,
};
