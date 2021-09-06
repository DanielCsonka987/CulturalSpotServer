const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema({
    owner: mongoose.Types.ObjectId,
    startedAt: Date,
    title: String,
    partners: [ mongoose.Schema.Types.ObjectId ]
})
module.exports = mongoose.model('chattings', ChatSchema)