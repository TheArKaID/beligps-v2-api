import createLogger from 'bunyan'
import config from '../config/app.js'

const Logger = {}

let log

Logger.init = () => {
    let logger = createLogger({
        name: 'beligps-api-logger',
        appname: config.name,
        streams: [
            {
                level: 'info',
                path: 'storage/logs/app.log',
                type: 'rotating-file',
                period: '1d',
                count: 14
            },
            {
                level: 'error',
                path: 'storage/logs/error.log',
                type: 'rotating-file',
                period: '1d',
                count: 14
            }
        ]
    })
    log = logger
    return Logger
}

Logger.set = (role, simple, new_path, method, user, ip) => {
    log.child({ 'facility': role }, simple)
    log.new_path = new_path
    log.method = method
    log.user = user
    log.ip = ip
}

Logger.log = (level, message) => {
    let log_data = {
        method: log.method,
        path: log.new_path,
        user: log.user,
        ip: log.ip,
        message: message
    }
    log[level](JSON.stringify(log_data))
}

export default Logger