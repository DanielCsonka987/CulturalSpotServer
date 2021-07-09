const jwt = require('jsonwebtoken')
const { TOKEN_SECRET, TOKEN_EXPIRE } = require('../config/appConfig')

module.exports = {
    tokenEncoder: (tokenInput, )=>{
        return jwt.sign(tokenInput, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRE })
    },
    tokenVerify: (tokenText)=>{
        return jwt.verify(tokenText, TOKEN_SECRET, (err, decoded)=>{

            return decoded;
        })
    }
}