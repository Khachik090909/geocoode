const validateUser = (req, res, next) => {
  // Extracting data from the request body
  const {
    name,
    firstname,
    email,
    gender,
    date_of_birth: dateOfBirth,
    postal_code: postalCode,
    city,
    number_vehicles: numberVehiclesString,
    profil_image: profileImage,
    password,
    confirm_password: confirmPassword,
  } = req.body;

  // Regular expressions for validation
  const emailRegex = /[a-z0-9._]+@[a-z0-9-]+\.[a-z]{2,3}/;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  // Array to store validation errors
  const errors = [];

  // Validation for the 'name' field
  if (name == null) {
    errors.push({ field: "Name", message: "This field is required" });
  } else if (name.length >= 100) {
    errors.push({
      field: "Name",
      message: "Must contain less than 100 characters",
    });
  }

  // Validation for the 'firstname' field
  if (firstname == null) {
    errors.push({ field: "Firstname", message: "This field is required" });
  } else if (firstname.length >= 100) {
    errors.push({
      field: "Firstname",
      message: "Must contain less than 45 characters",
    });
  }

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

  // Validation for the 'gender' field
  if (gender == null) {
    errors.push({ field: "Gender", message: "This field is required" });
  } else if (gender.length >= 45) {
    errors.push({
      field: "Gender",
      message: "Must contain less than 45 characters",
    });
  }

  // Validation for the 'date_of_birth' field
  if (dateOfBirth == null) {
    errors.push({
      field: "Date of Birth",
      message: "This field is required",
    });
  } else if (!dateRegex.test(dateOfBirth)) {
    errors.push({
      field: "Date of Birth",
      message: "Invalid date format. Use YYYY-MM-DD format",
    });
  }

  // Validation for the 'postal_code' field
  if (postalCode == null) {
    errors.push({ field: "postalCode", message: "This field is required" });
  } else if (!/^[0-9]{5}$/.test(postalCode)) {
    errors.push({
      field: "Postal Code",
      message: "Invalid postal code (must contain 5 digits)",
    });
  }

  // Validation for the 'city' field
  if (city == null) {
    errors.push({ field: "city", message: "This field is required" });
  } else if (city.length >= 45) {
    errors.push({
      field: "City",
      message: "Must contain less than 45 characters",
    });
  }

  // Convert the value of the 'number_vehicles' field to a number
  const numberVehicles = parseInt(numberVehiclesString, 10);

  // Validation for the 'number_vehicles' field
  if (
    numberVehicles == null ||
    Number.isNaN(numberVehicles) ||
    numberVehicles < 0
  ) {
    errors.push({
      field: "Number of Vehicles",
      message: "Number of vehicles must be a positive integer",
    });
  }

  // Validation for the 'profile_image' field
  if (profileImage) {
    const regex = /\.(jpg|jpeg|png|gif)$/i;

    if (!regex.test(profileImage)) {
      errors.push({
        field: "profileImage",
        message:
          "Invalid image format. Allowed formats are JPG, JPEG, PNG, and GIF.",
      });
    }
  }

  // Validation for password length
  if (password.length < 8) {
    errors.push({
      field: "password",
      message: "Password must be at least 8 characters long",
    });
  }

  // Validation for password confirmation
  if (password !== confirmPassword) {
    errors.push({
      field: "confirmPassword",
      message: "Passwords do not match",
    });
  }

  // If errors are present, return a response with status code 422
  if (errors.length) {
    res.status(422).json({ validationErrors: errors });
  } else {
    // If no errors, proceed to the next middleware function
    delete req.body.confirm_password;
    req.body.is_admin = 0;
    next();
  }
};

module.exports = validateUser;
