const express = require("express");
const handlebars = require("express-handlebars");
const routes = require("./routes.js");
const { dbInit } = require("./config/db.js");
const cookieParser = require("cookie-parser");
const { auth } = require("./middlewares/authMiddleware.js");
const { errorHandler } = require("./middlewares/errorHandlerMiddleware.js");

//const { PORT } = require("./config/env.js");

const app = express();

app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
  })
);

app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(auth);
app.use(routes);
app.use(errorHandler);

dbInit();
app.listen(3000, () => console.log(`Server is running on port 3000...`));
