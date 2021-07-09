
module.exports.loginRevise = ( email, pwdText )=>{
    const values = {
        email: email.trim(), 
        pwdText
    }
    const result = {
        error: false,
        field: [],
        issue: []
    }
    if(isThereProblemWithEmail(values.email)){
        result.error = true;
        result.field.push('email');
        result.issue.push('This email is not acceptable!')
    }
    if(isThereProblemWithPassword(values.pwdText)){
        result.error = true;
        result.field.push('password');
        result.issue.push('This password is not acceptable!')
    }
    return result.error? result : values;
}

module.exports.resetPasswordReqireStep1Revise = (email)=>{

}

module.exports.accountProcessRevise = (token)=>{

}

module.exports.postRevise = (token, postContent)=>{

}

module.exports.commentRevise = (token, commentContent)=>{

}


function isThereProblemWithEmail(emailText){
    //somehow it cannot identify the lack of '.' (dot) between domain name and extension
    const pattern = '^[a-z0-9._]{3,}@[a-z]{3,}\.{1}[a-z]{2,3}$';
    const analyzer = new RegExp(pattern)
    if(!emailText){
        return true;
    }
    if(!emailText.includes('.')){
        return true;
    }
    const parts = emailText.split('.').reverse()
    if(parts[0].length < 2 || parts[0].length > 3 ){
        return true;
    }
    return !analyzer.test(emailText)

}

function isThereProblemWithPassword(pwdText){
    const pattern = '[a-zA-Z0-9]{6,}';
    const analyzer = new RegExp(pattern)
    if(!pwdText){
        return true;
    }
    return !analyzer.test(pwdText)
}