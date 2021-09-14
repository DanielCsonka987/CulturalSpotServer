const { AuthenticationError, UserInputError, ApolloError, ForbiddenError  } = require('apollo-server-express')
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
            let targetToExtend = null
            let clientsToNotify  = []
            const routerObj = {}
            let notifyEventConfig = null

            const newSentim = {
                _id: new MongooseID(),
                owner: clientUser._id,
                createdAt: new Date().toISOString(),
                updatedAt: '',
                content: sentimCont
            }
            try{
                if(targetingTxt === 'POST'){
                    targetToExtend = await dataSources.posts.get(targetID)
                    targetToExtend.sentiments.push(newSentim)
                    await dataSources.posts.saving(targetToExtend)

                    clientsToNotify = clientUser.friends
                    routerObj.parent = targetToExtend._id
                    routerObj.root =  ''
                    notifyEventConfig = notifyTypes.POST.OPINION_ADDED 
                }
                if(targetingTxt === 'COMMENT'){
                    targetToExtend = await dataSources.comments.get(targetID)
                    targetToExtend.sentiments.push(newSentim)
                    await dataSources.comments.saving(targetToExtend)

                    clientsToNotify = clientUser.friends
                    routerObj.parent = targetToExtend._id
                    routerObj.root =  targetToExtend.rootPost
                    notifyEventConfig = notifyTypes.COMMENT.OPINION_ADDED
                }
                if(targetingTxt === 'MESSAGE'){
                    targetToExtend = await dataSources.messages.get(targetID)
                    targetToExtend.sentiments.push(newSentim)
                    await dataSources.messages.saving(targetToExtend)

                    const theChat= await dataSources.chats.get(targetToExtend.chatid)
                    const tempPartn = theChat.partners
                    tempPartn.push(theChat.owner)
                    clientsToNotify = tempPartn.filter(prtn=>{
                        return !prtn._id.equals(clientUser._id)
                    })

                    routerObj.messageid = targetToExtend._id
                    routerObj.chatid = targetToExtend.chatid
                    notifyEventConfig = notifyTypes.CHAT.OPINION_ADDED

                }
            }catch(err){
                return new ApolloError('Sentiment creation error', err )
            }

            for(const clnt of clientsToNotify){
                wsNotifier.sendNotification(clnt.toString(), routerObj ,{
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

            let targetToUpdate = null
            const routeObj = {}
            let notifyEventConfig = null
            let clientsToNotify = []
            if(targetingTxt === 'POST'){
                targetToUpdate = await dataSources.posts.get(targetID)
            }
            if(targetingTxt === 'COMMENT'){
                targetToUpdate = await dataSources.comments.get(targetID)
            }
            if(targetingTxt === 'MESSAGE'){
                targetToUpdate = await dataSources.messages.get(targetID)
            }
            if(!targetToUpdate){
                return new ApolloError('No target is found to update its sentiment', 
                    { general: `No ${targetingTxt.toLowerCase()} with id ${targetID}` }
                )
            }

            const sentimToUpdate = targetToUpdate.sentiments.filter(
                    item=>{ return item._id.toString() === sentimID }
                )[0]
            if(!sentimToUpdate){
                return new ApolloError('No sentiment is found to update that', 
                    { general: `No sentiment with id ${sentimID}` }
                )
            }
            if(!sentimToUpdate.owner.equals(clientUser._id)){
                return new ForbiddenError('Forbiddento update this sentiment', 
                    { general: `No proper ownership to sentiment ${sentimID}` }
                )
            }
            sentimToUpdate.updatedAt = new Date().toISOString()
            sentimToUpdate.content = sentimCont
            try{
                if(targetingTxt === 'POST'){
                    await dataSources.posts.saving(targetToUpdate)
                    clientsToNotify = clientUser.friends
                    routeObj.root = ''
                    routeObj.parent = targetToUpdate._id.toString()
                    routeObj.parentUpdate = sentimToUpdate.updatedAt
                    notifyEventConfig = notifyTypes.POST.OPINION_UPDATED
                }
                if(targetingTxt === 'COMMENT'){
                    await dataSources.comments.saving(targetToUpdate)
                    clientsToNotify = clientUser.friends
                    routeObj.root = targetToUpdate.rootPost.toString()
                    routeObj.parent = targetToUpdate._id.toString()
                    routeObj.parentUpdate = sentimToUpdate.updatedAt
                    notifyEventConfig = notifyTypes.COMMENT.OPINION_UPDATED
                }
                if(targetingTxt === 'MESSAGE'){
                    await dataSources.messages.saving(targetToUpdate)

                    const theChat = await dataSources.chats.get(targetToUpdate.chatid)
                    const tempPartn = theChat.partners
                    tempPartn.push(theChat.owner)
                    clientsToNotify = tempPartn.filter(prtn=>{
                        return !prtn._id.equals(clientUser._id)
                    })

                    routeObj.chatid = targetToUpdate.chatid.toString()
                    routeObj.messageid = targetToUpdate._id.toString()
                    routeObj.parentUpdate = sentimToUpdate.updatedAt
                    notifyEventConfig = notifyTypes.CHAT.OPINION_UPDATED
                }
            }catch(err){
                return new ApolloError('Sentiment creation error', { err })
            }

            for(const clnt of clientsToNotify){
                wsNotifier.sendNotification(clnt.toString(), routeObj, {
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
            let targetToTrim = null
            const routeObj = {}
            let notifyEventConfig = null
            let clientsToNotify = []
            if(targetingTxt === 'POST'){
                targetToTrim = await dataSources.posts.get(targetID)
            }
            if(targetingTxt === 'COMMENT'){
                targetToTrim = await dataSources.comments.get(targetID)
            }
            if(targetingTxt === 'MESSAGE'){
                targetToTrim = await dataSources.messages.get(targetID)
            }
            if(!targetToTrim){
                return new ApolloError('No target is found to delete a sentiment on that', 
                    { general: `No ${targetingTxt.toLowerCase()} with id ${targetID}` }
                )
            }

            const sentimToDel = targetToTrim.sentiments.filter(
                item=>{ return item._id.toString() === ID}
            )[0]
            if(!sentimToDel.owner.equals(clientUser._id)){
                return AuthenticationError('Forbidden the deletion of this sentiment', 
                    { general: `No proper ownership to sentiment ${ID}` }
                )
            }
            targetToTrim.sentiments = targetToTrim.sentiments.filter(
                item=>{ return item._id.toString() !== ID}
            )
            targetToTrim.updatedAt = new Date().toISOString()

            try{
                if(targetingTxt === 'POST'){
                    await dataSources.posts.saving(targetToTrim)
                    routeObj.root = ''
                    routeObj.parent = targetToTrim._id.toString()
                    routeObj.parentUpdate = targetToTrim.updatedAt
                    clientsToNotify = clientUser.friends
                    notifyEventConfig = notifyTypes.POST.OPINION_REMOVED
                }
                if(targetingTxt === 'COMMENT'){
                    await dataSources.comments.saving(targetToTrim)
                    routeObj.root = targetToTrim.rootPost.toString()
                    routeObj.parent = targetToTrim._id.toString()
                    routeObj.parentUpdate = targetToTrim.updatedAt
                    clientsToNotify = clientUser.friends
                    notifyEventConfig = notifyTypes.COMMENT.OPINION_REMOVED
                }
                if(targetingTxt === 'MESSAGE'){
                    await dataSources.messages.saving(targetToTrim)
                    routeObj.chatid = targetToTrim.chatid.toString()
                    routeObj.messageid = targetToTrim._id.toString()
                    
                    const theChat = await dataSources.chats.get(targetToTrim.chatid)
                    const tempPartn = theChat.partners
                    tempPartn.push(theChat.owner)
                    clientsToNotify = tempPartn.filter(prtn=>{
                        return !prtn.equals(clientUser._id)
                    })
                    notifyEventConfig = notifyTypes.CHAT.OPINION_REMOVED
                }
                routeObj.sentimentid = ID
            }catch(err){
                return new ApolloError('Sentiment deletion error', { err })
            }

            for(const clnt of clientsToNotify){
                wsNotifier.sendNotification(clnt.toString(), routeObj , '', notifyEventConfig)
            }

            return {
                targetType: targetingTxt,
                targetId: targetID,
                targetUpdate: targetToTrim.updatedAt,
                id: ID,
                resultText: 'Sentiment deletion done!'
            }
        }
    }
}