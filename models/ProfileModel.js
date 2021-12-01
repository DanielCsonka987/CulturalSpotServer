const mongoose = require('mongoose')

const PostDatingSchema = new mongoose.Schema({
    postid: { type: mongoose.Schema.Types.ObjectId, index: true },
    createdAt: Date
})
PostDatingSchema.index({ postid: 1 })

const ProfileSchema = new mongoose.Schema({
    email: { type: String, index: true },
    pwdHash: String,
    username: String,
    registeredAt: Date,
    lastLoggedAt: Date,
    resetPwdMarker: String,
    refreshToken: String,

    myPosts: [PostDatingSchema],    //for easier filtering, DB spearing
    myChats: [mongoose.Schema.Types.ObjectId],
    friends: [mongoose.Schema.Types.ObjectId],
    myInvitations: [mongoose.Schema.Types.ObjectId],
    myFriendRequests: [mongoose.Schema.Types.ObjectId]
})
ProfileSchema.index({ email: 1 })


ProfileSchema.methods.haveThisFriend = function(frndID){
    return this.friends.includes(frndID)
}
ProfileSchema.methods.haveThisInvitation = function(wantedFrndID){
    return this.myInvitations.includes(wantedFrndID)
}
ProfileSchema.methods.haveThisRequest = function(mayFrndID){
    return this.myFriendRequests.includes(mayFrndID)
}
ProfileSchema.methods.haveThisPost = function(postIDObj){
    for(const postDef of this.myPosts){
        if(postDef.postid.equals(postIDObj)) { return true }
    }
    return false
}

ProfileSchema.methods.removeThisFriendInvite = function(userID){
    this.myInvitations = this.myInvitations.filter(item=>{
        return !item.equals(userID)
    })
}
ProfileSchema.methods.removeThisFriendRequest = function(userID){
    this.myFriendRequests = this.myFriendRequests.filter(item=>{
        return !item.equals(userID)
    })
}
ProfileSchema.methods.removeThisFriend = function(userID){
    this.friends = this.friends.filter(item=>{
        return !item.equals(userID)
    })
}
ProfileSchema.methods.removeThisPost = function(postIDObj){
    this.myPosts = this.myPosts.filter(
        post=>{ post.postid.toString() !== postIDObj }
    )
}

ProfileSchema.virtual('getUserMiniData').get(function(){
    return {
        userid: this._id,
        username: this.username,
        email: this.email
    }
})
ProfileSchema.virtual('getUserPrivateData').get(function(){
    return {
        id: this._id,
        email: this.email,
        username: this.username, 
        registeredAt: this.registeredAt.toISOString(),
        lastLoggedAt: this.lastLoggedAt.toISOString(),
        friends: this.friends,
        invitations: this.myInvitations.length,
        requests: this.myFriendRequests.length,
        posts: this.myPosts,
        chats: this.myChats
    }
})
ProfileSchema.methods.getUserLoginDatas = function(
    authToken, refreshToken, expireTimeSec, lastLoggedTime){
    return {
        id: this._id,
        email: this.email,
        username: this.username,
        token: authToken,
        tokenExpire: expireTimeSec,
        refreshToken: refreshToken,
        registeredAt: this.registeredAt.toISOString(),
        lastLoggedAt: lastLoggedTime?
            this.lastLoggedAt.toISOString() : '',

        friends: this.friends,
        invitations: this.myInvitations.length,
        requests: this.myFriendRequests.length,
        posts: this.myPosts,
        chats: this.myChats
    }
}



module.exports = mongoose.model('profiles', ProfileSchema)