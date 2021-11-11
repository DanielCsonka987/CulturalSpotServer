const jwt = require('jsonwebtoken')

const { TOKEN_SECRET, TOKEN_ACCESS_EXPIRE, TOKEN_RESET_EXPIRE,
     TOKEN_PREFIX } = require('../config/appConfig')
    
const { authorizationHeaderExist, refreshingHeaderExist, isolateBearerFromHeader, 
    isolateTokenFromURL, tokenNormalSchemasFaulty, tokenSpecRevAndSplitting, resettingHeaderExist 
    } = require('./inputRevise')

/*
 * general usage methods
 */
function tokenEncoderWithExp (tokenInput, specSecureKey, expireLength){
    return jwt.sign(tokenInput, specSecureKey || TOKEN_SECRET, 
        { expiresIn: expireLength }
    )
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
        if(!authorizationHeaderExist(reqToVerif)){
            results.tokenMissing = true;
            return results;
        }
        const headerText = reqToVerif.headers.authorization;
        //prefix removal
        const theTokenTextorFalsy = isolateBearerFromHeader(headerText)
        if(!theTokenTextorFalsy){
            results.tokenMissing = true;
            return results;
        }

        //token schema test
        if(tokenNormalSchemasFaulty(theTokenTextorFalsy)){
            results.tokenMissing = true;
            return results;
        }
        results.takenText = theTokenTextorFalsy;
        return results;
        
    },
    authorizTokenEncoder: (tokenInput)=>{
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
                if(err.name === 'TokenExpiredError'){
                    results.isExpired = true;
                    return results;
                }
                results.error = err;
                return results
            }
            results.accesPermission = true;
            return Object.assign(results, decoded);
        })
    },
    
    /*
    const actTimeSecText = new Date().getTime().toString().slice(0,10);
    const actTime = new Number(actTimeSecText).valueOf()
    const expTime = new Number(decoded.exp)
    if(actTime > expTime){
        results.isExpired = true;
        return results;
    }
    */

    /*
     * this is for manage forgotten password reset-token
     * content is marker = timemark (integer in ms)
     * secret key consists of user id + user pwdhash
    */
    createResetTokenToLink: (dateToPayloadAndSecret, pwdHashToSecret, userIdToLink )=>{
        const keyToEncript = dateToPayloadAndSecret + pwdHashToSecret;

        const theToken = tokenEncoderWithExp({ marker: dateToPayloadAndSecret },
            keyToEncript, TOKEN_RESET_EXPIRE)

        return userIdToLink + '.' + theToken
    },
    resetTokenResoluteFromLink: (tokenInput)=>{
        const results = {
            tokenMissing: false,
            takenUserid: null,
            takenText: null
        }
        const specTokenPartsOrFalsy = tokenSpecRevAndSplitting(tokenInput);
        if(!specTokenPartsOrFalsy){
            results.tokenMissing = true
            return results
        }
        results.takenUserid = specTokenPartsOrFalsy[0]
        results.takenText = specTokenPartsOrFalsy[1] + '.' 
            + specTokenPartsOrFalsy[2] + '.' + specTokenPartsOrFalsy[3] 
        return results
    },
    resetTokenInputRevise: (reqToVerif)=>{
        const results = {
            tokenMissing: false,
            takenUserid: null,
            takenText: null
        }

        if(!resettingHeaderExist(reqToVerif)){
            results.tokenMissing = true
            return results
        }
        const tokenInput = reqToVerif.headers.resetting

        const specTokenPartsOrFalsy = tokenSpecRevAndSplitting(tokenInput);
        if(!specTokenPartsOrFalsy){
            results.tokenMissing = true
            return results
        }
        results.takenUserid = specTokenPartsOrFalsy[0]
        results.takenText = specTokenPartsOrFalsy[1] + '.' 
            + specTokenPartsOrFalsy[2] + '.' + specTokenPartsOrFalsy[3] 
        return results
    },
    resetTokenValidate: (tokenObj, dateToPayloadAndSecret, pwdHashToSecret)=>{
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
                if(err.name === 'TokenExpiredError'){
                    results.isExpired = true;
                    return results;
                }
                results.error = err;
                return results
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
    createLoginRefreshToken: (tokenContent)=>{
        return  jwt.sign(tokenContent, TOKEN_SECRET)
    },
    loginRefreshTokenInputRevise: (reqToVerif)=>{
        const results = {
            tokenMissing: false,
            takenText: null
        }
        if(!refreshingHeaderExist(reqToVerif)){
            results.tokenMissing = true;
            return results;
        }
        const tokenFromHeader = reqToVerif.headers.refreshing;
        if(tokenNormalSchemasFaulty(tokenFromHeader)){
            results.tokenMissing = true
            return results
        }
        results.takenText = tokenFromHeader
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
            results.takenText = tokenObj.takenText;
            results.refreshingPermission = true;
            return Object.assign(results, decoded);
        })

    },


    /**
     * Those for WebSocket authentication - normal JWT as URL content
     * no "Bearer " prefix; normal, verification the same
     */

    webSocketAuthenticationRevise: (request)=>{
        const results = {
            tokenMissing: false,
            takenText: null
        }
        const tokenFromURLOrFalse = isolateTokenFromURL(request.url)
        if(!tokenFromURLOrFalse){
            results.tokenMissing = true;
            return results
        }
        if(tokenNormalSchemasFaulty(tokenFromURLOrFalse)){
            results.tokenMissing = true;
            return results
        }
        results.takenText = tokenFromURLOrFalse
        return results
    }

}