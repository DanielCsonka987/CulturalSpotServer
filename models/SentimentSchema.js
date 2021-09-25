const mongoose = require('mongoose')

const SentimentSchema = new mongoose.Schema({
    id: Number,
    owner: mongoose.Schema.Types.ObjectId,
    createdAt: Date,
    updatedAt: Date,
    content: String
})

module.exports = SentimentSchema