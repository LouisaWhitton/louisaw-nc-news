const app = require("./app");

app.all("*", (req, res, next) => {
  res.status(400).send({ message: "invalid request" });
  next();
});

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "internal server error" });
  next();
});
