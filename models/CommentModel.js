const mongoose = require('mongoose')

const SentimentSchema = require('./SentimentSchema')

const CommentSchema = new mongoose.Schema({
    owner: mongoose.Schema.Types.ObjectId,
    content: String,
    createdAt: String,
    updatedAt: String,
    parentNode: mongoose.Schema.Types.ObjectId,
    rootPost: mongoose.Schema.Types.ObjectId,
    comments: [mongoose.Schema.Types.ObjectId],
    sentiments: [SentimentSchema]
})

module.exports = mongoose.model('comments', CommentSchema)