const mongoose = require('mongoose')

const SentimentSchema = require('./SentimentSchema')
const CommentDatingSchema = require('./CommentDatingSchema')

const PostSchema = new mongoose.Schema({
    owner: mongoose.Schema.Types.ObjectId,
    dedicatedTo: mongoose.Schema.Types.ObjectId,
    content: String,
    createdAt: Date,
    updatedAt: Date,
    comments: [CommentDatingSchema],    //for easier filtering, DB spearing
    sentiments: [SentimentSchema]
})

PostSchema.methods.removeThisCommentStamp = function(commentIDStr){
    this.comments = this.comments.filter( stamp =>{ 
        return stamp.commentid.toString() !== commentIDStr
    })
}


PostSchema.virtual('getPostFullDatas').get(function(){
    return {
        postid: this._id,
        owner: this.owner,
        dedicatedTo: this.dedicatedTo,
        content: this.content,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt? this.updatedAt : '',
    
        sentiments: this.sentiments,
        comments: this.comments.length
    }
})
PostSchema.virtual('getPostUpdateDatas').get(function(){
    return {
        postid: this._id,
        owner: this.owner,
        dedicatedTo: this.dedicatedTo,
        content: this.content,
        updatedAt: this.updatedAt
    }
})
module.exports = mongoose.model('posts', PostSchema)