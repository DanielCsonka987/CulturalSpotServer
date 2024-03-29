const { AuthenticationError, ApolloError } = require('apollo-server-express')
const mongooseId = require('mongoose').Types.ObjectId;

const { isThisUserIDMayBeFaulty } = require('../../utils/inputRevise')
const { resetTokenValidate } = require('../../utils/tokenManager')
/**
 * for the authorization the token consist 
 * -> subj (user identification), exp (timelimit to use)
*/
module.exports.authorizEvaluation = (authorizRes)=>{
    let reasonOfFail = ''
    if(!authorizRes.accesPermission){
        if(authorizRes.error){
            reasonOfFail = 'Token process error!';
        }
        if(authorizRes.isExpired){
            reasonOfFail = 'Expired token!';
        }
        reasonOfFail = 'Missing token!';
    }
    if(reasonOfFail){
        throw new AuthenticationError('Login to use the service!', { general: reasonOfFail })
    } 
    return;
}

/**
 * for the authorization the token consist 
 * -> id (user identification), no exp field!!
 * => no user of authorizRes and authorazEvaluation() with this!
 * => tokenInputRevise() no valid either (its for header revision)
*/
module.exports.tokenRefreshmentEvaluation = (refreshAuthRes)=>{
    let reasonOfFail = ''
    if(!refreshAuthRes.refreshingPermission){
        if(refreshAuthRes.error){
            reasonOfFail = 'Token process error!';
        }
        reasonOfFail = 'Missing token!';
    }
    if(reasonOfFail){
        throw new AuthenticationError('Token renewal failed! Please, login again!', { general: reasonOfFail })
    } 
}

module.exports.resetTokenEvaluation = async (resetTokenRes, dataSources)=>{
    if(resetTokenRes.tokenMissing){
        throw new AuthenticationError('No permission to reset the password!')
    }
    if(isThisUserIDMayBeFaulty(resetTokenRes.takenUserid)){
        throw new AuthenticationError('No proper user identification!')
    }
    const clientUser = await dataSources.profiles.get(resetTokenRes.takenUserid)

    if(!clientUser.resetPwdMarker) { 
        throw new AuthenticationError('No permission to reset the password!') 
    }
    const tokenChargo = await resetTokenValidate(
        resetTokenRes, clientUser.resetPwdMarker, clientUser.pwdHash
    )
    if(tokenChargo.error){ 
        throw new AuthenticationError('Verification error!') 
    }
    if(tokenChargo.isExpired ){ 
        throw new AuthenticationError('Too old reset request!')
    }
    if(!tokenChargo.passResetPermission){ 
        throw new AuthenticationError('Too old reset request!') 
    }else{
        return { ...tokenChargo, userid: resetTokenRes.takenUserid }
    }
}

module.exports.countTheAmountOfFriends = async (userUnderProc, userClientToCompare, dataSources)=>{
    const userToCompare = (typeof userUnderProc === 'object')? 
        userUnderProc : new mongooseId(userUnderProc)

    if(userToCompare.equals(userClientToCompare._id)){
        return userClientToCompare.friends.length
    }
    if(!Array.isArray(userClientToCompare.friends)){
        return 0
    }
    const accountUnderAnalyze = await dataSources.profiles.get(userToCompare)
    if(!accountUnderAnalyze){
        throw new ApolloError('No user have found', 
        { general: 'countTheAmountOfFriends falied' })
    }
    const resultAmount = accountUnderAnalyze.friends.reduce((acc, cur)=>{
            if(userClientToCompare.friends.includes(cur._id)){
                return acc + 1;
            }
    }, 0)
    //in case of only if no friend at all -> the basaAccount id not counts in it
    if(!resultAmount) { return 0 }
    return resultAmount
}

module.exports.defineUserConnections = (userUnderProc,  userClientToCompare)=>{
    const userToCompare = (typeof userUnderProc === 'object')? 
        userUnderProc : new mongooseId(userUnderProc)
    
    //accepts only mongoose.Types.ObjectID as targetAccount !!!
    if(userToCompare.equals(userClientToCompare._id)){
        return 'ME'
    }
    if(Array.isArray(userClientToCompare.friends)){
        if(userClientToCompare.friends.includes(userToCompare)){
            return 'FRIEND'
        }
    }
    if(Array.isArray(userClientToCompare.myInvitations)){
        if(userClientToCompare.myInvitations.includes(userToCompare)){
            return 'INITIATED'
        }
    }
    if(Array.isArray(userClientToCompare.myFriendRequests)){
        if(userClientToCompare.myFriendRequests.includes(userToCompare)){
            return 'UNCERTAIN'
        }
    }
    return 'UNCONNECTED'
}

module.exports.getTheUsernameFromId = async (userUnderProc, dataSources)=>{
    const userToCompare = (typeof userUnderProc === 'object')? 
        userUnderProc : new mongooseId(userUnderProc)
    
    const profile = await dataSources.profiles.get(userToCompare)
    if(!profile){
        throw new ApolloError('No user have found', 
        { general: 'UsernameFromId falied to ' + userToCompare.toString() })
    }
    return profile.username
}



function comparePostComSentimAtSort(item1, item2){
    if( item1.createdAt < item2.createdAt ) { return 1 }  
    if( item1.createdAt > item2.createdAt ) { return -1}
    return 0
}

module.exports.filterPostsByDateAndAmount_Posts = function(posts, dating, amount){
    posts.sort(comparePostComSentimAtSort)

    let resultPosts = []
    if(dating){
        resultPosts = posts.filter(pst=>{
            if(pst.createdAt < dating) {  return pst  }
        })
    }else{
        resultPosts = posts
    }
    const needAmount = amount? amount : 15
    return resultPosts.slice(0, needAmount)
}

module.exports.filterPostsByDateAndAmount_Stamps = function(clienPosts, friendPostsGroup, 
    dating, amount){
    const allPostsStamp = clienPosts
    for(const frndPsts of friendPostsGroup){
        for(const pstIdent of frndPsts){
            allPostsStamp.push(pstIdent)
        }
    }
    allPostsStamp.sort(comparePostComSentimAtSort)
    let resultIDs = []
    if(dating){
        resultIDs = allPostsStamp.filter(pstIdent=> { 
            if(pstIdent.createdAt < dating){ return pstIdent } 
        })
        resultIDs = resultIDs.map(pstIdent=> pstIdent.postid)
    }else{
        resultIDs = allPostsStamp.map(pstIdent=> pstIdent.postid)
    }
    const needAmount = amount? amount : 15
    return resultIDs.slice(0, needAmount)
}

module.exports.filterCommentByDateAmount_Stamps = function(comentStaps, dating, amount){
    const sortedContent = comentStaps.sort(comparePostComSentimAtSort)
    let resultIDs = []
    if(dating){
        resultIDs = sortedContent.filter(cmmnt=> { 
            if(cmmnt.createdAt < dating){ return cmmnt } 
        })
        resultIDs = resultIDs.map(cmmnt=> cmmnt.commentid)
    }else{
        resultIDs = sortedContent.map(cmmnt=> cmmnt.commentid)
    }
    const needAmount = amount? amount : 5
    return resultIDs.slice(0, needAmount)
}