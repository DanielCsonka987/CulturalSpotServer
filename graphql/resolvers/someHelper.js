const { AuthenticationError } = require('apollo-server-express')
const mongooseId = require('mongoose').Types.ObjectId;

const ProfileModel = require('../../models/ProfileModel')

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
module.exports.tokenRefreshmentEvaluation = ()=>{
    let reasonOfFail = ''


    if(reasonOfFail){
        throw new AuthenticationError('Token renewal failed! Please, login again!', { general: reasonOfFail })
    } 
}

module.exports.countTheAmountOfFriends = async (useridAsBase, accountToCompare)=>{
    const useridBaseObj = (typeof useridAsBase === 'object')? 
        useridAsBase : new mongooseId(useridAsBase)

    if(useridBaseObj.equals(accountToCompare._id)){
        return accountToCompare.friends.length
    }
    const accountUnderAnalyze = await ProfileModel.findOne({ _id: useridBaseObj})
    const resultAmount = accountUnderAnalyze.friends.reduce((acc, cur)=>{
        if(accountToCompare.friends.includes(cur._id)){
            return acc + 1;
        }
    }, 0)
    //in case of only if no friend at all -> the basaAccount id not counts in it
    if(!resultAmount) { return 0 }
    return resultAmount
}

module.exports.defineUserConnections = (useridAsBase,  accountToCompare)=>{
    const useridBaseObj = (typeof useridAsBase === 'object')? 
        useridAsBase : new mongooseId(useridAsBase)
    
    //accepts only mongoose.Types.ObjectID as targetAccount !!!
    if(useridBaseObj.equals(accountToCompare._id)){
        return 'ME'
    }
    if(accountToCompare.friends.includes(useridBaseObj)){
        return 'FRIEND'
    }
    if(accountToCompare.initiatedCon.includes(useridBaseObj)){
        return 'INITIATED'
    }
    if(accountToCompare.undecidedCon.includes(useridBaseObj)){
        return 'UNCERTAIN'
    }
    return 'UNCONNECTED'
}

module.exports.getTheUsernameFromId = async (useridAsBase)=>{
    const useridBaseObj = (typeof useridAsBase === 'object')? 
        useridAsBase : new mongooseId(useridAsBase)
    
    const profile = await ProfileModel.findOne({ _id: useridBaseObj })
    return profile.username
}