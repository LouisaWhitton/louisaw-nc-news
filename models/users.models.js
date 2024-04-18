const db = require("../db/connection.js");

exports.selectUsers = (test_no_users) => {
  let sqlString = `SELECT username, name, avatar_url FROM users`;
  if(test_no_users==="y"){
    sqlString += " WHERE username IS NULL;"
  };
  
  return db.query(sqlString)
  .then(({ rows }) => {
    if(rows.length === 0){
        return Promise.reject({ status: 404, message: "no users found" });
    }
    return rows;
  });
};