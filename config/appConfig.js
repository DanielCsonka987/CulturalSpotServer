const appConf = []
try{
    const { TOKEN_SECURE } = require('./secureConfig')
    appConf['TOKEN_SEC'] = TOKEN_SECURE
}catch(err) { }

module.exports = {
    TOKEN_ACCESS_EXPIRE: '15min',
    TOKEN_RESET_EXPIRE: '1h',
    TOKEN_SECRET: process.env.TOKEN_PWD || appConf['TOKEN_SEC'],
    TOKEN_PREFIX: 'Bearer ',    //especially for testing reasons

    BCRYPT_ROUND: 12,

    ROUTING: {
        RESETPWD_REST_GET_ROUTE: '/resetpassword/',
    }
}