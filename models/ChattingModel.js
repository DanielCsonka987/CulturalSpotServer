const mongoose = require('mongoose')


const MessageSchema = new mongoose.Schema({
    id: Number,
    sentAt: String,
    from: mongoose.Types.ObjectId,
    message: String
})

const ChatSchema = new mongoose.Schema({
    owner: mongoose.Types.ObjectId,
    startedAt: String,
    partners: [
        mongoose.Types.ObjectId,
    ],
    content: [ MessageSchema ]
})
module.exports = mongoose.model('chattings', ChatSchema)