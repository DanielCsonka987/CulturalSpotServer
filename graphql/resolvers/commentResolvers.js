const { AuthenticationError, UserInputError, ApolloError  } = require('apollo-server-express')
const MongooseID = require('mongoose').Types.ObjectId

const { authorizEvaluation } = require('./resolveHelpers')
const { commentQueryInputRevise, commentCreateInputRevise, commentUpdtInputRevise,
    opinionDeleteInputRevise } = require('../../utils/inputRevise')
const { notifyTypes } = require('../../extensions/dinamicClientNotifier/userNotifierUnit')

module.exports = {
    Query: {
        async listOfTheseComments(_, args, { authorizRes, dataSources }){
            authorizEvaluation(authorizRes)

            const { error, field, issue, targetingTxt, targetID}
                = commentQueryInputRevise(args.targeted, args.id)
            if(error){
                return new UserInputError('No proper commenting query inputs!', { field, issue })
            }
            let commentIDs = []
            let commentObjArray = []
            try{
                if(targetingTxt === 'POST'){
                    const targetPost = await dataSources.posts.get(targetID)
                    if(!targetPost.comments){
                        return []
                    }
                    commentIDs = targetPost.comments
                }
                if(targetingTxt === 'COMMENT'){
                    const targetComment = await dataSources.comments.get(targetID)
                    if(!targetComment.comments){
                        return []
                    }
                    commentIDs = targetComment.comments
                }
    
                commentObjArray = await dataSources.comments.getAllOfThese(commentIDs)
            }catch(err){
                return new ApolloError('Comment fetching error', { err })
            }

            return commentObjArray.map(comUnit=>{
                return {
                    commentid: comUnit._id,
                    owner: comUnit.owner,
                    content: comUnit.content,
                    createdAt: comUnit.createdAt,
                    updatedAt: comUnit.updatedAt,

                    sentiments: comUnit.sentiments,
                    comments: comUnit.comments.length
                }
            })
        }
    },
    Mutation: {
        async createCommentToHere(_, args, { authorizRes, dataSources, wsNotifier }){
            authorizEvaluation(authorizRes)
            const { error, field, issue, targetingTxt, targetID, content } 
                = commentCreateInputRevise(args.targeted, args.id, args.content)
            if(error){
                return new UserInputError('No proper commenting inputs!', { field, issue })
            }
            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            if(!clientUser){
                return AuthenticationError('No user found', { general: 'No target of Token id' })
            }
            let newComment = null
            let notifyEventConfig = null
            try{
                if(targetingTxt === 'POST'){
                    const targetPost = await dataSources.posts.get(targetID)

                    newComment = await dataSources.comments.create({
                        owner: clientUser._id,
                        parentNode: targetPost._id,
                        rootPost: targetPost._id,
                        createdAt: new Date().toISOString(),
                        updatedAt: '',
                        content: content,
                        comments: [],
                        sentiments: []
                    })
                    targetPost.comments.push(newComment._id)
                    await dataSources.posts.saving(targetPost)
                    notifyEventConfig = notifyTypes.POST.COMMENT_CREATED
                }
                if(targetingTxt === 'COMMENT'){
                    const targetComment = await dataSources.comments.get(targetID)

                    newComment = await dataSources.comments.create({
                        owner: clientUser._id,
                        parentNode: targetComment._id,
                        rootPost: targetComment.rootPost,
                        createdAt: new Date().toISOString(),
                        updatedAt: '',
                        content: content,
                        comments: [],
                        sentiments: []
                    })
                    targetComment.comments.push(newComment._id)
                    await dataSources.comments.saving(targetComment)
                    notifyEventConfig = notifyTypes.COMMENT.COMMENT_CREATED
                }
            }catch(err){
                return new ApolloError('Comment creation error', { err })
            }
            if(!newComment){
                return new ApolloError('Comment creation error', { general: 'Unknown error' })
            }

            for(const frnd of clientUser.friends){
                wsNotifier.sendNotification(frnd.toString(), {
                    parent: newComment.parentNode,
                    root: newComment.rootPost
                }, {
                    commentid: newComment._id.toString(),
                    owner: newComment.owner,
                    content: newComment.content,
                    createdAt: newComment.createdAt,
                    updatedAt: newComment.updatedAt,
    
                    comments: 0,
                    sentiments: []
                }, notifyEventConfig )
            }

            return {
                commentid: newComment._id.toString(),
                owner: newComment.owner,
                content: newComment.content,
                createdAt: newComment.createdAt,
                updatedAt: newComment.updatedAt,

                comments: 0,
                sentiments: []
            }
            
        },        
        async updateCommentContent(_, args, { authorizRes, dataSources, wsNotifier }){

            authorizEvaluation(authorizRes)
            const { error, field, issue, commID, content} =
                commentUpdtInputRevise( args.commentid, args.content )

            if(error){
                return new UserInputError('No proper commenting inputs!', { field, issue })
            }
            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            if(!clientUser){
                return AuthenticationError('No user found', { general: 'No target of Token id' })
            }

            const commentToUpdate = await dataSources.comments.get(commID)
            if(!commentToUpdate){
                return new ApolloError('No comment is found at updating', 
                    { general: 'Input commentId is invalid'}
                )
            }
            if(!commentToUpdate.owner.equals(clientUser._id)){
                return AuthenticationError('No permission to update this comment', 
                    { general: `No proper ownership to comment ${commID}` }
                )
            }
            commentToUpdate.updatedAt = new Date().toISOString()
            commentToUpdate.content = content
            try{
                await dataSources.comments.saving(commentToUpdate)
            }catch(err){
                return new ApolloError('Comment updating error', { err })
            }
            
            for( const frnd of clientUser.friends){
                wsNotifier.sendNotification(frnd.toString(), {
                    parent: commentToUpdate.parentNode,
                    root: commentToUpdate.rootPost
                }, {
                    commentid: commentToUpdate._id.toString(),
                    content: commentToUpdate.content,
                    updatedAt: commentToUpdate.updatedAt,
                }, (commentToUpdate.parentNode.equals(commentToUpdate.rootPost))? 
                notifyTypes.POST.COMMENT_UPDATED : notifyTypes.COMMENT.COMMENT_UPDATED)
            }

            return {
                commentid: commentToUpdate._id.toString(),
                owner: commentToUpdate.owner,
                content: commentToUpdate.content,
                createdAt: commentToUpdate.createdAt,
                updatedAt: commentToUpdate.updatedAt,

                sentiments: commentToUpdate.sentiments,
                comments: commentToUpdate.comments.length
            }
            
        },
    
        async deleteThisComment(_, args, { authorizRes, dataSources, wsNotifier }){
            authorizEvaluation(authorizRes)
            const { error, field, issue, targetingTxt, targetID, ID } 
                = opinionDeleteInputRevise(args.targeted, args.id, args.commentid)
            
            if(error){
                return new UserInputError('No proper opiion inputs!', { field, issue })
            }
            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            if(!clientUser){
                return AuthenticationError('No user found', { general: 'No target of Token id' })
            }
            const commentToDel = await dataSources.comments.get(ID)
            if(!commentToDel){
                return new ApolloError('No target is found to delete its comment', 
                    { general: `At ${targetingTxt.toLowerCase()} with id ${targetID}` }
                )
            }
            if(!commentToDel.owner.equals(clientUser._id)){
                return AuthenticationError('No permission to delete this comment', 
                    { general: `No proper ownership to comment ${ID}` }
                )
            }

            let targetObject = null
            if(targetingTxt === 'POST'){
                targetObject = await dataSources.posts.get(targetID)
            }
            if(targetingTxt === 'COMMENT'){
                targetObject = await dataSources.comments.get(targetID)
            }
            if(!targetObject){
                return new ApolloError('No target is found to delete a comment on that', 
                    { general: `No ${targetingTxt.toLowerCase()} with id ${targetID}` }
                )
            }
            targetObject.comments = targetObject.comments.filter(
                item=> { return item.toString() !== ID }
            )
            targetObject.updatedAt = new Date().toISOString()
            try{
                await dataSources.comments.recursiveRemovalOfThese([commentToDel._id])
                if(targetingTxt === 'POST'){
                    await dataSources.posts.saving(targetObject)
                }
                if(targetingTxt === 'COMMENT'){
                    await dataSources.comments.saving(targetObject)
                }
            }catch(err){
                return new ApolloError('Comment deletion error', { err })
            }
            
            for(const frnd of clientUser.friends){

                wsNotifier.sendNotification(frnd.toString(), {
                    root: commentToDel.rootPost, 
                    parent: targetID, 
                    parentUpdate: targetObject.updatedAt,
                }, {
                    id: ID
                }, notifyTypes.COMMENT.COMMENT_DELETED)
            }

            return {
                targetType: targetingTxt,
                targetId: targetID,
                targetUpdate: targetObject.updatedAt,
                id: ID,
                resultText: 'Comment deletion done!'
            }
        }
    
    }
}