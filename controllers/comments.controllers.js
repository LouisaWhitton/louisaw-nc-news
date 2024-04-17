const { selectCommentsForArticle } = require("../models/comments.models");

exports.getCommentsForArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsForArticle(article_id)
    .then((comments) => {
      if(comments.length === 0){
        res.status(404).send({ message: "no comments yet!" });
      }
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
