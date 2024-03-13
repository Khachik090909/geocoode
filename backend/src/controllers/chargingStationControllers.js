const tables = require("../tables");

const browse = async (req, res, next) => {
  try {
    const stations = await tables.charging_station.readAll();
    res.status(200).json(stations);
  } catch (error) {
    next(error);
  }
};
const browseStatistic = async (req, res, next) => {
  try {
    const stations = await tables.charging_station.readAllStatistic();
    const totalStations = stations.length;
    res.status(200).json({ totalStations });
  } catch (error) {
    next(error);
  }
};

const browsePosition = async (req, res, next) => {
  try {
    const stations = await tables.charging_station.readAllPosition();
    res.json(stations);
  } catch (error) {
    next(error);
  }
};

const read = async (req, res, next) => {
  try {
    const station = await tables.charging_station.read(req.params.id);
    if (!station) {
      res.sendStatus(404);
    } else {
      res.status(200).json(station);
    }
  } catch (error) {
    next(error);
  }
};

const edit = async (req, res, next) => {
  try {
    const station = await tables.charging_station.edit(req.body, req.params.id);
    if (station == null) {
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
    const station = await tables.charging_station.add(req.body);
    if (!station) {
      res.sendStatus(404);
    } else {
      res.status(201).json(station);
    }
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const result = await tables.charging_station.delete(req.params.id);
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
  browseStatistic,
  browsePosition,
  read,
  edit,
  add,
  destroy,
};
