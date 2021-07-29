const mongoose = require('mongoose')

const SentimentSchema = new mongoose.Schema({
    id: Number,
    owner: mongoose.Schema.Types.ObjectId,
    content: String
})

module.exports = SentimentSchema