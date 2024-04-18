const {
  selectArticles,
  selectArticlesById,
  updateArticle,
  checkArticleExists
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticlesById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  checkArticleExists(article_id)
    .then(() => {
      return updateArticle(article_id, inc_votes);
    })
    .then((patchedArticle) => {
      res.status(201).send({ article: patchedArticle });
    })
    .catch((err) => {
      next(err);
    });
};
