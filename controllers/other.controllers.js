const endpoints = require("../endpoints.json");

exports.getEndpoints = (req, res, next) => {
    return Promise.resolve( endpoints )
    .then((endpoints) => {
        res.status(200).send({ endpoints: endpoints });
    })
    .catch((err) => {
      next(err);
    });
};
