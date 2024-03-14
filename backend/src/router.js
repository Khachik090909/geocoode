const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Import auth services for security operations
const {
  hashPassword,
  verifyPassword,
  verifyToken,
  verifyTokenValid,
  verifyPasswordActual,
  missingElements,
  addPassword,
  verifyAdmin,
  verifyExistEmail,
} = require("./services/auth");

// Import itemControllers module for handling item-related operations

const chargingStationControllers = require("./controllers/chargingStationControllers");
const carControllers = require("./controllers/carControllers");
const reservationControllers = require("./controllers/reservationControllers");
const contactControllers = require("./controllers/contactControllers");
const brandControllers = require("./controllers/brandControllers");
const plugControllers = require("./controllers/plugControllers");

// Import Middlewares
const validateCar = require("./middlewares/validateCar");
const validateUser = require("./middlewares/validateUser");
const validateReservation = require("./middlewares/validateReservation");
const validateChargingStation = require("./middlewares/validateChargingStation");
const validateUserLogin = require("./middlewares/validateUserLogin");
// Route to get a list of charging station
router.get("/charging-stations", chargingStationControllers.browse);
router.get(
  "/charging-stations/statistics",
  chargingStationControllers.browseStatistic
);

router.get(
  "/charging-stations-positions",
  chargingStationControllers.browsePosition
);
router.get("/charging-stations/:id", chargingStationControllers.read); //+
router.put(
  "/charging-stations/:id",
  validateChargingStation,
  chargingStationControllers.edit
);
router.post(
  "/charging-stations/",
  validateChargingStation,
  chargingStationControllers.add
); //+
router.delete("/charging-stations/:id", chargingStationControllers.destroy);
/* ************************************************************************* */

// Import chargingStationControllers module for handling operations
const userControllers = require("./controllers/userControllers");
const validateMessage = require("./middlewares/validateMessage");

// Route to get a list of charging station
router.get("/users", verifyToken, verifyAdmin, userControllers.browse);
router.get("/users/statistics", verifyToken, userControllers.browseStatistics);
router.get("/users/:id", verifyToken, userControllers.read);
router.get("/users/:id/admin", verifyToken, userControllers.readIsAdmin);
router.get("/users-admin", verifyToken, userControllers.readAllUserAdmin);
router.post(
  "/users/",
  validateUser,
  verifyExistEmail,
  hashPassword,
  userControllers.add
);
router.post(
  "/users/login",
  validateUserLogin,
  userControllers.readByEmailAndPassToNext,
  verifyPassword
);
router.put(
  "/users/:id",
  verifyToken,
  validateUser,
  hashPassword,
  userControllers.edit
);
router.put(
  "/loggedusers/:id",
  verifyPasswordActual,
  hashPassword,
  missingElements,
  userControllers.edit
);
router.put("/users/:id/admin", verifyToken, addPassword, userControllers.edit);
router.delete("/users/:id", verifyToken, userControllers.destroy);

// Route to get a list of cars
router.get("/cars", verifyToken, carControllers.browse);
router.get("/cars/statistics", verifyToken, carControllers.browseStatistics);
router.get("/cars/:id", verifyToken, carControllers.read);
router.get("/cars-user/:id", verifyToken, carControllers.readCar);
router.put("/cars/:id", validateCar, carControllers.edit);
router.post("/cars/", validateCar, carControllers.add);
router.delete("/cars/:id", verifyToken, carControllers.destroy);

// Route to get a list of reservations
router.get("/reservations", reservationControllers.browse);
router.get("/reservations/statistics", reservationControllers.browseStatistics);
router.get("/reservations/:id", reservationControllers.read);
router.get(
  "/users/:id/reservations",
  reservationControllers.readUserReservations
); //+
router.put(
  "/reservations/:id",
  validateReservation,
  reservationControllers.edit
);
router.post("/reservations/", reservationControllers.add);
router.delete("/reservations/:id", reservationControllers.destroy);

// Route to get a list of cars
router.get("/contacts", contactControllers.browse);
router.get("/contacts/statistics", contactControllers.browseStatistics);
router.get("/contacts/:id", contactControllers.read);
router.post("/contacts", validateMessage, contactControllers.add);
router.put("/contacts/:id/admin", validateMessage, contactControllers.edit);
router.delete("/contacts/:id", verifyToken, contactControllers.destroy);
router.get("/verify-token", verifyTokenValid, (req, res) => {
  // Si le middleware passe, vous pouvez renvoyer une réponse appropriée
  res.status(200).json({ token: req.user });
});
// Route to get a list of brands
router.get("/brands", brandControllers.browse);

// Route to get a list of plug
router.get("/plugs", plugControllers.browse);
module.exports = router;
