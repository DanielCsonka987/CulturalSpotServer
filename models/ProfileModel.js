const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    email: String,
    pwdHash: String,
    username: String,
    registeredAt: String,
    lastLoggedAt: String,
    resetPwdMarker: String,
    refreshToken: String,

    myPosts: [mongoose.Schema.Types.ObjectId],
    friends: [mongoose.Schema.Types.ObjectId],
    myInvitations: [mongoose.Schema.Types.ObjectId],
    myFriendRequests: [mongoose.Schema.Types.ObjectId]
})

module.exports = mongoose.model('profiles', ProfileSchema)