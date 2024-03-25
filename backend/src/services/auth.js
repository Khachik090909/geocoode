const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const client = require("../../database/client");

// Middleware for hashing the password
const hashPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    // Validation for the 'password' field
    if (password == null) {
      return res.status(400).json({
        error: {
          field: "password",
          message: "This field is required",
        },
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        error: {
          field: "password",
          message: "Password must be at least 8 characters long",
        },
      });
    }

    // Hashing the password with Argon2
    const hash = await argon2.hash(password);
    req.body.hashed_password = hash;
    delete req.body.password;
    next();
  } catch (err) {
    next(err);
  }
};

// Middleware to verify the password during authentication
const verifyPassword = async (req, res, next) => {
  const { password } = req.body;
  const { hashed_password: hashedPassword } = req.user;

  try {
    const response = await argon2.verify(hashedPassword, password);
    if (!response) {
      res.sendStatus(401);
    }
    const payload = {
      sub: req.user,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 24 * 60 * 60,
    });

    delete req.user.hashed_password;
    res.status(200).send({ token, user: req.user });
  } catch (err) {
    next(err);
  }
};

// Middleware to verify the JWT token during secure requests
const verifyToken = async (req, res, next) => {
  try {
    const authorization = req.get("Authorization");

    if (!authorization) {
      throw new Error("Please authenticate!");
    }

    const [type, token] = authorization.split(" ");
    if (type !== "Bearer") {
      throw new Error("Authorization header has not the 'Bearer' type");
    }

    req.payload = jwt.verify(token, process.env.JWT_SECRET);
    delete req.payload.sub.hashed_password;

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to verify the validity of JWT token
const verifyTokenValid = (req, res, next) => {
  const authorization = req.get("Authorization");
  if (!authorization) {
    throw new Error("Please authenticate!");
  }

  const [type, token] = authorization.split(" ");
  if (type !== "Bearer") {
    throw new Error("Authorization header has not the 'Bearer' type");
  }

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the expiration date is valid
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      return res.status(401).json({ error: "Token has expired" });
    }

    req.user = token;
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
};

// Middleware to verify the actual password
const verifyPasswordActual = async (req, res, next) => {
  const { id } = req.params;
  const { passwordActuel } = req.body;
  const [rows] = await client.query(
    "SELECT hashed_password FROM user WHERE id = ?",
    [id]
  );
  const Password = rows[0].hashed_password;

  try {
    const response = await argon2.verify(Password, passwordActuel);

    if (!response) {
      return res.status(401).send("Current password is incorrect.");
    }
    delete req.body.passwordActuel;
    next();
  } catch (error) {
    console.error("Error verifying the current password:", error);
  }
};

// Middleware to retrieve missing user elements
const missingElements = async (req, res, next) => {
  const [rows] = await client.query("SELECT * FROM user WHERE id = ?", [
    req.params.id,
  ]);
  if (!rows[0]) {
    return res.status(404).send("User not found");
  }

  req.body.name = rows[0].name;
  req.body.firstname = rows[0].firstname;
  req.body.gender = rows[0].gender;
  req.body.date_of_birth = rows[0].date_of_birth;
  req.body.is_admin = rows[0].is_admin;
  next();
};

// Middleware to add password
const addPassword = async (req, res, next) => {
  const { id } = req.params;
  const [rows] = await client.query(
    "SELECT hashed_password,date_of_birth FROM user WHERE id = ?",
    [id]
  );

  req.body.hashed_password = rows[0].hashed_password;
  delete req.body.id;
  next();
};

// Middleware to verify admin status
const verifyAdmin = async (req, res, next) => {
  const [rows] = await client.query("SELECT is_admin FROM user WHERE id = ?", [
    req.query.id,
  ]);
  delete req.query.id;
  req.query.is_admin = rows[0].is_admin;
  next();
};
// Middleware to verify exist email
const verifyExistEmail = async (req, res, next) => {
  const [rows] = await client.query("SELECT email FROM user WHERE email = ?", [
    req.body.email,
  ]);
  if (rows.length > 0) {
    return res.status(400).send("Email already exists");
  } else {
    next();
  }
};
module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken,
  verifyTokenValid,
  verifyPasswordActual,
  missingElements,
  addPassword,
  verifyAdmin,
  verifyExistEmail,
};
