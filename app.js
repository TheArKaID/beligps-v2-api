const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morganLogger = require('morgan');
const logger = require('./helpers/Logger').init();
const config = require('./config/index')
const jwt = require('jsonwebtoken');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
app.disable('x-powered-by');
app.use(cors());

if (config.app.env !== 'test') {
    app.use(morganLogger('dev'));
}

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    let paths = req.path;
    let splitted_path = paths.split('/');
    let role = splitted_path[1];
    let new_path = splitted_path[0] + '/' + splitted_path[1] + (splitted_path[2] ? '/' + splitted_path[2] : '');

    var token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;
    var tokendata = jwt.decode(token);
    let user = tokendata != null ? tokendata.name : null;
    let body_data = { ...req.body };
    body_data.password = body_data.password ? null : undefined;

    logger.set(role, true, new_path, req.method, user, req.ip);
    logger.log('info', `${JSON.stringify(body_data)}`);

    next();
});

app.use(express.json());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    let status_code = err.status ? (err.status).toString().substring(0, 1) : 5;
    if (status_code == 4) {
        logger.log('warn', `${err.error_message || err.error || err.statusText || 'No Message'}`)
        return res.status(err.status || err.statusCode || 400).send({
            'status': err.status || err.statusCode || 400,
            'message': err.message || 'Failed',
            'error': {
                'field': err.field || 'error',
                'key': err.key || 'unknown.error',
                'message': err.error_message || err.statusText || 'Please Contact API Administrator for more info',
                'stack': err.stack
            }
        });
    }

    logger.log('error', `${err.message || err.statusText || err.error || err.error_message || 'No Message'} - ${err.stack || 'Unknown Error Source File'}`)
    return res.status(500).send({
        'status': '500',
        'message': 'Service Unavailable',
        'error': {
            'field': err.name || 'error',
            'key': 'server.error',
            'message': 'Please Contact API Administrator for more info'
        }
    });
});

module.exports = app;
