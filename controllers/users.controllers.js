const { selectUsers } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
    const { test_no_users } = req.query;
    selectUsers(test_no_users)
      .then((users) => {
        res.status(200).send({ users });
      })
      .catch((err) => {
        next(err);
      });
  };