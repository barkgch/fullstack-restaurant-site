const mysql = require("mysql2");
const dbConfig = require("../config/db.config.js")

// create connection
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

// open connection
connection.connect(error => {
  // console.log("info from dotenv: ", {...connection});
  if (error) throw error;
  console.log("Successfully connected to database.");
});

module.exports = connection;