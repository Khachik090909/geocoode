const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const client = require("../../database/client");
// Middleware pour hacher le mot de passe
const hashPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    // Validation pour le champ 'password'
    if (password == null) {
      return res.status(400).json({
        error: {
          field: "password",
          message: "Ce champ est obligatoire",
        },
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        error: {
          field: "password",
          message: "Le mot de passe doit contenir au moins 8 caractères",
        },
      });
    }

    // Hachage du mot de passe avec Argon2
    const hash = await argon2.hash(password);
    req.body.hashed_password = hash;
    delete req.body.password;
    next();
  } catch (err) {
    next(err);
  }
  return null;
};

// Middleware pour vérifier le mot de passe lors de l'authentification
const verifyPassword = async (req, res, next) => {
  const { password } = req.body;
  const { hashed_password: hashedPassword } = req.user;

  try {
    const reponse = await argon2.verify(hashedPassword, password);
    if (!reponse) {
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

// Middleware pour vérifier le token JWT lors des requêtes sécurisées
const verifyToken = async (req, res, next) => {
  try {
    const authorization = req.get("Authorization");

    if (!authorization) {
      throw new Error("Merci de vous identifier !");
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

const verifyTokenValid = (req, res, next) => {
  const authorization = req.get("Authorization");
  if (!authorization) {
    throw new Error("Merci de vous identifier !");
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

    // Vérifier si la date d'expiration est valide
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      return res.status(401).json({ error: "Token has expired" });
    }

    req.user = token;
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
  return null;
};
const verifyPasswordActual = async (req, res, next) => {
  const { id } = req.params;
  const { passwordActuel } = req.body;
  const [rows] = await client.query(
    "SELECT hashed_password FROM user WHERE id = ?",
    [id]
  );
  const Password = rows[0].hashed_password;

  const reponse = await argon2.verify(Password, passwordActuel);
  if (!reponse) {
    return res.status(401).send("Le mot de passe actuel est incorrect.");
  }
  delete req.body.passwordActuel;
  next();
  return null;
};
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
  return null;
};
const addPassword = async (req, res, next) => {
  const { id } = req.params;
  const [rows] = await client.query(
    "SELECT hashed_password,date_of_birth FROM user WHERE id = ?",
    [id]
  );

  req.body.hashed_password = rows[0].hashed_password;
  delete req.body.id;
  next();

  return null;
};
const verifyAdmin = async (req, res, next) => {
  const [rows] = await client.query("SELECT is_admin FROM user WHERE id = ?", [
    req.query.id,
  ]);
  delete req.query.id;
  req.query.is_admin = rows[0].is_admin;
  next();
};
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
