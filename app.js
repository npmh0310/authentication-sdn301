// Import các thứ viện và module
var createError = require('http-errors'); // Thư viện dùng để tạo các lỗi HTTP.
var express = require('express'); //  Framework Node.js cho việc xây dựng các ứng dụng web.
//? update passport
var passport = require('passport'); // Middleware xác thực cho Node.js.
var session = require("express-session"); // Middleware cho phép quản lý các phiên làm việc trong Express.
var FileStore = require("session-file-store")(session); // Middleware cho việc lưu trữ thông tin phiên vào file trong hệ thống tệp.
const mongoose = require("mongoose"); //Thư viện ODM (Object Data Modeling) cho MongoDB và Node.js.
var path = require('path'); // Module cung cấp các tiện ích cho việc xử lý và tạo đường dẫn file và thư mục.
var cookieParser = require('cookie-parser'); //  Middleware để phân tích và đặt cookie trong các yêu cầu HTTP.
var logger = require('morgan'); // Middleware để ghi log các yêu cầu HTTP.

// Import các route
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cakeRouter = require("./routes/cakeRouter");

// Cấu hình và nối MongoDB
const url = "mongodb://127.0.0.1:27017/conFusion";
const connect = mongoose.connect(url);
connect.then(
  (db) => {
    console.log("Connect correctly to server");
  },
  (err) => {
    console.log(err);
  }
);

// Khởi tạo ứng dụng Express
var app = express();

// Cấu hình express-session middleware
app.use(
  session({
    name: "session-id",
    secret: "12345-67890-09876-54321",
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  })
);

//? Cấu hình passport
var authenticate = require('./authenticate');
app.use(passport.initialize());
app.use(passport.session());

// Middleware xác thực
function auth(req, res, next) {
  console.log(req.user);
  if (!req.user) {
    var err = new Error('You are not authenticated!');
    err.status = 403;
    next(err);
  }
  else {
    next();
  }
}
app.use("/users", usersRouter);
app.use(auth);


// Cấu hình view engine và middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//? Sử dụng các route
app.use('/', indexRouter);
app.use("/cakes", cakeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
