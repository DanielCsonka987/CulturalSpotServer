const { EMAIL_TRANSPORT_TEST, EMAIL_TRANSPORT_PROD, EMAIL_FROM } = require('./secureConfig')

module.exports = {

    EMAIL_ORIGIN_ACCOUNT: process.env.MAIL_FROM_ACCOUNT || EMAIL_FROM,

    EMAIL_CONNECTION_FORTEST: {
        host: EMAIL_TRANSPORT_TEST.HOST,
        port: EMAIL_TRANSPORT_TEST.PORT,
        auth: {
            user: EMAIL_TRANSPORT_TEST.UN,
            pass: EMAIL_TRANSPORT_TEST.PWD
        }
    },
    EMAIL_CONNECTION_PRODUCTION: {
        service: process.env.MAIL_HOST || EMAIL_TRANSPORT_PROD.HOST,
        port: process.env.PORT_MAIL || EMAIL_TRANSPORT_PROD.PORT,
        auth: {
            user: process.env.USER || EMAIL_TRANSPORT_PROD.UN,
            pass: process.env.PWD || EMAIL_TRANSPORT_PROD.PWD
        }
    }
}