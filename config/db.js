const mongoose = require("mongoose");
const { DB_QUERYSTRING } = require("./env.js");

exports.dbInit = () => {
  mongoose.connection.on("open", () => console.log("DB is connected!"));
  return mongoose.connect(DB_QUERYSTRING); //return asynchronous function
};
