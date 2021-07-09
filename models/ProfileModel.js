const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    email: String,
    pwdHash: String,
    username: String,
    registeredAt: String
})

module.exports = mongoose.model('profiles', ProfileSchema)