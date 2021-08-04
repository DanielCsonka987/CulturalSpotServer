const jwt = require('jsonwebtoken')

const { TOKEN_SECRET, TOKEN_ACCESS_EXPIRE, TOKEN_RESET_EXPIRE,
     TOKEN_PREFIX } = require('../config/appConfig')

/*
 * general usage methods
 */
function tokenEncoderWithExp (tokenInput, specSecureKey, expireLength){
    return jwt.sign(tokenInput, specSecureKey || TOKEN_SECRET, 
        { expiresIn: expireLength }
    )
}
function tokenSchemaIsFaulty(theTokenText){
    return !(theTokenText.split('.').length === 3)
}



module.exports = {
    /*
     * those for authorization header token creation and revision  
     */
    authorizTokenInputRevise: (reqToVerif)=>{
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
        if(tokenSchemaIsFaulty(theTokenText)){
            results.tokenMissing = true;
            return results;
        }
        results.takenText = theTokenText;
        return results;
        
    },
    autorizTokenEncoder: (tokenInput)=>{
        return tokenEncoderWithExp(tokenInput, '', TOKEN_ACCESS_EXPIRE)   
    },
    authorizTokenVerify: (tokenObj)=>{ 
        const results = {
            accesPermission: false,
            isExpired: false,
            error: false,
        }
        if(tokenObj.tokenMissing){
            return results
        }
        return jwt.verify(tokenObj.takenText, TOKEN_SECRET, (err, decoded)=>{
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

    /*
     * this is for manage forgotten password reset-token
     * content is marker = timemark (integer in ms)
     * secret key consists of user id + user pwdhash
    */
    createTokenToLink: (dateToPayloadAndSecret, pwdHashToSecret, userIdToLink )=>{
        const keyToEncript = dateToPayloadAndSecret + pwdHashToSecret;

        const theToken = tokenEncoderWithExp({ marker: dateToPayloadAndSecret },
            keyToEncript, TOKEN_RESET_EXPIRE)

        return userIdToLink + '.' + theToken
    },
    resoluteTokenFromLink: (tokenInput)=>{
        const results = {
            tokenMissing: false,
            takenUserid: null,
            takenText: null
        }
        const parts = tokenInput.split('.');
        if(parts.length !== 4){
            results.tokenMissing = true
            return results
        }
        if(parts.includes('')){
            results.tokenMissing = true
            return results
        }
        results.takenUserid = parts[0]
        results.takenText = parts[1] + '.' + parts[2] + '.' + parts[3] 
        return results
    },
    verifyTokenFromLink: (tokenObj, dateToPayloadAndSecret, pwdHashToSecret)=>{
        const results = {
            passResetPermission: false,
            isExpired: false,
            error: false,
        }
        if(tokenObj.tokenMissing){
            return results
        }
        // from DB in this case
        const keyToEncript = dateToPayloadAndSecret + pwdHashToSecret;
        return jwt.verify(tokenObj.takenText, keyToEncript, (err, decoded)=>{
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
            if(decoded.marker !== dateToPayloadAndSecret){
                return results
            }
            results.passResetPermission = true;
            return results
        })
    },
    /*
     * those are for refresh token management
     * content is only id field, no expire
    */
    createRefreshToken: (tokenContent)=>{
        return  jwt.sign(tokenContent, TOKEN_SECRET)
    },
    loginRefreshTokenInputRevise: (tokenFromBody)=>{
        const results = {
            tokenMissing: false,
            takenText: null
        }
        if(tokenSchemaIsFaulty(tokenFromBody)){
            results.tokenMissing = true
            return results
        }
        results.takenText = tokenFromBody
        return results
    },
    loginRefreshTokenValidate: (tokenObj)=>{
        const results = {
            refreshingPermission: false,
            error: false,
        }
        if(tokenObj.tokenMissing){
            return results
        }
        return jwt.verify(tokenObj.takenText, TOKEN_SECRET, (err, decoded)=>{
            if(err){
                results.error = err;
                return results
            }
            results.refreshingPermission = true;
            return Object.assign(results, decoded);
        })

    }
}