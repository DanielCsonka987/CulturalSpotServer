const mongoose = require('mongoose')

const SentimentSchema = require('./SentimentSchema')

const PostSchema = new mongoose.Schema({
    owner: mongoose.Schema.Types.ObjectId,
    content: String,
    comments: [mongoose.Schema.Types.ObjectId],
    sentiments: [SentimentSchema]
})

module.exports = mongoose.model('posts', PostSchema)