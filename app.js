import express, { urlencoded, static as staticExpress, json } from 'express';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morganLogger from 'morgan';
import Logger from './helpers/Logger.js';
import config from './config/app.js';
import { decode } from 'jsonwebtoken';
import { basename as _basename, join, dirname } from 'path'
import { fileURLToPath } from 'url';

import indexRouter from './routes/index.js';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import companiesRouter from './routes/companies.js';
import devicesRouter from './routes/devices.js';
import vehiclesRouter from './routes/vehicles.js';
import pairingsRouter from './routes/pairings.js';

const app = express();

app.disable('x-powered-by');
app.use(cors());

if (config.env !== 'test') {
    app.use(morganLogger('dev'));
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(staticExpress(join(__dirname, 'public')));

const logger = Logger.init();

app.use(json());

app.use('/auth', authRouter);

app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'BeliGPS')

    let paths = req.path;
    let splitted_path = paths.split('/');
    let role = splitted_path[1];
    let new_path = splitted_path[0] + '/' + splitted_path[1] + (splitted_path[2] ? '/' + splitted_path[2] : '');

    var token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;
    var tokendata = decode(token);
    let user = tokendata != null ? tokendata?.user?.name : null;

    let body_data = { ...req.body };
    body_data.password = body_data.password ? null : undefined;

    // logger.set(role, true, new_path, req.method, user, req.ip);
    // logger.log('info', `${JSON.stringify(body_data)}`);

    req.user = tokendata?.user
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/companies', companiesRouter);
app.use('/devices', devicesRouter);
app.use('/vehicles', vehiclesRouter);
app.use('/pairings', pairingsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    let status_code = err.status ? (err.status).toString().substring(0, 1) : 5;
    if (status_code == 4) {
        // logger.log('warn', `${err.error_message || err.error || err.statusText || 'No Message'}`)
        return res.status(err.status || err.statusCode || 400).send({
            'status': err.status || err.statusCode || 400,
            'message': err.message || 'Failed',
            'error': err.response ? undefined : {
                'field': err.field || 'error',
                'key': err.key || 'unknown.error',
                'message': err.error_message || err.statusText || 'Please Contact API Administrator for more info',
                'stack': config.env =='development' ? err.stack : undefined
            },
            'response': err.response || undefined
        });
    }

    // logger.log('error', `${err.message || err.statusText || err.error || err.error_message || 'No Message'} - ${err.stack || 'Unknown Error Source File'}`)
    return res.status(500).send({
        'status': '500',
        'message': 'Service Unavailable',
        'error': {
            'field': err.name || 'error',
            'key': 'server.error',
            'message': 'Please Contact API Administrator for more info',
            'stack': config.env =='development' ? err.stack : undefined
        }
    });
});

export default app;
