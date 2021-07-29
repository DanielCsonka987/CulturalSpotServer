const { TOKEN_SECURE } = require('./secureConfig')

module.exports = {
    TOKEN_EXPIRE: '1h',
    TOKEN_SECRET: process.env.TOKEN_PWD || TOKEN_SECURE,
    TOKEN_PREFIX: 'Bearer ',    //especially for testing reasons

    BCRYPT_ROUND: 12,

    ROUTING: {
        RESETPWD_REST_GET_ROUTE: '/resetpassword/',
        CHATTING_REST_GET_ROUTE: '/chatmessages/'
    }
}