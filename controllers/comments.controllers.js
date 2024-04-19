const { checkArticleExists } = require("../models/articles.models");
const {
  selectCommentsForArticle,
  insertComment,
  checkCommentExists,
  deleteComment
} = require("../models/comments.models");

exports.getCommentsForArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsForArticle(article_id)
    .then((comments) => {
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

exports.removeComment = (req, res, next) => {
  const { comment_id } = req.params;
  
  checkCommentExists(comment_id)
    .then(() => {
      return deleteComment(comment_id);
    })
    .then((deletedComment) => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
