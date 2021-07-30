const { AuthenticationError } = require('apollo-server-express')

const ProfileModel = require('../../models/ProfileModel')

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

module.exports.countTheAmountOfFriends = async (useridOfTargetAcc, baseAccountWitFriendList)=>{
    if(useridOfTargetAcc === baseAccountWitFriendList._id){
        return baseAccountWitFriendList.friends.length
    }
    const accountUnderAnalyze = await ProfileModel.findOne({ _id: useridOfTargetAcc})
    const resultAmount = accountUnderAnalyze.friends.reduce((acc, cur)=>{
        if(baseAccountWitFriendList.friends.includes(cur._id)){
            return acc + 1;
        }
    }, 0)
    //in case of only if no friend at all -> the basaAccount id not counts in it
    if(!resultAmount) { return 0 }
    return resultAmount
}

module.exports.defineUserConnections = (useridOfTargetAcc,  baseAccountWitFriendList)=>{
    if(typeof useridOfTargetAcc === 'object'){       
        return (useridOfTargetAcc.equals(baseAccountWitFriendList._id))? 'ME' : 
                clientUser.friends.includes(item._id)? 'FRIEND': 'UNCONNECTED'
    }else{
        return (useridOfTargetAcc === baseAccountWitFriendList._id.toString())? 'ME' : 
            clientUser.friends.includes(item._id)? 'FRIEND': 'UNCONNECTED'
    }

    // finish it!!! get input from undecidedCon and initiatedCon fields!!!
}