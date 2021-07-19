const { EMAIL_TRANSPORT, EMAIL_FROM } = require('./secureConfig')

module.exports = {

    EMAIL_ORIGIN_ACCOUNT: process.env.MAIL_FROM_ACCOUNT || EMAIL_FROM,

    EMAIL_CONNECTION_FORTEST: {
        host: EMAIL_TRANSPORT.HOST,
        port: EMAIL_TRANSPORT.PORT,
        auth: {
            user: EMAIL_TRANSPORT.UN,
            pass: EMAIL_TRANSPORT.PWD
        }
    },

    EMAIL_CONNECTION_PRODUCTION: { 
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN
        }
    }
}