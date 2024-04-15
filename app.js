const express = require("express");
const app = express();
const { getTopics, getEndpoints } = require("./controllers/ncnews.controllers");

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.all("*", (req, res, next) => {
  res.status(400).send({ message: "invalid request" });
  next();
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "internal server error" });
  next();
});

module.exports = app;
