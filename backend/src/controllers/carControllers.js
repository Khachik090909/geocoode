const tables = require("../tables");

const browse = async (req, res, next) => {
  try {
    const cars = await tables.car.readAll();
    res.json(cars);
  } catch (error) {
    next(error);
  }
};

const browseStatistics = async (req, res, next) => {
  try {
    const cars = await tables.car.browseStatistics();
    const totalCars = cars.length;
    res.json({ totalCars });
  } catch (error) {
    next(error);
  }
};

const read = async (req, res, next) => {
  try {
    const car = await tables.car.read(req.params.id);
    if (car == null) {
      res.sendStatus(404);
    } else {
      res.json(car);
    }
  } catch (error) {
    next(error);
  }
};
const readCar = async (req, res, next) => {
  try {
    const car = await tables.car.readCar(req.params.id);
    if (car == null) {
      res.sendStatus(404);
    } else {
      res.json(car);
    }
  } catch (error) {
    next(error);
  }
};

const edit = async (req, res, next) => {
  try {
    const car = await tables.car.edit(req.body, req.params.id);
    if (car == null) {
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
    const car = await tables.car.add(req.body);
    if (car == null) {
      res.sendStatus(404);
    } else {
      res.status(201).json(car);
    }
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const result = await tables.car.delete(req.params.id);
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
  readCar,
  edit,
  add,
  destroy,
};
