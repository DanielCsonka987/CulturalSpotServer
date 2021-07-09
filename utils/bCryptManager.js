const bcrypt = require('bcrypt')

const { BCRYPT_ROUND } = require('../config/appConfig')

module.exports = {
    encryptPwd: async (textToEncode)=>{
        try{
            const hash = await bcrypt.hash(textToEncode, BCRYPT_ROUND)
            return { hash, error: false }
        }catch(err){
            return { hash: false, error: err }
        }
    },
    matchTextHashPwd: async (textToMatch, hashToMatch)=>{
        try{
            const match = await bcrypt.compare(textToMatch, hashToMatch)
            return { match, error: false }
        }catch(err){
            return { match: false, error: err }
        }
    }
}