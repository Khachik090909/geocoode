const tables = require("../tables");
// controller function to browse all plugs
const browse = async (req, res, next) => {
  try {
    const messages = await tables.plug.readAll();

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
// controller function to read a plug by id
const read = async (req, res, next) => {
  try {
    const message = await tables.plug.read(req.params.id);
    if (!message) {
      res.sendStatus(404);
    } else {
      res.status(200).json(message);
    }
  } catch (error) {
    next(error);
  }
};
// controller function to edit a plug by id
const edit = async (req, res, next) => {
  try {
    const message = await tables.plug.edit(req.body, req.params.id);
    if (message == null) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    next(error);
  }
};
// controller function to add a plug
const add = async (req, res, next) => {
  try {
    const message = await tables.plug.add(req.body);
    if (!message) {
      res.sendStatus(404);
    } else {
      res.status(201).json(message);
    }
  } catch (error) {
    next(error);
  }
};
// controller function to delete a plug by id
const destroy = async (req, res, next) => {
  try {
    const result = await tables.plug.delete(req.params.id);
    if (result.affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    next(error);
  }
};
// controller function to delete all plugs
module.exports = {
  browse,
  read,
  edit,
  add,
  destroy,
};
