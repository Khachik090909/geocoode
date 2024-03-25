const tables = require("../tables");
// controller function to browse all reservations
const browse = async (req, res, next) => {
  try {
    const reservations =
      await tables.user_has_charging_station.readAllReservation();
    res.status(200).json(reservations);
  } catch (error) {
    next(error);
  }
};
// controller function to browse reservations  number
const browseStatistics = async (req, res, next) => {
  try {
    const reservations =
      await tables.user_has_charging_station.readAllReservationStatistic();
    const totalReservations = reservations.length;
    res.status(200).json({ totalReservations });
  } catch (error) {
    next(error);
  }
};
// controller function to read a reservation by id
const read = async (req, res, next) => {
  try {
    const reservation = await tables.user_has_charging_station.readReservation(
      req.params.id
    );
    if (reservation == null) {
      res.sendStatus(404);
    } else {
      res.status(200).json(reservation);
    }
  } catch (error) {
    next(error);
  }
};
// controller function to read a reservation by user.id
const readUserReservations = async (req, res, next) => {
  try {
    const reservation =
      await tables.user_has_charging_station.readReservationByUser(
        req.params.id
      );
    if (reservation == null) {
      res.sendStatus(404);
    } else {
      res.status(200).json(reservation);
    }
  } catch (error) {
    next(error);
  }
};
// controller function to edit a reservation by id
const edit = async (req, res, next) => {
  try {
    const reservation = await tables.user_has_charging_station.edit(
      req.body,
      req.params.id
    );
    if (reservation == null) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    next(error);
  }
};
// controller function to add a reservation
const add = async (req, res, next) => {
  try {
    const reservation = await tables.user_has_charging_station.add(req.body);
    if (reservation == null) {
      res.sendStatus(404);
    } else {
      res.status(201).json(reservation);
    }
  } catch (error) {
    next(error);
  }
};
// controller function to delete a reservation by id
const destroy = async (req, res, next) => {
  try {
    const reservation = await tables.user_has_charging_station.delete(
      req.params.id
    );
    if (reservation.affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    next(error);
  }
};
// exporting the controller functions
module.exports = {
  browse,
  browseStatistics,
  read,
  readUserReservations,
  edit,
  add,
  destroy,
};
