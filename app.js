const createError = require("http-errors");
const express = require("express");
const formData = require("express-form-data");
const os = require("os");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");


const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const registerRouter = require("./routes/register");
const weatherRouter = require("./routes/weather");
const fileRouter = require("./routes/file");

const app = express();

//git push heroku master
//db connection
const db = require("./helper/db")();

//config
const config = require("./config");
app.set("api_secret_key", config.api_secret_key);
app.set("api_mail_key", config.api_mail_key);
app.set("client_url", config.client_url);

//Middleware
const verifyToken = require("./middleware/verify-token");
const verifyTokenMail = require("./middleware/verify-token-mail");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const options = {
  uploadDir: os.tmpdir(),
  autoClean: true
};
 
//-------------------------------------------------

// // parse data with connect-multiparty. 
// app.use(formData.parse(options));
// // delete from the request all empty files (size == 0)
// app.use(formData.format());
// // change the file objects to fs.ReadStream 
// app.use(formData.stream());
// // union the body and the files
// app.use(formData.union());

//-------------------------------------------------


app.use("/resetPass", verifyTokenMail);
app.use("/updatePass", verifyTokenMail);
app.use("/", indexRouter);
app.use("/", registerRouter);
app.use("/api", verifyToken);
app.use("/api/files", fileRouter);
app.use("/api/users", usersRouter);
app.use("/api/weathers", weatherRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
