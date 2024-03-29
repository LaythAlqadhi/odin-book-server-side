const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const RateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const passport = require('./auth/passportConfig');

// Configure Cloudinary
cloudinary.config({ secure: true });

// Connect to MongoDB
require('./database/mongoConfig');

// Define routes
const indexRouter = require('./routes/indexRouter');
const authRouter = require('./routes/authRouter');
const usersRouter = require('./routes/usersRouter');
const postsRouter = require('./routes/postsRouter');

// Create Express app
const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Rate limiting
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 90,
});

// Apply Express middleware
app.use(limiter);
app.use(passport.initialize());
app.use(helmet());
app.use(compression());
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.use('/', indexRouter);
app.use('/v1', authRouter);
app.use('/v1', usersRouter);
app.use('/v1', postsRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
