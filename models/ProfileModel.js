const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    email: String,
    pwdHash: String,
    username: String,
    registeredAt: String,
    lastLoggedAt: String,
    resetPwdToken: String,

    friends: [mongoose.Schema.Types.ObjectId]
})

module.exports = mongoose.model('profiles', ProfileSchema)