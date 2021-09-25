const { AuthenticationError, UserInputError, ApolloError, ForbiddenError } = require('apollo-server-express')
const MongooseID = require('mongoose').Types.ObjectId

const { authorizEvaluation } = require('./resolveHelpers')
const { chatMessagesQueryInputRevise, chatRoomCreateInputRevise, 
    chatRoomAddRemovePartnersInputRevise, chatRoomUpdateInputRevise, 
    chatRoomDelteInputRevise, 
    sendMessageInputRevise, updateMessageInputRvise, deleteMessageInputRevise
     } = require('../../utils/inputRevise')
const { notifyTypes } = require('../../extensions/dinamicClientNotifier/userNotifierUnit')


module.exports = {
    Query: {
        async listOfMessagesFromChatting(_, args, { authorizRes, dataSources }){
            authorizEvaluation(authorizRes)

            const { error, field, issue, chatid, date, amount } = 
                chatMessagesQueryInputRevise(args.chatid, args.dating, args.amount)

            if(error){
                return new UserInputError('No proper chat messages inputs!', { field, issue })
            }

            const theChat = await dataSources.chats.get(chatid)
            if(!theChat){
                return new ApolloError('No requested chatting!', { general: 'No chattingroom found' })
            }
            if( !theChat.isThisMemberInChat(new MongooseID(authorizRes.subj)) ){
                return new AuthenticationError('You have no right to access!', { general: 'Subject have no concern to this chatting' })
            }
            return theChat.getChatRoomDatas({ dating: date, amount: amount })
            /*
            return {
                chatid: chatid,
                partners: theChat.partners,
                owner: theChat.owner,
                title: theChat.title,
                startedAt: theChat.startedAt,
                messages: { dating: date, amount: amount }
            }*/
        }
    },
    Mutation: {
        async createChatRoom(_, args, { authorizRes, dataSources, wsNotifier }){
            authorizEvaluation(authorizRes)

            const { error, field, issue, partners, title, content} = chatRoomCreateInputRevise(
                args.partners, args.title, args.firstContent
            )
            if(error){
                return new UserInputError('No proper chatroom inputs!', { field, issue })
            }

            const finalPartners = await dataSources.profiles.getAllOfThese(partners)
            if(!finalPartners){
                return new UserInputError('No existing partners to chat with!', { general: 'Partner ids are all invalid!' })
            }

            const theDating = new Date()
            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            const theChat = await dataSources.chats.create({
                owner: clientUser._id,
                startedAt: theDating,
                title: title,
                partners: finalPartners.map(user=>{return user._id})
            })
            let onlyMessage
            try{
                onlyMessage = await dataSources.messages.create({
                    chatid: theChat._id,
                    sentAt: theDating,
                    owner: clientUser._id,
                    content: content
                })
            }catch(err){
                return new ApolloError('Chatroom creation error', { error: err.message })
            }

            for(const partn of finalPartners){

                partn.myChats.push(theChat._id)
                await dataSources.profiles.saving(partn)

                wsNotifier.sendNotification(partn._id.toString(), '', {
                        chatid: theChat._id,
                        title: theChat.title,
                        startedAt: theChat.startedAt,
                    },
                    notifyTypes.CHAT.CHATROOM_CREATED
                )
            }
            return theChat.getChatRoomDatas([onlyMessage])
            /*
            return {
                chatid: theChat._id,
                partners: theChat.partners,
                owner: theChat.owner,
                title: theChat.title,
                startedAt: theChat.startedAt,
                messages: [onlyMessage]
            }
            */
        },
        async addPartnersToChatRoom(_, args, { authorizRes, dataSources, wsNotifier }){
            authorizEvaluation(authorizRes)

            const {error, issue, field, partners, chatid} = chatRoomAddRemovePartnersInputRevise(
                args.chatid, args.partners
            )
            if(error){
                return new UserInputError('No proper inputs for new chatpartners addition!', { field, issue })
            }

            const theChat = await dataSources.chats.get(chatid)
            if(!theChat){
                return new UserInputError('No proper chatid was passed', { general: 'No chatting have found!' })
            }
            const theClientID = new MongooseID(authorizRes.subj)
            if( !theChat.isThisOwnerInChat(theClientID)){
                return new ForbiddenError('Forbidden to manage partners in chatroom', { general: 'No ownership to the chatroom!' })
            }

            const finalPartners = await dataSources.profiles.getAllOfThese(partners)
            if(!finalPartners){
                return new UserInputError('No existing partners to chat with!', { general: 'Partner ids are all invalid!' })
            }
            const parntersToAdded = []
            try{
                for(const partn of finalPartners){
                    theChat.partners.push(partn._id)
                    partn.myChats.push(theChat._id)
                    await dataSources.profiles.saving(partn)

                    parntersToAdded.push(partn._id.toString())

                    wsNotifier.sendNotification(partn._id.toString(), '', theChat.getChatBasicDatas
                    /*{
                        chatid: theChat._id.toString(),
                        title: theChat.title,
                        startedAt: theChat.startedAt.toISOString()
                    }*/, notifyTypes.CHAT.CHATROOM_CLIENT_ADDED)
                }
                await dataSources.chats.saving(theChat)
            }catch(err){
                return new ApolloError('Chatroom parner addition error', { error: err.message })
            }


            return {
                chatid: chatid,
                resultText: 'Some partner is added to the chat!',
                alterationType: 'ADDED_PARTNERS',
                addedUsers: parntersToAdded,
                removedUsers: [],
                updatedTitle: ''
            }
        },
        async removePartnersFromChatRoom(_, args, { authorizRes, dataSources, wsNotifier }){
            authorizEvaluation(authorizRes)

            const {error, issue, field, partners, chatid} = chatRoomAddRemovePartnersInputRevise(
                args.chatid, args.partners
            )
            if(error){
                return new UserInputError('No proper inputs for remove chatpartners!', { field, issue })
            }
            
            const theChat = await dataSources.chats.get(chatid)
            if(!theChat){
                return new UserInputError('No proper chatid was passed', { general: 'No chatting have found!' })
            }
            const theClientID = new MongooseID(authorizRes.subj)
            if( !theChat.isThisOwnerInChat(theClientID)){
                return new ForbiddenError('Forbidden to manage partners in chatroom', { general: 'No ownership to the chatroom!' })
            }

            const finalPartners = await dataSources.profiles.getAllOfThese(partners)
            if(!finalPartners){
                return new UserInputError('No existing partners to remove from chat!', { general: 'Partner ids are all invalid!' })
            }

            const removedPartners = []
            try{
                for(const partnClient of finalPartners){
                    partnClient.myChats = partnClient.myChats.filter(item=>{ 
                        return !item._id.equals(theChat._id) 
                    })
                    await dataSources.profiles.saving(partnClient)
                    
                    wsNotifier.sendNotification(partnClient._id.toString(), '', theChat.getChatBasicDatas
                    /* {
                        chatid: theChat._id.toString(),
                        title: theChat.title,
                        startedAt: theChat.startedAt.toISOString()
                    }*/, notifyTypes.CHAT.CHATROOM_CLIENT_REMOVED)

                    theChat.partners = theChat.partners.filter(item=>{
                        return !item.equals(partnClient._id)
                    })

                    removedPartners.push(partnClient._id.toString())
                }
                await dataSources.chats.saving(theChat)
            }catch(err){
                return new ApolloError('Chatroom partner removal error', { error: err.message })
            }

            return {
                chatid: chatid,
                resultText: 'Some partner is removed from the chat!',
                alterationType: 'REMOVED_PARTNERS',
                addedUsers: [],
                removedUsers: removedPartners,
                updatedTitle: ''
            }
        },
        async updateChatRoom(_, args, { authorizRes, dataSources, wsNotifier }){
            authorizEvaluation(authorizRes)

            const {error, issue, field, chatid, title} = chatRoomUpdateInputRevise(
                args.chatid, args.title
            )
            if(error){
                return new UserInputError('No proper inputs for update chatroom!', { field, issue })
            }

            const theChat = await dataSources.chats.get(chatid)
            if(!theChat){
                return new UserInputError('No proper chatid was passed', { general: 'No chatting have found!' })
            }
            const theClientID = new MongooseID(authorizRes.subj)
            if( !theChat.isThisOwnerInChat(theClientID)){
                return new ForbiddenError('Forbidden the update of chatroom', { general: 'No ownership to the chatroom!' })
            }

            theChat.title = title
            try{
                await dataSources.chats.saving(theChat)
            }catch(err){
                return new ApolloError('Chatroom updating error', err)
            }

            for(const partnClient of theChat.partners){
                wsNotifier.sendNotification(partnClient._id.toString(), '', 
                theChat.getChatBasicDatas
                /*{
                    chatid: theChat._id.toString(),
                    title: theChat.title,
                    startedAt: theChat.startedAt.toISOString()
                }*/, notifyTypes.CHAT.CHATROOM_UPDATED)
            }
            return {
                chatid: chatid,
                resultText: 'Chatroom has been updated!',
                alterationType: 'UPDATED_CHATROOM',
                addedUsers: [],
                removedUsers: [],
                updatedTitle: title
            }
        },
        async deleteChatRoom(_, args, { authorizRes, dataSources, wsNotifier }){
            authorizEvaluation(authorizRes)

            const {error, issue, field, chatid } = chatRoomDelteInputRevise(
                args.chatid
            )
            if(error){
                return new UserInputError('No proper inputs for deletion of chatroom!', { field, issue })
            }

            const theChat = await dataSources.chats.get(chatid)
            if(!theChat){
                return new UserInputError('No proper chatid was passed', { general: 'No chatting have found!' })
            }
            const theClientID = new MongooseID(authorizRes.subj)
            if( !theChat.isThisOwnerInChat(theClientID)){
                return new ForbiddenError('Forbidden the deletion of chatroom', { general: 'No ownership to the chatroom!' })
            }

            const partnersToNotify = theChat.partners
            try{
                await dataSources.chats.deleting(theChat._id)
                await dataSources.messages.deleteAllChattings(theChat._id)
            }catch(err){
                return new ApolloError('Chatroom deletion error', { error: err.message })
            }

            for(const partnClient of partnersToNotify){
                wsNotifier.sendNotification(partnClient._id.toString(), '', theChat.getChatBasicDatas
                /*{
                    chatid: theChat._id.toString(),
                    title: theChat.title,
                    startedAt: theChat.startedAt.toISOString()
                }*/, notifyTypes.CHAT.CHATROOM_REMOVED)
            }

            return {
                chatid: chatid,
                resultText: 'Chatroom has been deleted!',
                alterationType: 'DELETED_CHATROOM',
                addedUsers: [],
                removedUsers: [],
                updatedTitle: ''
            }
        },
        async sendNewMessage(_, args, { authorizRes, dataSources, wsNotifier }){
            authorizEvaluation(authorizRes)

            const { error, issue, field, chatid, message } = 
                sendMessageInputRevise(args.chatid, args.content)
            if(error){
                return new UserInputError('No proper inputs for sending a message!', { field, issue })
            }

            const theChat = await dataSources.chats.get(chatid)
            if(!theChat){
                return new UserInputError('No proper chatid was passed', { general: 'No chatting have found!' })
            }
            const theClientID = new MongooseID(authorizRes.subj)
            if( !theChat.isThisMemberInChat(theClientID) ){
                return new ForbiddenError('Forbidden sending the message', { general: 'No partnership to the chatroom!' })
            }
            let newMsg = null
            try{
                newMsg = await dataSources.messages.create({
                    chatid: theChat._id,
                    owner: theClientID,
                    sentAt: new Date,
                    content: message
                })
            }catch(err){
                return new ApolloError('Message creation error', { error: err.message })
            }

            const partnToNofify = theChat.getWhosMembersNeedToNotify(theClientID)
            for(const partnClient of partnToNofify ){
                wsNotifier.sendNotification(partnClient._id.toString(), {
                    chatid: theChat._id.toString()
                }, {
                    messageid: newMsg._id.toString(),
                    sentAt: newMsg.sentAt.toISOString(),
                    owner: newMsg.owner.toString(),
                    content: newMsg.content,
                }, notifyTypes.CHAT.NEW_MESSAGE)
            }

            return {
                messageid: newMsg._id.toString(),
                chatid: newMsg.chatid.toString(),
                sentAt: newMsg.sentAt.toISOString(),
                owner: newMsg.owner.toString(),
                content: newMsg.content,
                sentiments: []
            }
        },
        async updateThisMessage(_, args, { authorizRes, dataSources, wsNotifier }){
            authorizEvaluation(authorizRes)
            const { error, issue, field, messageid, message } = 
                updateMessageInputRvise(args.messageid, args.content)
            if(error){
                return new UserInputError('No proper inputs for sending a message!', { field, issue })
            }

            const theMsg = await dataSources.messages.get(messageid)
            if(!theMsg){
                return new UserInputError('No proper messageid was passed', { general: 'No message have found!' })
            }
            const theClientID = new MongooseID(authorizRes.subj)
            if( !theMsg.owner.equals(theClientID) ){
                return new ForbiddenError('Forbidden to update this message', { general: 'No ownership to the message!' })
            }
            theMsg.content = message
            //theMsg.updatedAt = new Date()
            try{
                await dataSources.messages.saving(theMsg)
            }catch(err){
                return new ApolloError('Message updating error')
            }

            const theChat = await dataSources.chats.get(theMsg.chatid)
            const partnToNofify = theChat.getWhosMembersNeedToNotify(theClientID)
            for(const partnClient of partnToNofify ){
                wsNotifier.sendNotification(partnClient._id.toString(), {
                    chatid: theMsg.chatid.toString()
                }, {
                    messageid: theMsg._id.toString(),
                    sentAt: theMsg.sentAt.toISOString(),
                    owner: theMsg.owner.toString(),
                    content: theMsg.content,
                    sentiments: theMsg.sentiments
                }, notifyTypes.CHAT.MESSAGE_EDITED)
            }

            return {
                messageid: theMsg._id.toString(),
                chatid: theMsg.chatid.toString(),
                sentAt: theMsg.sentAt.toISOString(),
                owner: theMsg.owner.toString(),
                content: theMsg.content,
                sentiments: theMsg.sentiments
            }

        },
        async deleteThisMessage(_, args, { authorizRes, dataSources, wsNotifier }){
            authorizEvaluation(authorizRes)
            const { error, issue, field, messageid } = 
                deleteMessageInputRevise(args.messageid)
            if(error){
                return new UserInputError('No proper inputs for sending a message!', { field, issue })
            }
            const theMsg = await dataSources.messages.get(messageid)
            if(!theMsg){
                return new UserInputError('No proper messageid was passed', { general: 'No message have found!' })
            }
            const theClientID = new MongooseID(authorizRes.subj)
            if( !theMsg.owner.equals(theClientID) ){
                return new ForbiddenError('Forbidden the deletion of this message', { general: 'No ownership to the message!' })
            }

            try{
                await dataSources.messages.deleting(theMsg._id)
            }catch(err){
                return new ApolloError('Message deletion error', { error: err.message })
            }
            const theChat = await dataSources.chats.get(theMsg.chatid)
            const partnToNofify = theChat.getWhosMembersNeedToNotify(theClientID)
            for(const partnClient of partnToNofify ){
                wsNotifier.sendNotification(partnClient._id.toString(), {
                    chatid: theMsg.chatid.toString(),
                    messageid: theMsg._id.toString()
                }, '', notifyTypes.CHAT.MESSAGE_REMOVED)
            }

            return {
                chatid: theMsg.chatid,
                messageid: theMsg._id,
                resultText: 'Message deleted!'
            }
        }
    }
}