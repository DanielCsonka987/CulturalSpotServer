const { TOKEN_SECURE } = require('./secureConfig')

module.exports = {
    TOKEN_EXPIRE: '1h',
    TOKEN_SECRET: process.env.TOKEN_PWD || TOKEN_SECURE,

    BCRYPT_ROUND: 12
}