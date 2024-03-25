const tables = require("../tables");
// controller function to browse all users
const browse = async (req, res, next) => {
  try {
    const users = await tables.user.readAllUser(req.query.is_admin);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
// controller function to browse all users number
const browseStatistics = async (req, res, next) => {
  try {
    const users = await tables.user.readAllUserStatistics();
    const totalUsers = users.length;
    res.status(200).json({ totalUsers });
  } catch (error) {
    next(error);
  }
};
// controller function to read a user by id
const read = async (req, res, next) => {
  try {
    const user = await tables.user.readUser(req.params.id, req.query.is_admin);
    if (!user) {
      res.sendStatus(404);
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    next(error);
  }
};
// controller function to read a user.is_admin by id
const readIsAdmin = async (req, res, next) => {
  try {
    const user = await tables.user.readUserIsAdmin(req.params.id);
    if (!user) {
      res.sendStatus(404);
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    next(error);
  }
};
// controller function to read a user.is_admin by id
const readAllUserAdmin = async (req, res, next) => {
  try {
    const users = await tables.user.readAllUserIsAdmin(req.query.id);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
// controller function to read a user by email
const readByEmailAndPassToNext = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await tables.user.readByEmail(email);
    const errors = [];
    if (user == null) {
      errors.push({
        field: "Email ou le mot de passe",
        message: "sont incorrect",
      });
      res.status(401).json({ validationErrors: errors });
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    next(err);
  }
};
// controller function to edit a user
const edit = async (req, res, next) => {
  try {
    const user = await tables.user.edit(req.body, req.params.id);
    if (user == null) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    next(error);
  }
};
// controller function to add a user
const add = async (req, res, next) => {
  try {
    const user = await tables.user.add(req.body);
    if (!user) {
      res.sendStatus(404);
    } else {
      res.status(201).json(user);
    }
  } catch (error) {
    next(error);
  }
};
// controller function to delete a user
const destroy = async (req, res, next) => {
  try {
    const result = await tables.user.delete(req.params.id);

    if (result.affectedRows === 0) {
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
  readIsAdmin,
  readAllUserAdmin,
  readByEmailAndPassToNext,
  edit,
  add,
  destroy,
};
