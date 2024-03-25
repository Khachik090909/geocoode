const validateReservation = (req, res, next) => {
  // Extracting data from the request body
  const {
    user_id: userId,
    charging_station_id: chargingStationId,
    reservation_date: reservationDate,
    amount_paid: amountPaid,
  } = req.body;

  // Regular expression for date validation
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  // Array to store validation errors
  const errors = [];

  // Validation for the 'user_id' field
  if (userId === null) {
    errors.push({ field: "userId", message: "This field is required" });
  }

  // Validation for the 'charging_station_id' field
  if (chargingStationId == null) {
    errors.push({
      field: "chargingStationId",
      message: "This field is required",
    });
  }

  // Validation for the 'reservation_date' field
  if (reservationDate == null || reservationDate.trim() === "") {
    errors.push({
      field: "reservationDate",
      message: "This field is required",
    });
  } else if (!dateRegex.test(reservationDate)) {
    errors.push({
      field: "reservationDate",
      message: "Invalid date format. Use the format YYYY-MM-DD",
    });
  }

  // Validation for the 'amount_paid' field
  if (amountPaid == null || amountPaid.trim() === "") {
    errors.push({ field: "amountPaid", message: "This field is required" });
  } else if (Number.isNaN(amountPaid)) {
    errors.push({
      field: "amountPaid",
      message: "The amount paid must be a number",
    });
  }

  // If errors are present, return a response with status code 422
  if (errors.length) {
    res.status(422).json({ validationErrors: errors });
  } else {
    // If no errors, proceed to the next middleware function
    next();
  }
};

module.exports = validateReservation;
