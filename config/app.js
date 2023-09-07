import * as dotenv from 'dotenv'
dotenv.config()

export default {
    url: process.env.APP_URL || 'http://localhost',
    name: process.env.APP_NAME || 'Track Replay API',
    port: process.env.APP_PORT*1 || 4321,
    env: process.env.NODE_ENV || 'development',
    secret: {
        key: process.env.secret || 'JsonSecret',
        algorithm: process.env.algorithm || 'HS256',
    }
}