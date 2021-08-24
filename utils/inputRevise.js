
//ACCOUNT, USER-CONNECTION INPUT REVISIONS

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
    if(isThereProblemWithDBKey(values.userid)){
        result.error = true;
        result.field.push('userid');
        result.issue.push('The userid is not acceptable!')
    }
    return result.error? result : values;
}

//USER-POST INPUT REVISE

module.exports.postInputRevise = (dedicatedID, postContent)=>{
    const values = {
        dedicatedID,
        postContent
    }
    const result = {
        error: false, field: [], issue: []
    }
    if(isThereProblemWithOptionalDBKey(values.dedicatedID)){
        result.error = true;
        result.field.push('dedication')
        result.issue.push('The userid is not acceptable!')
    }
    if(isThereProblemWithContent(values.postContent)){
        result.error = true;
        result.field.push('postContent')
        result.issue.push('The post content is not acceptable!')
    }
    return result.error? result : values
}
module.exports.postUpdateInputRevise = (postID, newContent, dedicatedID )=>{
    const values = {
        postID,
        newContent,
        dedicatedID
    }
    const result = {
        error: false, field: [], issue: []
    }
    if(isThereProblemWithDBKey(values.postID)){
        result.error = true;
        result.field.push('postid')
        result.issue.push('The postid is not acceptable!')
    }
    if(isThereProblemWithOptionalDBKey(values.dedicatedID)){
        result.error = true;
        result.field.push('newDedication')
        result.issue.push('The userid is not acceptable!')
    }
    if(isThereProblemWithContent(values.newContent)){
        result.error = true;
        result.field.push('postContent')
        result.issue.push('The post content is not acceptable!')
    }
    return result.error? result : values

}
module.exports.postDeleteInputRevise = (postID)=>{
    const values = { postID }
    const result = { error: false, field: [], issue: [] }

    if(isThereProblemWithDBKey(values.postID)){
        result.error = true;
        result.field.push('postid')
        result.issue.push('The postid is not acceptable!')
    }
    return result.error? result : values
}

//OPINION INPUT REVISION

module.exports.commentQueryInputRevise = (targetingTxt, targetID)=>{
    const values = { targetingTxt, targetID }
    const result = { error: false, field: [], issue: [] }

    if(isThereProblemWithTargetTxt(values.targetingTxt)){
        result.error = true;
        result.field.push('targetType')
        result.issue.push('The targetType is not acceptable!')
    }
    if(isThereProblemWithDBKey(values.targetID)){
        result.error = true;
        result.field.push('targetId')
        result.issue.push('The targetId is not acceptable!')
    }
    return result.error? result : values
}

module.exports.commentCreateInputRevise =(targetingTxt, targetID, content)=>{
    const values = { targetingTxt, targetID, content }
    const result = { error: false, field: [], issue: [] }

    if(isThereProblemWithTargetTxt(values.targetingTxt)){
        result.error = true;
        result.field.push('targetType')
        result.issue.push('The targetType is not acceptable!')
    }
    if(isThereProblemWithDBKey(values.targetID)){
        result.error = true;
        result.field.push('targetId')
        result.issue.push('The targetId is not acceptable!')
    }
    if(isThereProblemWithContent(values.content)){
        result.error = true;
        result.field.push('content')
        result.issue.push('The content is not acceptable!')
    }
    return result.error? result : values
}
module.exports.sentimentCreateInputRevise =(targetingTxt, targetID, sentimCont)=>{
    const values = { targetingTxt, targetID, sentimCont }
    const result = { error: false, field: [], issue: [] }

    if(isThereProblemWithTargetTxt(values.targetingTxt)){
        result.error = true;
        result.field.push('targetType')
        result.issue.push('The targetType is not acceptable!')
    }
    if(isThereProblemWithDBKey(values.targetID)){
        result.error = true;
        result.field.push('targetId')
        result.issue.push('The targetId is not acceptable!')
    }
    if(isThereProblemWithSentimentTxt(values.sentimCont)){
        result.error = true;
        result.field.push('sentimContent')
        result.issue.push('The sentiment content is not acceptable!')
    }
    return result.error? result : values
}


module.exports.commentUpdtInputRevise = (commID, content )=>{
    const values = { commID, content }
    const result = { error: false, field: [], issue: [] }

    if(isThereProblemWithDBKey(values.commID)){
        result.error = true;
        result.field.push('commentId')
        result.issue.push('The commentId is not acceptable!')
    }
    if(isThereProblemWithContent(values.content)){
        result.error = true;
        result.field.push('content')
        result.issue.push('The content is not acceptable!')
    }
    return result.error? result : values
}
module.exports.sentimentUpdtInputRevise = (targetingTxt, targetID, sentimID, sentimCont)=>{
    const values = { targetingTxt, targetID, sentimID, sentimCont }
    const result = { error: false, field: [], issue: [] }

    if(isThereProblemWithTargetTxt(values.targetingTxt)){
        result.error = true;
        result.field.push('targetType')
        result.issue.push('The targetType is not acceptable!')
    }
    if(isThereProblemWithDBKey(values.targetID)){
        result.error = true;
        result.field.push('targetId')
        result.issue.push('The targetId is not acceptable!')
    }
    if(isThereProblemWithDBKey(values.sentimID)){
        result.error = true;
        result.field.push('sentimentId')
        result.issue.push('The sentimentId is not acceptable!')
    }
    if(isThereProblemWithSentimentTxt(values.sentimCont)){
        result.error = true;
        result.field.push('sentimContent')
        result.issue.push('The sentiment content is not acceptable!')
    }
    return result.error? result : values
}

module.exports.opinionDeleteInputRevise = (targetingTxt, targetID, ID,)=>{
    const values = { targetingTxt, targetID, ID }
    const result = { error: false, field: [], issue: [] }
    if(isThereProblemWithTargetTxt(values.targetingTxt)){
        result.error = true;
        result.field.push('targetType')
        result.issue.push('The targetType is not acceptable!')
    }
    if(isThereProblemWithDBKey(values.targetID)){
        result.error = true;
        result.field.push('targetId')
        result.issue.push('The targetId is not acceptable!')
    }
    if(isThereProblemWithDBKey(values.ID)){
        result.error = true;
        result.field.push('opinionId')
        result.issue.push('The opinionId is not acceptable!')
    }
    return result.error? result : values
}



//PASSWORD RESETTING - step 1 + step 3

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

module.exports.passwordRenewInputRevise = (pwdTxt1, pwdTxt2)=>{
    if(isThereProblemWithPassword(pwdTxt1)){
        return false
    }
    if(pwdTxt1 !== pwdTxt2){
        return false
    }
    return true
}



//VALUE EVALUATION HELPERS

function isThereProblemWithEmail(emailText){
    if(!emailText || typeof emailText !== 'string'){
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
    if(!pwdText || typeof pwdText !== 'string'){
        return true;
    }
    const pattern = '.{6,}';
    const analyzer = new RegExp(pattern)
    return !analyzer.test(pwdText)
}

function isThereProblemWithUsername(unameText){
    if(!unameText || typeof unameText !== 'string'){
        return true;
    }
    if(unameText.length > 50){
        return true
    } 
    const pattern = '[a-zA-Z0-9_ ]{4,}';
    const analyzer = new RegExp(pattern)
    return !analyzer.test(unameText)
}

function isThereProblemWithDBKey(key){
    if(!key || typeof key !== 'string'){
        return true
    }
    if(key.length !== 24){
        return true
    }
    const analyzer = new RegExp(/[a-f0-9]{24}/)
    return !analyzer.test(key)
}

function isThereProblemWithOptionalDBKey(key){
    if(!key || typeof key === 'undefined'){
        return false
    }
    return isThereProblemWithDBKey(key)
}
function isThereProblemWithContent(content){
    if(!content || typeof content !== 'string'){ 
        return true 
    }
    return content.length > 300 || content.length == 0
}

function isThereProblemWithTargetTxt(target){
    return (target !== 'POST' && target !== 'COMMENT' )
}

function isThereProblemWithSentimentTxt(target){
    const templates = [ 'LIKE', 'DISLIKE', 'LOVE', 'FUNNY', 'SAD', 'MAD']
    return !templates.includes(target)
}