const db = require("../db/connection.js");
const format = require("pg-format");

exports.selectTopics = () => {
  return db.query(`SELECT slug, description FROM topics;`).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "Not found" });
    }
    return rows;
  });
};
