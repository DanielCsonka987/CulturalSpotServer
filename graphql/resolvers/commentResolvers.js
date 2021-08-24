const { AuthenticationError, UserInputError, ApolloError  } = require('apollo-server-express')
const MongooseID = require('mongoose').Types.ObjectId

const { authorizEvaluation } = require('./resolveHelpers')
const { commentQueryInputRevise, commentCreateInputRevise, sentimentCreateInputRevise,
    commentUpdtInputRevise, sentimentUpdtInputRevise,  opinionDeleteInputRevise } 
    = require('../../utils/inputRevise')

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
        async createCommentToHere(_, args, { authorizRes, dataSources }){
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
            try{
                if(targetingTxt === 'POST'){
                    const targetObject = await dataSources.posts.get(targetID)

                    newComment = await dataSources.comments.create({
                        owner: clientUser._id,
                        createdAt: new Date().toISOString(),
                        updatedAt: '',
                        content: content,
                        comments: [],
                        sentiments: []
                    })
                    targetObject.comments.push(newComment._id)
                    await dataSources.posts.saving(targetObject)
                }
                if(targetingTxt === 'COMMENT'){
                    const targetObject = await dataSources.comments.get(targetID)

                    newComment = await dataSources.comments.create({
                        owner: clientUser._id,
                        createdAt: new Date().toISOString(),
                        updatedAt: '',
                        content: content,
                        comments: [],
                        sentiments: []
                    })
                    targetObject.comments.push(newComment._id)
                    await dataSources.comments.saving(targetObject)
                }
            }catch(err){
                return new ApolloError('Comment creation error', { err })
            }
            if(!newComment){
                return new ApolloError('Comment creation error', { general: 'Unknown error' })
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
        async createSentimentToHere(_, args, { authorizRes, dataSources }){
            authorizEvaluation(authorizRes)
            const { error, field, issue, targetingTxt, targetID, sentimCont } 
                = sentimentCreateInputRevise(args.targeted, args.id, args.content)
            if(error){
                return new UserInputError('No proper commenting inputs!', { field, issue })
            }
            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            if(!clientUser){
                return AuthenticationError('No user found', { general: 'No target of Token id' })
            }
            const newSentim = {
                _id: new MongooseID(),
                owner: clientUser._id,
                createdAt: new Date().toISOString(),
                updatedAt: '',
                content: sentimCont
            }
            try{
                if(targetingTxt === 'POST'){
                    const targetObject = await dataSources.posts.get(targetID)
                    targetObject.sentiments.push(newSentim)
                    await dataSources.posts.saving(targetObject)
                }
                if(targetingTxt === 'COMMENT'){
                    const targetObject = await dataSources.comments.get(targetID)
                    targetObject.sentiments.push(newSentim)
                    await dataSources.comments.saving(targetObject)
                }
            }catch(err){
                return new ApolloError('Sentiment creation error', { err })
            }

            return {
                sentimentid: newSentim._id.toString(),
                owner: newSentim.owner,
                content: newSentim.content,
                createdAt: newSentim.createdAt,
                updatedAt: newSentim.updatedAt
            }
        },
        async updateCommentContent(_, args, { authorizRes, dataSources }){

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
        async updateSentimentContent(_, args, { authorizRes, dataSources }){
            authorizEvaluation(authorizRes)
            const { error, field, issue, targetingTxt, targetID, sentimID, sentimCont } =
                sentimentUpdtInputRevise(args.targeted, args.id, args.sentimentid, args.content)

            if(error){
                return new UserInputError('No proper sentiment inputs!', { field, issue })
            }
            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            if(!clientUser){
                return AuthenticationError('No user found', { general: 'No target of Token id' })
            }

            let targetObject = null
            if(targetingTxt === 'POST'){
                targetObject = await dataSources.posts.get(targetID)
            }
            if(targetingTxt === 'COMMENT'){
                targetObject = await dataSources.comments.get(targetID)
            }
            if(!targetObject){
                return new ApolloError('No target is found to update its sentiment', 
                    { general: `No ${targetingTxt.toLowerCase()} with id ${targetID}` }
                )
            }
            
            const sentimToUpdate = targetObject.sentiments.filter(
                    item=>{ return item._id.toString() === sentimID }
                )[0]
            if(!sentimToUpdate){
                return new ApolloError('No sentiment is found to update that', 
                    { general: `No sentiment with id ${sentimID}` }
                )
            }
            if(!sentimToUpdate.owner.equals(clientUser._id)){
                return AuthenticationError('No permission to update this sentiment', 
                    { general: `No proper ownership to sentiment ${sentimID}` }
                )
            }

            sentimToUpdate.updatedAt = new Date().toISOString()
            sentimToUpdate.content = sentimCont
            try{
                if(targetingTxt === 'POST'){
                    await dataSources.posts.saving(targetObject)
                }
                if(targetingTxt === 'COMMENT'){
                    await dataSources.comments.saving(targetObject)
                }
            }catch(err){
                return new ApolloError('Sentiment creation error', { err })
            }


            return{
                sentimentid: sentimToUpdate._id.toString(),
                owner: sentimToUpdate.owner,
                content: sentimToUpdate.content,
                createdAt: sentimToUpdate.createdAt,
                updatedAt: sentimToUpdate.updatedAt
            }
        },
        async deleteThisComment(_, args, { authorizRes, dataSources }){
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
            
            return {
                targetType: targetingTxt,
                targetId: targetID,
                targetUpdate: targetObject.updatedAt,
                id: ID,
                resultText: 'Comment deletion done!'
            }
        },
        async deleteThisSentiment(_, args, { authorizRes, dataSources }){
            authorizEvaluation(authorizRes)
            const { error, field, issue, targetingTxt, targetID, ID } 
                = opinionDeleteInputRevise(args.targeted, args.id, args.sentimentid)
            
            if(error){
                return new UserInputError('No proper opiion inputs!', { field, issue })
            }
            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            if(!clientUser){
                return AuthenticationError('No user found', { general: 'No target of Token id' })
            }

            let targetObject = null
            if(targetingTxt === 'POST'){
                targetObject = await dataSources.posts.get(targetID)
            }
            if(targetingTxt === 'COMMENT'){
                targetObject = await dataSources.comments.get(targetID)
            }
            if(!targetObject){
                return new ApolloError('No target is found to delete a sentiment on that', 
                    { general: `No ${targetingTxt.toLowerCase()} with id ${targetID}` }
                )
            }

            const sentimToDel = targetObject.sentiments.filter(
                item=>{ return item._id.toString() === ID}
            )[0]
            if(!sentimToDel.owner.equals(clientUser._id)){
                return AuthenticationError('No permission to delete this sentiment', 
                    { general: `No proper ownership to sentiment ${ID}` }
                )
            }
            targetObject.sentiments = targetObject.sentiments.filter(
                item=>{ return item._id.toString() !== ID}
            )
            targetObject.updatedAt = new Date().toISOString()
            try{
                if(targetingTxt === 'POST'){
                    await dataSources.posts.saving(targetObject)
                }
                if(targetingTxt === 'COMMENT'){
                    await dataSources.comments.saving(targetObject)
                }
            }catch(err){
                return new ApolloError('Sentiment deletion error', { err })
            }

            return {
                targetType: targetingTxt,
                targetId: targetID,
                targetUpdate: targetObject.updatedAt,
                id: ID,
                resultText: 'Sentiment deletion done!'
            }
        }
    }
}