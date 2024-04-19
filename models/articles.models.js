const db = require("../db/connection.js");
const { selectTopics } = require("./topics.models.js");

exports.selectArticles = (topic) => {
  let sqlString = `SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, 
  COUNT(c.article_id) as comment_count 
  FROM articles AS a LEFT OUTER JOIN comments AS c ON c.article_id = a.article_id`;

  if (topic) {
    sqlString += ` WHERE a.topic = '${topic}'`;
  }

  sqlString += ` GROUP BY a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url
  ORDER BY a.created_at DESC;`;

  return db.query(sqlString)
  .then(({ rows }) => {
    return rows;
  });
};

exports.selectArticlesById = (article_id) => {
  const sqlString = `
  SELECT a.author, a.title, a.article_id, a.body, a.topic, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id) AS comment_count
  FROM articles AS a
  LEFT OUTER JOIN comments AS c
  ON c.article_id = a.article_id
  WHERE a.article_id=$1
  GROUP BY a.author, a.title, a.article_id, a.body, a.topic, a.created_at, a.votes, a.article_img_url`;

  return db.query(sqlString,[article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "article not found" });
      }
      return rows;
    });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT article_id FROM articles WHERE article_id=$1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "article not found" });
      }
      return true;
    });
};

exports.updateArticle = (article_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, message: "invalid input" });
  }

  return db
    .query(
      `UPDATE articles SET votes = (votes + $1) WHERE article_id = $2 RETURNING *;`,
      [inc_votes, article_id]
    )
    .then((updatedArticle) => {
      return updatedArticle.rows[0];
    });
};
