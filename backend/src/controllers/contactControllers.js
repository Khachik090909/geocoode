const tables = require("../tables");

const browse = async (req, res, next) => {
  try {
    const messages = await tables.contact.readAll();

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
const browseStatistics = async (req, res, next) => {
  try {
    const messages = await tables.contact.readAllContactStatistic();
    const totalMessages = messages.length;
    res.status(200).json({ totalMessages });
  } catch (error) {
    next(error);
  }
};
const read = async (req, res, next) => {
  try {
    const message = await tables.contact.read(req.params.id);
    if (!message) {
      res.sendStatus(404);
    } else {
      res.status(200).json(message);
    }
  } catch (error) {
    next(error);
  }
};

const edit = async (req, res, next) => {
  try {
    const message = await tables.contact.edit(req.body, req.params.id);
    if (message == null) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    next(error);
  }
};

const add = async (req, res, next) => {
  try {
    const message = await tables.contact.add(req.body);
    if (!message) {
      res.sendStatus(404);
    } else {
      res.status(201).json(message);
    }
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const result = await tables.contact.delete(req.params.id);
    if (result.affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  browse,
  browseStatistics,
  read,
  edit,
  add,
  destroy,
};
