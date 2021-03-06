const { TOKEN_PREFIX } = require('../config/appConfig')


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



//USER-POST AND COMMENTS COMMON INPUT REVISE

module.exports.postOrCommentFilteringInputRevise = (date, amount)=>{
    const values = {  }
    const result = {  error: false, field: [], issue: [] }
    if(itThereProblemWithDate(date)){
        result.error = true
        result.field.push('date')
        result.issue.push('The date is not acceptable!')
    }else{
        if(date){ values.date = new Date(date) }
    }
    if(isThereProblemWithOffsetAmount(amount)){
        result.error = true
        result.field.push('amount')
        result.issue.push('The amount is not acceptable!')
    }else{
        values.amount = amount
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





// CHATROOM AND MESSAGES REVISION


module.exports.chatMessagesQueryInputRevise = (chatid, date, amount)=>{
    const values = { chatid }
    const result = { error: false, field: [], issue: [] }

    if(isThereProblemWithDBKey(values.chatid)){
        result.error = true
        result.field.push('chatid')
        result.issue.push('The chatid is not acceptable!')
    }
    if(itThereProblemWithDate(date)){
        result.error = true
        result.field.push('date')
        result.issue.push('The date is not acceptable!')
    }else{
        if(date){ values.date = new Date(date) }
    }
    if(isThereProblemWithOffsetAmount(amount)){
        result.error = true
        result.field.push('amount')
        result.issue.push('The amount is not acceptable!')
    }else{
        values.amount = amount
    }
    return result.error? result : values
}

module.exports.chatRoomCreateInputRevise = (partners, title, content)=>{
    const values = { partners, title, content }
    const result = { error: false, field: [], issue: [] }

    if(isThereProblemWithArray(values.partners)){
        result.error = true;
        result.field.push('partners')
        result.issue.push('No partners were passed!')
    }else{
        if(isThereProblemWithPartnersArray(values.partners)){
            result.error = true;
            result.field.push('partners')
            result.issue.push('The partners array have not proper friendid!')
        }
    }
    if(isThereProblemWithChatTitle(values.title)){
        result.error = true;
        result.field.push('title')
        result.issue.push('The title of chatroom is not acceptable!')
    }
    if(isThereProblemWithMessage(values.content)){
        result.error = true;
        result.field.push('message')
        result.issue.push('The message to the chatroom is not acceptable!')
    }
    return result.error? result : values
}
module.exports.chatRoomAddRemovePartnersInputRevise = (chatid, partners)=>{
    const values = { chatid, partners }
    const result = { error: false, field: [], issue: [] }
    if(isThereProblemWithDBKey(values.chatid)){
        result.error = true
        result.field.push('chatid')
        result.issue.push('The chatid is not acceptable!')
    }
    if(isThereProblemWithArray(values.partners)){
        result.error = true;
        result.field.push('partners')
        result.issue.push('The partners is not an array!')
    }else{
        if(isThereProblemWithPartnersArray(values.partners)){
            result.error = true;
            result.field.push('partners')
            result.issue.push('The partners array have not proper friendid!')
        }
    }
    return result.error? result : values
}
module.exports.chatRoomUpdateInputRevise = (chatid, title)=>{
    const values = { chatid, title }
    const result = { error: false, field: [], issue: [] }
    if(isThereProblemWithDBKey(values.chatid)){
        result.error = true
        result.field.push('chatid')
        result.issue.push('The chatid is not acceptable!')
    }
    if(isThereProblemWithChatTitle(values.title)){
        result.error = true;
        result.field.push('title')
        result.issue.push('The title of chatroom is not acceptable!')
    }
    return result.error? result : values
}
module.exports.chatRoomDelteInputRevise = (chatid)=>{
    const values = { chatid }
    const result = { error: false, field: [], issue: [] }
    if(isThereProblemWithDBKey(values.chatid)){
        result.error = true
        result.field.push('chatid')
        result.issue.push('The chatid is not acceptable!')
    }
    return result.error? result : values
}

module.exports.sendMessageInputRevise = (chatid, message)=>{
    const values = { chatid, message }
    const result = { error: false, field: [], issue: [] }
    if(isThereProblemWithDBKey(values.chatid)){
        result.error = true
        result.field.push('chatid')
        result.issue.push('The chatid is not acceptable!')
    }
    if(isThereProblemWithMessage(values.message)){
        result.error = true;
        result.field.push('message')
        result.issue.push('The message to the chatroom is not acceptable!')
    }
    return result.error? result : values
}
module.exports.updateMessageInputRvise = (messageid, message)=>{
    const values = { messageid, message }
    const result = { error: false, field: [], issue: [] }
    if(isThereProblemWithDBKey(values.messageid)){
        result.error = true
        result.field.push('messageid')
        result.issue.push('The messageid is not acceptable!')
    }
    if(isThereProblemWithMessage(values.message)){
        result.error = true;
        result.field.push('message')
        result.issue.push('The message to the chatroom is not acceptable!')
    }
    return result.error? result : values
}
module.exports.deleteMessageInputRevise = (messageid)=>{
    const values = { messageid }
    const result = { error: false, field: [], issue: [] }
    if(isThereProblemWithDBKey(values.messageid)){
        result.error = true
        result.field.push('messageid')
        result.issue.push('The messageid is not acceptable!')
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






//TOKEN CONNECTED INPUTS

module.exports.authorizationHeaderExist = (request)=>{
    if(!request){ return false }
    if(!request.headers){ return false; }
    if(!request.headers.authorization){  return false;  }
    return true
}

module.exports.refreshingHeaderExist = (request)=>{
    if(!request){ return false }
    if(!request.headers){ return false; }
    if(!request.headers.refreshing){  return false;  }
    return true
}

module.exports.resettingHeaderExist = (request)=>{
    if(!request){ return false }
    if(!request.headers){ return false; }
    if(!request.headers.resetting){  return false;  }
    return true
}

module.exports.isolateBearerFromHeader = (headerFullTxt)=>{
    if(typeof headerFullTxt !== 'string'){
        return false
    }
    const tokenText = headerFullTxt.split(TOKEN_PREFIX)[1]
    if(!tokenText){
        return false
    }
    return tokenText
}

module.exports.isolateTokenFromURL = (urlText)=>{
    if(typeof urlText !== 'string' ){
        return false
    }
    const tokenText = urlText.split(/\//)[1]
    if(!tokenText){
        return false
    }
    return tokenText
}

module.exports.tokenNormalSchemasFaulty = (theTokenText)=>{
    return !(theTokenText.split('.').length === 3)
}

module.exports.tokenSpecRevAndSplitting = (theTokenText)=>{
    const fourPartedArray = theTokenText.split('.')
    if(fourPartedArray.length !== 4){
        return false
    }
    if(fourPartedArray.includes('')){
        return false
    }
    return fourPartedArray
}

module.exports.isThisUserIDMayBeFaulty = (userID)=>{
    return isThereProblemWithDBKey(userID)
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
    return (target !== 'POST' && target !== 'COMMENT' && target !== 'MESSAGE' )
}

function isThereProblemWithSentimentTxt(target){
    const templates = [ 'LIKE', 'DISLIKE', 'LOVE', 'FUNNY', 'SAD', 'MAD']
    return !templates.includes(target)
}

function isThereProblemWithArray(target){
    if(Array.isArray(target)){
        return target.length === 0
    }
    return true
}

function isThereProblemWithPartnersArray(target){
    for(const item of target){
        if(isThereProblemWithDBKey(item)){ return true }
    }
    return false
}

function isThereProblemWithChatTitle(target){
    if(!target || typeof target !== 'string'){ 
        return true 
    }
    return target.length > 70 || target.length == 0
}

function isThereProblemWithMessage(target){
    if(!target || typeof target !== 'string'){ 
        return true 
    }
    return target.length > 150 || target.length == 0
}

function itThereProblemWithDate(target){
    if(!target) { return false }
    if(typeof target !== 'string'){ return true }
    if(target.length !== 24) { return true }
    if(!target.endsWith('000Z')) { return true}
    // based on normal ISOString format - 2021-02-03T13:37:00.000Z
    const analyze = new RegExp(/[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}\:[0-9]{2}\:[0-9]{2}\.000Z/)
    return !analyze.test(target)

}

function isThereProblemWithOffsetAmount(target){
    if(target === undefined || target === null){ return false }
    if(typeof target !== 'number'){ return true }
    return !(target > 0 && target < 100)
}