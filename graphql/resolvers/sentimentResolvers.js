const { AuthenticationError, UserInputError, ApolloError  } = require('apollo-server-express')
const MongooseID = require('mongoose').Types.ObjectId

const { authorizEvaluation } = require('./resolveHelpers')
const { sentimentCreateInputRevise, sentimentUpdtInputRevise,  opinionDeleteInputRevise } 
    = require('../../utils/inputRevise')
const { notifyTypes } = require('../../extensions/dinamicClientNotifier/userNotifierUnit')

module.exports = {
    Query: {

    },
    Mutation: {      
        async createSentimentToHere(_, args, { authorizRes, dataSources, wsNotifier }){
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
            let targetObject = null
            const newSentim = {
                _id: new MongooseID(),
                owner: clientUser._id,
                createdAt: new Date().toISOString(),
                updatedAt: '',
                content: sentimCont
            }
            try{
                if(targetingTxt === 'POST'){
                    targetObject = await dataSources.posts.get(targetID)
                    targetObject.sentiments.push(newSentim)
                    await dataSources.posts.saving(targetObject)
                }
                if(targetingTxt === 'COMMENT'){
                    targetObject = await dataSources.comments.get(targetID)
                    targetObject.sentiments.push(newSentim)
                    await dataSources.comments.saving(targetObject)
                }
            }catch(err){
                return new ApolloError('Sentiment creation error', { err })
            }

            const rootVal = (targetingTxt === 'POST')? '' : targetObject.rootPost
            const notifyEventConfig = (targetingTxt === 'POST')? 
                notifyTypes.POST.OPINION_ADDED : notifyTypes.COMMENT.OPINION_ADDED
            for(const frnd of clientUser.friends){

                wsNotifier.sendNotification(frnd.toString(), {
                    parent: targetObject._id,
                    root: rootVal,
                    parentUpdate: newSentim.createdAt
                },{
                    sentimentid: newSentim._id.toString(),
                    owner: newSentim.owner,
                    content: newSentim.content,
                    createdAt: newSentim.createdAt,
                    updatedAt: newSentim.updatedAt
                }, notifyEventConfig)
            }

            return {
                sentimentid: newSentim._id.toString(),
                owner: newSentim.owner,
                content: newSentim.content,
                createdAt: newSentim.createdAt,
                updatedAt: newSentim.updatedAt
            }
        },
        async updateSentimentContent(_, args, { authorizRes, dataSources, wsNotifier }){
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

            const rootVal = (targetingTxt === 'POST')? '' : targetObject.rootPost
            const notifyEventConfig = (targetingTxt === 'POST')? 
                notifyTypes.POST.OPINION_UPDATED : notifyTypes.COMMENT.OPINION_UPDATED
            for(const frnd of clientUser.friends){
                wsNotifier.sendNotification(frnd.toString(), {
                    parent: targetObject._id,
                    root: rootVal,
                    parentUpdate: sentimToUpdate.updatedAt
                },{
                    sentimentid: sentimToUpdate._id.toString(),
                    owner: sentimToUpdate.owner,
                    content: sentimToUpdate.content,
                    createdAt: sentimToUpdate.createdAt,
                    updatedAt: sentimToUpdate.updatedAt
                }, notifyEventConfig)
            }

            return{
                sentimentid: sentimToUpdate._id.toString(),
                owner: sentimToUpdate.owner,
                content: sentimToUpdate.content,
                createdAt: sentimToUpdate.createdAt,
                updatedAt: sentimToUpdate.updatedAt
            }
        },
        async deleteThisSentiment(_, args, { authorizRes, dataSources, wsNotifier }){
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
            let notifyEventConfig = null
            try{
                if(targetingTxt === 'POST'){
                    await dataSources.posts.saving(targetObject)
                    notifyEventConfig = notifyTypes.POST.OPINION_REMOVED
                }
                if(targetingTxt === 'COMMENT'){
                    await dataSources.comments.saving(targetObject)
                    notifyEventConfig = notifyTypes.COMMENT.OPINION_REMOVED
                }
            }catch(err){
                return new ApolloError('Sentiment deletion error', { err })
            }

            const rootVal = (targetingTxt === 'POST')? '' : targetObject.rootPost.toString()
            for(const frnd of clientUser.friends){

                wsNotifier.sendNotification(frnd.toString(), {
                    parent: targetObject._id.toString(),
                    root: rootVal,
                    parentUpdate: targetObject.updatedAt
                },{
                    id: ID
                },notifyEventConfig)
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