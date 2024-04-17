const db = require("../db/connection.js");
const { selectArticlesById } = require("./articles.models.js");

exports.selectCommentsForArticle = (article_id) => {
    return Promise.all([db
      .query(
        `SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id=$1;`,
        [article_id]
      ), selectArticlesById(article_id)])
      .then((promises) => {
        return promises[0].rows;
      });
  };
  