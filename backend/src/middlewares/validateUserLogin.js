const validateUserLogin = (req, res, next) => {
  // Extracting data from the request body
  const { email, password } = req.body;

  // Regular expressions for validation
  const emailRegex = /[a-z0-9._]+@[a-z0-9-]+\.[a-z]{2,3}/;

  // Array to store validation errors
  const errors = [];

  // Validation for the 'email' field
  if (email == null) {
    errors.push({ field: "email", message: "This field is required" });
  } else if (email.length >= 100) {
    errors.push({
      field: "email",
      message: "Must contain less than 100 characters",
    });
  } else if (!emailRegex.test(email)) {
    errors.push({ field: "email", message: "Invalid email" });
  }

  // Validation for the 'password' field
  if (password == null) {
    errors.push({ field: "password", message: "This field is required" });
  }
  if (password.length < 8) {
    errors.push({
      field: "password",
      message: "Password must be at least 8 characters long",
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

module.exports = validateUserLogin;
