const validateMessage = (req, res, next) => {
  // Extracting data from the request body
  const { name, email, object, subject } = req.body;

  // Regular expressions for validation
  const emailRegex = /[a-z0-9._]+@[a-z0-9-]+\.[a-z]{2,3}/;

  // Array to store validation errors
  const errors = [];

  // Validation for the 'name' field
  if (name == null) {
    errors.push({ field: "name", message: "This field is required" });
  } else if (name.length >= 100) {
    errors.push({
      field: "name",
      message: "Must contain less than 100 characters",
    });
  }

  // Validation for the 'email' field
  if (email == null) {
    errors.push({ field: "email", message: "This field is required" });
  } else if (email.length >= 100) {
    errors.push({
      field: "email",
      message: "Must contain less than 255 characters",
    });
  } else if (!emailRegex.test(email)) {
    errors.push({ field: "email", message: "Invalid email" });
  }

  // Validation for the 'object' field
  if (object == null) {
    errors.push({ field: "object", message: "This field is required" });
  } else if (object.length >= 255) {
    errors.push({
      field: "object",
      message: "Must contain less than 255 characters",
    });
  }

  // Validation for the 'subject' field
  if (subject == null) {
    errors.push({ field: "subject", message: "This field is required" });
  } else if (subject.length < 10) {
    errors.push({
      field: "subject",
      message: "Must contain at least 10 characters",
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

module.exports = validateMessage;
