const mongoose = require('mongoose')

const CommentDatingSchema = new mongoose.Schema({
    commentid: { type: mongoose.Schema.Types.ObjectId, index: true },
    createdAt: Date
})
CommentDatingSchema.index({ commentid: 1 })

module.exports = CommentDatingSchema