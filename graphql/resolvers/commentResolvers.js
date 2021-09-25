const { AuthenticationError, UserInputError, ApolloError  } = require('apollo-server-express')
const MongooseID = require('mongoose').Types.ObjectId

const { authorizEvaluation, filterCommentByDateAmount_Stamps } = require('./resolveHelpers')
const { commentQueryInputRevise, commentCreateInputRevise, commentUpdtInputRevise,
    opinionDeleteInputRevise, postOrCommentFilteringInputRevise } = require('../../utils/inputRevise')
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

            const filters = postOrCommentFilteringInputRevise(args.dating, args.amount)
            if(filters.error){
                return new UserInputError('No proper commenting query inputs!', 
                    { field: filters.field, issue: filters.issue }
                )
            }
            let commentStamps = []
            let commentObjArray = []
            try{
                if(targetingTxt === 'POST'){
                    const targetPost = await dataSources.posts.get(targetID)
                    if(!targetPost.comments){
                        return []
                    }
                    commentStamps = targetPost.comments
                }
                if(targetingTxt === 'COMMENT'){
                    const targetComment = await dataSources.comments.get(targetID)
                    if(!targetComment.comments){
                        return []
                    }
                    commentStamps = targetComment.comments
                }
                const finalCommentIDs = filterCommentByDateAmount_Stamps(commentStamps, 
                    filters.date, filters.amount)
                commentObjArray = await dataSources.comments.getAllOfThese(finalCommentIDs)
            }catch(err){
                return new ApolloError('Comment fetching error', { err })
            }

            return commentObjArray.map(comUnit=>{
                return comUnit.getCommentPublicDatas
                /*
                return {
                    commentid: comUnit._id,
                    owner: comUnit.owner,
                    content: comUnit.content,
                    createdAt: comUnit.createdAt,
                    updatedAt: comUnit.updatedAt,

                    sentiments: comUnit.sentiments,
                    comments: comUnit.comments
                }*/
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
                const commentDate = new Date()
                if(targetingTxt === 'POST'){
                    const targetPost = await dataSources.posts.get(targetID)

                    newComment = await dataSources.comments.create({
                        owner: clientUser._id,
                        parentNode: targetPost._id,
                        rootPost: targetPost._id,
                        createdAt: commentDate,
                        updatedAt: null,
                        content: content,
                        comments: [],
                        sentiments: []
                    })
                    targetPost.comments.push({
                        commentid: newComment._id, createdAt: commentDate
                    })
                    await dataSources.posts.saving(targetPost)
                    notifyEventConfig = notifyTypes.POST.COMMENT_CREATED
                }
                if(targetingTxt === 'COMMENT'){
                    const targetComment = await dataSources.comments.get(targetID)

                    newComment = await dataSources.comments.create({
                        owner: clientUser._id,
                        parentNode: targetComment._id,
                        rootPost: targetComment.rootPost,
                        createdAt: commentDate,
                        updatedAt: null,
                        content: content,
                        comments: [],
                        sentiments: []
                    })
                    targetComment.comments.push({ 
                        commentid: newComment._id, createdAt: commentDate
                    })
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
                wsNotifier.sendNotification(frnd.toString(), 
                    newComment.getConnectionDatas
                /*{
                    parent: newComment.parentNode,
                    root: newComment.rootPost
                }*/, newComment.getCommentPublicDatas
                
                /*{
                    commentid: newComment._id.toString(),
                    owner: newComment.owner,
                    content: newComment.content,
                    createdAt: newComment.createdAt,
                    updatedAt: '',
    
                    comments: [],
                    sentiments: []
                }*/, notifyEventConfig )
            }

            return newComment.getCommentPublicDatas
            /*
            return {
                commentid: newComment._id.toString(),
                owner: newComment.owner,
                content: newComment.content,
                createdAt: newComment.createdAt,
                updatedAt: '',

                comments: [],
                sentiments: []
            }*/
            
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
            commentToUpdate.updatedAt = new Date()
            commentToUpdate.content = content
            try{
                await dataSources.comments.saving(commentToUpdate)
            }catch(err){
                return new ApolloError('Comment updating error', { err })
            }

            const updateStr = commentToUpdate.updatedAt.toISOString()
            for( const frnd of clientUser.friends){
                wsNotifier.sendNotification(frnd.toString(), commentToUpdate.getConnectionDatas,
                    commentToUpdate.getCommentUpdatedDatas
                /*
                {
                    parent: commentToUpdate.parentNode,
                    root: commentToUpdate.rootPost
                }, {
                    commentid: commentToUpdate._id.toString(),
                    content: commentToUpdate.content,
                    updatedAt: updateStr,
                }*/, commentToUpdate.isItConnectingToAPost()? 
                notifyTypes.POST.COMMENT_UPDATED : notifyTypes.COMMENT.COMMENT_UPDATED)
            }
            return commentToUpdate.getCommentPublicDatas
            /*
            return {
                commentid: commentToUpdate._id.toString(),
                owner: commentToUpdate.owner,
                content: commentToUpdate.content,
                createdAt: commentToUpdate.createdAt,
                updatedAt: updateStr,

                sentiments: commentToUpdate.sentiments,
                comments: commentToUpdate.comments
            }
            */
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
            if(!commentToDel.isThisTheOwner(clientUser._id)){
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
            targetObject.removeThisCommentStamp(ID)
            targetObject.updatedAt = new Date()
            try{
                await dataSources.comments.recursiveRemovalOfThese(commentToDel._id)
                if(targetingTxt === 'POST'){
                    await dataSources.posts.saving(targetObject)
                }
                if(targetingTxt === 'COMMENT'){
                    await dataSources.comments.saving(targetObject)
                }
            }catch(err){
                return new ApolloError('Comment deletion error', { error: err.message })
            }
            
            const updateStr = targetObject.updatedAt? 
                targetObject.updatedAt : ''
            for(const frnd of clientUser.friends){

                wsNotifier.sendNotification(frnd.toString(), {
                    root: commentToDel.rootPost, 
                    parent: targetID, 
                    parentUpdate: updateStr,
                    commentid: ID
                }, '', notifyTypes.COMMENT.COMMENT_DELETED)
            }

            return {
                targetType: targetingTxt,
                targetId: targetID,
                targetUpdate: updateStr,
                id: ID,
                resultText: 'Comment deletion done!'
            }
        }
    
    }
}