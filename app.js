const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const layouts      = require('express-ejs-layouts');
const mongoose     = require('mongoose');
const dotenv       = require('dotenv');
const cors         = require('cors');
const session    = require('express-session');
const passport   = require('passport');

dotenv.config();
mongoose.connect(process.env.MONGODB_URI);

// mongoose.connect(process.env.MONGODB_URI);


const app = express();

const passportSetup = require('./config/passport');
passportSetup(passport);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);
app.use(cors({
  credentials: true,
  origin: ['http://localhost:4200']
}));


app.use(session({
  secret: 'angular auth passport secret shh',
  resave: true,
  saveUninitialized: true,
  cookie : { httpOnly: true, maxAge: 2419200000 }
}));

app.use(passport.initialize());
app.use(passport.session());

const index = require('./routes/index');

app.use('/', index);

const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);
app.use((req, res, next) => {
  res.sendfile(__dirname + '/public/index.html');
});

const myListStuff = require('./routes/list-api-routes');
app.use('/', myListStuff);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
