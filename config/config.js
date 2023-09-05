require('dotenv').config();

module.exports = {
    production: {
        username: process.env.PROD_DB_USERNAME || 'root',
        password: process.env.PROD_DB_PASSWORD || '',
        database: process.env.PROD_DB_NAME || 'track-replay-api',
        host: process.env.PROD_DB_HOSTNAME || '127.0.0.1',
        port: process.env.PROD_DB_PORT || 3306,
        dialect: process.env.PROD_DB_DIALECT || 'mysql',
        dialectOptions: {
            bigNumberStrings: true
        },
        logging: false,
    },
    development: {
        username: process.env.DEV_DB_USERNAME || 'root',
        password: process.env.DEV_DB_PASSWORD || '',
        database: process.env.DEV_DB_NAME || 'track-replay-api-dev',
        host: process.env.DEV_DB_HOSTNAME || '127.0.0.1',
        port: process.env.DEV_DB_PORT || 3306,
        dialect: process.env.DEV_DB_DIALECT || 'mysql',
        dialectOptions: {
            bigNumberStrings: true
        }
    },
    test: {
        username: process.env.TEST_DB_USERNAME || 'root',
        password: process.env.TEST_DB_PASSWORD || '',
        database: process.env.TEST_DB_NAME || 'track-replay-api-test',
        host: process.env.TEST_DB_HOSTNAME || '127.0.0.1',
        port: process.env.TEST_DB_PORT || 3306,
        dialect: process.env.TEST_DB_DIALECT || 'mysql',
        dialectOptions: {
            bigNumberStrings: true
        },
        logging: false,
    }
}