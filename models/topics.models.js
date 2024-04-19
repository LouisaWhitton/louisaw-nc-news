const db = require("../db/connection.js");

exports.selectTopics = () => {
  return db.query(`SELECT slug, description FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.checkTopicExists = (topic) => {
  let topicString = topic;
  if(!topic){
    topicString = "all";
  };
  
  return db.query(`SELECT slug FROM topics WHERE slug = $1 OR $1 = 'all'`, [topicString])
  .then(({rows}) => {
    if(rows.length === 0){
      return Promise.reject({ status: 404, message: "topic not found" });
    }
    return true;
  })
}
