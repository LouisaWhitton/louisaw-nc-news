const endpoints = require("../endpoints.json");
const { selectTopics } = require("../models/ncnews.models");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getEndpoints = (req, res, next) => {
    return Promise.resolve( endpoints )
    .then((endpoints) => {
        res.status(200).send({ endpoints: endpoints });
    })
    .catch((err) => {
      next(err);
    });
};
