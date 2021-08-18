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
    myComments: [mongoose.Schema.Types.ObjectId],
    friends: [mongoose.Schema.Types.ObjectId],
    initiatedCon: [mongoose.Schema.Types.ObjectId],
    undecidedCon: [mongoose.Schema.Types.ObjectId]
})

module.exports = mongoose.model('profiles', ProfileSchema)