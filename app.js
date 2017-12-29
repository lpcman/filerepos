const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
// const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const lessMiddleware = require('less-middleware');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

const index = require('./routes/index');
const users = require('./routes/users');
const upload = require('./routes/uploadApi');
const fileController = require('./routes/fileController');
const S = require('./settings');

const app = express();

app.set('trust proxy', true);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));

// app.use(cookieParser('++++----'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 0.5 * 24 * 60 * 60 // = one half days. Default
    }),
    // genid: function (req) {
    //     return Math.random().toString(35).substr(2, 10) + "-" + +new Date;
    // },
    secret: '++++----',
    proxy: true,
    resave: false, //don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    cookie: {
        secure: false
    }
}));

// Session-persisted message middleware
app.use(function (req, res, next) {
    // req.session.tick = Date.now();
    let err = req.session.error;
    delete req.session.error;
    if (err)
        res.locals.message = err;
    next();
});

app.use(function (req, res, next) {
    res.locals.PROJECT_NAME = S.PROJECT_NAME;
    res.locals.STATIC_PREFIX = S.STATIC_PREFIX;
    if (req.session.user
        || req.url === '//'
        || req.url === S.PROJECT_NAME
        || req.url === S.PROJECT_NAME + '/'
        || (req.url === S.PROJECT_NAME + '/login')
        || req.url === S.PROJECT_NAME + '/register') {
        res.locals.session = req.session;
        next();
    } else {
        req.session.error = '请登录后访问';
        res.status(302).redirect(S.PROJECT_NAME + '/login');
    }
});

app.use(S.PROJECT_NAME + '/', index);
app.use(S.PROJECT_NAME + '/users', users);
app.use(S.PROJECT_NAME + '/api/*', function (req, res, next) {
    res.contentType('json');
    next();
});
app.use(S.PROJECT_NAME + '/api', upload);
app.use(S.PROJECT_NAME + '/file', fileController);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
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
