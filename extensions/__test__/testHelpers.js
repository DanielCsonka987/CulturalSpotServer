const { authorizTokenEncoder } = require('../../utils/tokenManager')

module.exports.createTokenHeader = (userid, email)=>{
    return  'Bearer ' + authorizTokenEncoder({ subj: userid, email: email })
}