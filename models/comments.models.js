const db = require("../db/connection.js");
const { selectArticlesById } = require("./articles.models.js");
const format = require("pg-format");

exports.selectCommentsForArticle = (article_id) => {
  return Promise.all([
    db.query(
      `SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id=$1;`,
      [article_id]
    ),
    selectArticlesById(article_id),
  ]).then((promises) => {
    return promises[0].rows;
  });
};

exports.insertComment = (comment, article_id) => {
  const commentArray = [comment.username, comment.body];
  const validInput = commentArray.every((inputValue) => {
    return inputValue !== undefined;
  });
  if (!validInput) {
    return Promise.reject({ status: 400, message: "invalid input" });
  }

  return db
    .query(
      `INSERT INTO comments (body, article_id, author, votes) VALUES ($2,${article_id},$1,0) RETURNING *;`,
      commentArray
    )
    .then((insertedComment) => {
      return insertedComment.rows[0];
    });
};

exports.checkCommentExists = (comment_id) => {
  return db
    .query(
      `SELECT comment_id FROM comments WHERE comment_id=$1;`,
      [comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "comment not found" });
      }
      return true;
    });
}

exports.deleteComment = (comment_id) => {
  return db
  .query(
    `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`,
    [comment_id]
  )
  .then((deletedComment) => {
    return deletedComment.rows[0];
  });
}
