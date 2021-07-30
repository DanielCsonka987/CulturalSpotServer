const jwt = require('jsonwebtoken')

const { TOKEN_SECRET, TOKEN_EXPIRE, TOKEN_PREFIX } = require('../config/appConfig')

function tokenEncoder (tokenInput, specSecureKey){
    return jwt.sign(tokenInput, specSecureKey || TOKEN_SECRET, { expiresIn: TOKEN_EXPIRE })
}

module.exports = {

    tokenHeaderCreation: (tokenItself)=>{
        return `${TOKEN_PREFIX} ${tokenItself}`
    },
    tokenInputRevise: (reqToVerif)=>{
        const results = {
            tokenMissing: false,
            takenText: null
        }
        const headerText = reqToVerif.headers.authorization;
        if(!headerText){
            results.tokenMissing = true;
            return results;
        }
        //prefix removal
        const theTokenText = headerText.split(TOKEN_PREFIX)[1];
        if(!theTokenText){
            results.tokenMissing = true;
            return results;
        }
        //token schema test
        if(theTokenText.split('.').length !== 3){
            results.tokenMissing = true;
            return results;
        }
        results.takenText = theTokenText;
        return results;
        
    },
    tokenEncoder: tokenEncoder,
    tokenVerify: (tokenObj, specSecureKey)=>{ 
        const results = {
            accesPermission: false,
            isExpired: false,
            error: false,
        }
        if(tokenObj.tokenMissing){
            return results
        }
        return jwt.verify(tokenObj.takenText, specSecureKey || TOKEN_SECRET, (err, decoded)=>{
            if(err){
                results.error = err;
                return results
            }

            const actTimeSecText = new Date().getTime().toString().slice(0,10);
            const actTime = new Number(actTimeSecText).valueOf()
            const expTime = new Number(decoded.exp)
            if(actTime > expTime){
                results.isExpired = true;
                return results;
            }
            results.accesPermission = true;
            return Object.assign(results, decoded);
        })
    },
    createTokenToLink: (dateToPayloadAndSecret, pwdHashToSecret, userIdToLink )=>{
        const keyToEncript = dateToPayloadAndSecret + pwdHashToSecret;

        const theToken = tokenEncoder({ marker: dateToPayloadAndSecret },
            keyToEncript)

        return userIdToLink + '.' + theToken
    }
}