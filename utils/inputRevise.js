
module.exports.loginInputRevise = ( email, pwdText )=>{
    const values = {
        email: email.trim(), 
        pwdText
    }
    const result = {
        error: false, field: [], issue: []
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

module.exports.registerInputRevise = (email, pwdText, pwdTextConf, uname)=>{
    const values = {
        email: email.trim(),
        username: uname.trim(),
        pwdText
    }
    const result = {
        error: false, field: [], issue: []
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
    if(values.pwdText !== pwdTextConf){
        result.error = true;
        result.field.push('passwordconf');
        result.issue.push('This password conformation is not proper!')
    }
    if(isThereProblemWithUsername(values.username)){
        result.error = true;
        result.field.push('username');
        result.issue.push('This username is not acceptable!')
    }
    return result.error? result : values;
}

module.exports.resetPwdInputRevise = (email)=>{
    const values = {
        email: email.trim()
    }
    const result = {
        error: false, field: [], issue: []
    }
    if(isThereProblemWithEmail(values.email)){
        result.error = true;
        result.field.push('email');
        result.issue.push('This email is not acceptable!')
    }
    return result.error? result : values;
}

module.exports.updateAccDetInputRevise = (uname)=>{
    const values = {
        username: uname.trim()
    }
    const result = {
        error: false, field: [], issue: []
    }
    if(isThereProblemWithUsername(values.username)){
        result.error = true;
        result.field.push('username');
        result.issue.push('This username is not acceptable!')
    }
    return result.error? result : values;
}

module.exports.changePwdInputRevise = (pwdTextOld, pwdTextNew, pwdTextConf )=>{
    const values = {
        pwdTextOld,
        pwdTextNew
    }
    const result = {
        error: false, field: [], issue: []
    }
    if(isThereProblemWithPassword(values.pwdTextOld)){
        result.error = true;
        result.field.push('oldpassword');
        result.issue.push('The old password is not acceptable!')
    }
    if(isThereProblemWithPassword(values.pwdTextNew)){
        result.error = true;
        result.field.push('newpassword');
        result.issue.push('The new password is not acceptable!')
    }
    if(values.pwdTextNew !== pwdTextConf){
        result.error = true;
        result.field.push('passwordconf');
        result.issue.push('The new password conformation is not proper!')
    }
    return result.error? result : values;
}

module.exports.deleteAccInputRevise = (pwdTextOld, pwdTextConf)=>{
    const values = {
        pwdTextOld
    }
    const result = {
        error: false, field: [], issue: []
    }
    if(isThereProblemWithPassword(values.pwdTextOld)){
        result.error = true;
        result.field.push('password');
        result.issue.push('The password is not acceptable!')
    }
    if(values.pwdTextOld !== pwdTextConf){
        result.error = true;
        result.field.push('passwordconf');
        result.issue.push('The password conformation is not proper!')
    }
    return result.error? result : values;
}

module.exports.useridInputRevise = (id)=>{
    const values = {
        userid: id
    }
    const result = {
        error: false, field: [], issue: []
    }
    if(isThereProblemWithUserid(values.userid)){
        result.error = true;
        result.field.push('userid');
        result.issue.push('The userid is not acceptable!')
    }
    return result.error? result : values;
}


module.exports.postInputRevise = (postContent)=>{

}

module.exports.commentInputRevise = (commentContent)=>{

}



function isThereProblemWithEmail(emailText){
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
    //somehow it cannot identify the lack of '.' (dot) between domain name and extension
    const pattern = '^[a-z0-9._]{3,}@[a-z]{3,}\.{1}[a-z]{2,3}$';
    const analyzer = new RegExp(pattern)
    return !analyzer.test(emailText)

}

function isThereProblemWithPassword(pwdText){
    if(!pwdText){
        return true;
    }
    const pattern = '.{6,}';
    const analyzer = new RegExp(pattern)
    return !analyzer.test(pwdText)
}

function isThereProblemWithUsername(unameText){
    if(!unameText){
        return true;
    }
    if(unameText.length > 50){
        return true
    } 
    const pattern = '[a-zA-Z0-9_ ]{4,}';
    const analyzer = new RegExp(pattern)
    return !analyzer.test(unameText)
}

function isThereProblemWithUserid(usrid){
    if(!usrid){
        return true
    }
    if(usrid.length !== 24){
        return true
    }
    const analyzer = new RegExp(/[a-f0-9]{24}/)
    return !analyzer.test(usrid)
}