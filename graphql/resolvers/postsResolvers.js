
const PostModel = require('../../models/PostModel')


module.exports = {
    Query: {
        listOfAllPosts: ()=>{

        },
        listOfRecievedPosts: ()=>{

        },
        listOfSentPosts: ()=>{

        }
    },
    Mutation: {
        makeAPost: (_, args, context)=>{
            args.content
            args.adressee
        },
        removeThisPost: (_, args, context)=>{
            args.postid
        },
        commentThisPost: (_, args, context)=>{
            args.postid
            args.content
        },
        updateThisPost: (_, args, context)=>{
            args.postid
            args.newcontent
            args.newadressee
        },
        updateThisComment: (_, args, context)=>{
            args.commentid
            args.newcontent
        },


        sentimentThisPost: (_, args, context)=>{
            args.postid
            args.sentiment
        },
        sentimentThisComment: (_, args, context)=>{
            args.commentid
            args.sentiment
        },
        sentimentRemoval: ()=>{

        }
    }
}