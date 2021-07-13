const jwt = require('jsonwebtoken')

const { TOKEN_SECRET, TOKEN_EXPIRE, TOKEN_PREFIX } = require('../config/appConfig')

module.exports = {
    tokenEncoder: (tokenInput, )=>{
        return jwt.sign(tokenInput, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRE })
    },
    tokenInputRevise: (reqToVerif)=>{
        const results = {
            tokenMissing: false,
            takenText: null
        }
        const headerText = reqToVerif.headers.authorazition;
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
    tokenVerify: (tokenText)=>{ 
        return jwt.verify(tokenText, TOKEN_SECRET, (err, decoded)=>{
            const results = {
                userid: '',
                email: '',
                expired: false,
                error: false,
            }
            if(err){
                results.error = err;
                return results
            }

            const actTimeSecText = new Date().getTime().toString().slice(0,10);
            const actTime = new Number(actTimeSecText).valueOf()
            const expTime = new Number(decoded.exp)
            if(actTime > expTime){
                results.expired = true;
                return results;
            }

            results.userid = decoded.id;
            results.email = decoded.email;
            return results;
        })
    }
}