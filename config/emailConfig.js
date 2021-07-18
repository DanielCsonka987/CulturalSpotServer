const { EMAIL_TRANSPORT } = require('./secureConfig')

module.exports = {

    EMAIL_ORIGIN_ACCOUNT: '',

    EMAIL_CONNECTION: {
        host: process.env.EMAIL_HOST || EMAIL_TRANSPORT.HOST,
        port: process.env.EMAIL_PORT || EMAIL_TRANSPORT.PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_UN || EMAIL_TRANSPORT.UN,
            pass: process.env.EMAIL_PWD || EMAIL_TRANSPORT.PWD
        }
    }
}