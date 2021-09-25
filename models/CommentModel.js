const mongoose = require('mongoose')

const SentimentSchema = require('./SentimentSchema')
const CommentDatingSchema = require('./CommentDatingSchema')//for easier filtering, DB spearing

const CommentSchema = new mongoose.Schema({
    owner: mongoose.Schema.Types.ObjectId,
    content: String,
    createdAt: Date,
    updatedAt: Date,
    parentNode: mongoose.Schema.Types.ObjectId,   //doubleLinked upward pointer
    rootPost: mongoose.Schema.Types.ObjectId,   
    comments: [CommentDatingSchema],        //doubleLinked downward pointer
    sentiments: [SentimentSchema]
})

CommentSchema.methods.isItConnectingToAPost = function(){
    return this.parentNode.equals(this.rootPost)
}

CommentSchema.methods.isThisTheOwner = function(userIDObj){
    return this.owner.equals(userIDObj)
}

CommentSchema.methods.removeThisCommentStamp = function(commentIDStr){
    this.comments = this.comments.filter(stamp =>{ 
        return stamp.commentid.toString() !== commentIDStr
    })
}


CommentSchema.virtual('getCommentPublicDatas').get(function(){
    return {
        commentid: this._id,
        owner: this.owner,
        content: this.content,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,

        comments: this.comments.length,
        sentiments: this.sentiments
    }
})
CommentSchema.virtual('getConnectionDatas').get(function(){
    return {
        parent: this.parentNode,
        root: this.rootPost
    }
})
CommentSchema.virtual('getCommentUpdatedDatas').get(function(){
    return {
        commentid: this._id,
        content: this.content,
        updatedAt: this.updatedAt,
    }
})

module.exports = mongoose.model('comments', CommentSchema)