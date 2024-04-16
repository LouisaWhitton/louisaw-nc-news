const db = require("../db/connection.js");

exports.selectArticlesById = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, message: "invalid request" });
  }
  
  return db
    .query(
      `SELECT author, title, article_id, body, topic, created_at, votes, article_img_url FROM articles WHERE article_id=$1;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "article not found" });
      }
      return rows;
    });
};
