const { AuthenticationError } = require('apollo-server-express')

module.exports.authorazEvaluation = (context)=>{
    let reasonOfFail = ''
    if(!context.authorazRes.accesPermission){
        if(tokenDetails.error){
            reasonOfFail = 'Token process error!';
        }
        if(tokenDetails.isExpired){
            reasonOfFail = 'Expired token!';
        }
        reasonOfFail = 'Missing token!';
    }
    if(reasonOfFail){
        throw new AuthenticationError('Login to use the service!', { general: reasonOfFail })
    } 
    return;
}