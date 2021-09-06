const mongoose = require('mongoose')
const SentimentSchema = require('./SentimentSchema')

const MessageSchema = new mongoose.Schema({
    chatid: mongoose.Schema.Types.ObjectId,
    sentAt: Date,
    owner: mongoose.Schema.Types.ObjectId,

    content: String,
    prevMsg: mongoose.Schema.Types.ObjectId,
    nextMsg: mongoose.Schema.Types.ObjectId,
    sentiments: [ SentimentSchema ]
})

module.exports = mongoose.model('messages', MessageSchema)