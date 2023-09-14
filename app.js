require('dotenv').config();

const mongoose = require('mongoose');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const bodyParser = require("body-parser");
const app = express();

const passportConfig = require('./passport');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors')
passportConfig();
/* cors 설정 시작 */

const corsOptions = {
    origin: 'http://localhhost:3000', // 배포시 주석
    // origin: 'https://pf6.chanyongyang.com:3000', // 배포시 주석 해제
    credentials: true
}
app.use(cors(corsOptions));

/* cors 설정 끝 */
/* passport start */
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
    session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly:true,
        secure: false // https일경우 true
    },
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', require('./routes/auth'));

app.use('/auth', require('./routes/members'));
/* passport end */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const Member = require('./models/member');
// const router = require('./router')(app, Member);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/* MongoDB connect start */
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
  console.log("Connection Success");
});
/* MongoDB connect end */


module.exports = app;
