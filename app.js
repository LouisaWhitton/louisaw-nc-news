const express = require("express");
const app = express();
const { getEndpoints } = require("./controllers/other.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticles,
  getArticlesById,
  patchArticle,
} = require("./controllers/articles.controllers");
const {
  getCommentsForArticle,
  postComments,
  removeComment
} = require("./controllers/comments.controllers");
const { getUsers } = require("./controllers/users.controllers");
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles/:article_id/comments", getCommentsForArticle);

app.get("/api/topics", getTopics);

app.get("/api/users", getUsers);

app.patch("/api/articles/:article_id", patchArticle);

app.post("/api/articles/:article_id/comments", postComments);

app.delete("/api/comments/:comment_id", removeComment);

app.all("*", (req, res, next) => {
  res.status(404).send({ message: "not found" });
  next();
});

app.use((err, req, res, next) => {
	if (err.code === "22P02") {
		res.status(400).send({ message: "invalid request" }) 
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
  next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "internal server error" });
  next();
});

module.exports = app;
