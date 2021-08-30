const { AuthenticationError, ApolloError } = require('apollo-server-express')
const mongooseId = require('mongoose').Types.ObjectId;

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