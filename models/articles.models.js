const db = require("../db/connection.js");

exports.selectArticles = () => {
  return db
    .query(
      `SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, 
      COUNT(c.article_id) as comment_count 
      FROM articles AS a LEFT OUTER JOIN comments AS c ON c.article_id = a.article_id
      GROUP BY a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url
      ORDER BY a.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

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

exports.checkArticleExists = (article_id) => {
  return db
    .query(
      `SELECT article_id FROM articles WHERE article_id=$1;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "article not found" });
      }
      return true;
    });
}
