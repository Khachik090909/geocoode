const validateChargingStation = (req, res, next) => {
  // Extracting data from the request body
  const {
    adresse_station: addressStation,
    coordonneesXY,
    nbre_pdc: numberOfChargingPoints,
    puissance_nominale: nominalPower,
    prise_type_ef: typeEfOutlet,
    prise_type_2: type2Outlet,
    prise_type_combo_ccs: typeComboCCSOutlet,
    prise_type_chademo: typeChademoOutlet,
    prise_type_autre: otherTypeOutlet,
  } = req.body;

  // Array to store validation errors
  const errors = [];

  // Utility function to check if a value is a valid number
  const isValidNumber = (value) => {
    return (
      typeof value === "number" &&
      !Number.isNaN(value) &&
      Number.isFinite(value)
    );
  };

  // Validation for the 'addressStation' field
  if (!addressStation || typeof addressStation !== "string") {
    errors.push({
      field: "addressStation",
      message: "'addressStation' field is required and must be a string.",
    });
  }

  // Validation for the 'coordonneesXY' field
  if (
    !coordonneesXY ||
    !Array.isArray(coordonneesXY) ||
    coordonneesXY.length !== 2 ||
    !isValidNumber(coordonneesXY[0]) ||
    !isValidNumber(coordonneesXY[1])
  ) {
    errors.push({
      field: "coordonneesXY",
      message:
        "'coordonneesXY' field is required and must be an array of two numbers [longitude, latitude].",
    });
  }

  // Validation for the 'numberOfChargingPoints' field
  if (!isValidNumber(numberOfChargingPoints)) {
    errors.push({
      field: "numberOfChargingPoints",
      message:
        "'numberOfChargingPoints' field is required and must be a valid number.",
    });
  }

  // Validation for the 'nominalPower' field
  if (!isValidNumber(nominalPower)) {
    errors.push({
      field: "nominalPower",
      message: "'nominalPower' field is required and must be a valid number.",
    });
  }

  // Validation for the 'typeEfOutlet', 'type2Outlet', 'typeComboCCSOutlet', 'typeChademoOutlet', 'otherTypeOutlet' fields
  const validOutletValues = ["TRUE", "FALSE"];
  if (!validOutletValues.includes(typeEfOutlet)) {
    errors.push({
      field: "typeEfOutlet",
      message:
        "'typeEfOutlet' field is required and must have value 'TRUE' or 'FALSE'.",
    });
  }

  if (!validOutletValues.includes(type2Outlet)) {
    errors.push({
      field: "type2Outlet",
      message:
        "'type2Outlet' field is required and must have value 'TRUE' or 'FALSE'.",
    });
  }

  if (!validOutletValues.includes(typeComboCCSOutlet)) {
    errors.push({
      field: "typeComboCCSOutlet",
      message:
        "'typeComboCCSOutlet' field is required and must have value 'TRUE' or 'FALSE'.",
    });
  }

  if (!validOutletValues.includes(typeChademoOutlet)) {
    errors.push({
      field: "typeChademoOutlet",
      message:
        "'typeChademoOutlet' field is required and must have value 'TRUE' or 'FALSE'.",
    });
  }

  if (!validOutletValues.includes(otherTypeOutlet)) {
    errors.push({
      field: "otherTypeOutlet",
      message:
        "'otherTypeOutlet' field is required and must have value 'TRUE' or 'FALSE'.",
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

module.exports = validateChargingStation;
