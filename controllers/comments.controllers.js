const { checkArticleExists } = require("../models/articles.models");
const {
  selectCommentsForArticle,
  insertComment,
  checkCommentExists,
} = require("../models/comments.models");

exports.getCommentsForArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsForArticle(article_id)
    .then((comments) => {
      if (comments.length === 0) {
        res.status(404).send({ message: "no comments yet!" });
      }
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComments = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;
  checkArticleExists(article_id)
    .then(() => {
      return insertComment(comment, article_id);
    })
    .then((insertedComment) => {
      res.status(201).send({ comment: insertedComment });
    })
    .catch((err) => {
      next(err);
    });
};
