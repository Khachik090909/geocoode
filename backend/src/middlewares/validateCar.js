const validateCar = (req, res, next) => {
  const { user_id: userId, brand_id: brandId, plug_id: plugId } = req.body;
  const errors = [];

  if (userId == null) {
    errors.push({ field: "user.id", message: "This field is required" });
  } else if (typeof userId !== "number" && userId < 1) {
    errors.push({
      field: "userId",
      message: "Doit être un chiffre.",
    });
  }
  if (brandId == null) {
    errors.push({ field: "brand.id", message: "This field is required" });
  } else if (!brandId > 0) {
    errors.push({
      field: "brandId",
      message: "Doit être un chiffre.",
    });
  }
  if (plugId == null) {
    errors.push({ field: "plug.id", message: "This field is required" });
  } else if (typeof userId !== "number" && userId < 1) {
    errors.push({
      field: "plugId",
      message: "Doit être un chiffre.",
    });
  }

  if (errors.length) {
    res.status(422).json({ validationErrors: errors });
  } else {
    next();
  }
};

module.exports = validateCar;
