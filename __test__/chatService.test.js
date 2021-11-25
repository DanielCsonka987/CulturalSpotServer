const request = require('supertest')
const WebSocket = require('ws')
const mongooseId = require('mongoose').Types.ObjectId

const ProfileModel = require('../models/ProfileModel')
const ChatModel = require('../models/ChattingModel')
const MessageModel = require('../models/MessageModel')

const { startTestingServer, exitTestingServer } = require('../server')
const { authorizTokenEncoder } = require('../utils/tokenManager')
const { userTestDatas, chatTestDatas1, chatTestDatas2, 
    messageTestDatas1, messageTestDatas2, sentimentTestDatas, createTokenToHeader 
    }  = require('./helperToTestingServices')

const profiles = []
const chats = []
const messages = []
const sentiments = []

const user1Notifys = {
    createChat: false,
    addPartn: false,
    removePartn: false,
    updChat: false,
    delChat: false,

    sendMsg: false,
    updMsg: false,
    delMsg: false,
    opinAddMsg: false,
    opinUpdMsg: false,
    opinDelMsg: false,

    properEvent: true,
    properMethod: true
}

let user1WsClient = null
let user2WsClient = null
let theSrv = null
beforeAll((done)=>{

    const profToDel = userTestDatas.map(item=>item.username)
    ProfileModel.deleteMany({username: profToDel}, (e1, d1)=>{
        expect(e1).toBe(null)

        const profToInsert = [userTestDatas[0], userTestDatas[1], userTestDatas[2]]
        ProfileModel.insertMany(profToInsert, (e2, prfls)=>{
            expect(e2).toBe(null)

            const chatsToDel = chatTestDatas1.map(item => item.title)
            for(const item of chatTestDatas2){
                chatsToDel.push(item.title)
            }
            ChatModel.deleteMany({title: chatsToDel}, (e3, d3)=>{
                expect(e3).toBe(null)

                ChatModel.insertMany(chatTestDatas1, (e4, chts)=>{
                    expect(e4).toBe(null)

                    const msgToDel = messageTestDatas1.map(item=>item.content)
                    for(const item of messageTestDatas2){
                        msgToDel.push(item.content)
                    }
                    MessageModel.deleteMany({ content: {$in: msgToDel} }, (e5, d5)=>{
                        expect(e5).toBe(null)

                        MessageModel.insertMany(messageTestDatas1, async (e6, msgs)=>{
                            expect(e6).toBe(null)

                            const tokenOfUser0 = authorizTokenEncoder({
                                subj: prfls[0]._id, email: prfls[0].email
                            })
                            const tokenOfUser1 = authorizTokenEncoder({
                                subj: prfls[1]._id, email: prfls[1].email
                            })
                            const tokenOfUser2 = authorizTokenEncoder({
                                subj: prfls[2]._id, email: prfls[2].email
                            })
                            theSrv = await startTestingServer(true)
                            user1WsClient = new WebSocket('ws://localhost:3030/' + tokenOfUser1)
                            user1WsClient.on('message', (msg)=>{
                                expect(typeof msg).toBe('string')
                                const env = JSON.parse(msg)

                                if(env.event === 'chat'){
                                    if(env.eventMethod === 'createdChatRoom'){
                                        expect(env.properAction).toBe('add')
                                        expect(env.connectedTo).toBe('')
                                        expect(typeof env.payload.chatid).toBe('string')
                                        user1Notifys.createChat = true
                                    }else if(env.eventMethod === 'updatedChatRoom'){
                                        expect(env.properAction).toBe('update')
                                        expect(env.connectedTo).toBe('')
                                        expect(typeof env.payload.chatid).toBe('string')
                                        expect(env.payload.title).toBe(chatTestDatas2[1].title)
                                        user1Notifys.updChat = true
                                    }else if(env.eventMethod === 'deletedChatRoom'){
                                        expect(env.properAction).toBe('remove')
                                        expect(env.connectedTo).toBe('')
                                        expect(env.payload.chatid).toBe(chats[1].id)
                                        user1Notifys.delChat = true
                                    }else if(env.eventMethod === 'sentMessage'){
                                        expect(env.properAction).toBe('add')
                                        expect(env.connectedTo.chatid).toBe(chats[0].id)
                                        expect(typeof env.payload.messageid).toBe('string')
                                        expect(env.payload.content).toBe(messageTestDatas2[1].content)
                                        user1Notifys.sendMsg = true
                                    }else if(env.eventMethod === 'messageEdited'){
                                        expect(env.properAction).toBe('update')
                                        expect(env.connectedTo.chatid).toBe(chats[0].id)
                                        expect(env.payload.messageid).toBe(messages[6].id)
                                        expect(env.payload.content).toBe(messageTestDatas2[2].content)
                                        user1Notifys.updMsg = true
                                    }else if(env.eventMethod === 'messageRemoved'){
                                        expect(env.properAction).toBe('remove')
                                        expect(env.connectedTo.chatid).toBe(chats[0].id)
                                        expect(env.connectedTo.messageid).toBe(messages[3].id)
                                        expect(env.payload).toBe('')
                                        user1Notifys.delMsg = true
                                    }else if(env.eventMethod === 'opinionedAdded'){
                                        expect(env.properAction).toBe('add')
                                        expect(env.connectedTo.chatid).toBe(chats[0].id)
                                        expect(env.connectedTo.messageid).toBe(messages[2].id)
                                        expect(typeof env.payload).toBe('object')
                                        expect(typeof env.payload.sentimentid).toBe('string')
                                        expect(env.payload.content).toBe(sentimentTestDatas[2].content)
                                        user1Notifys.opinAddMsg = true
                                    }else if(env.eventMethod === 'opinionedUpdated'){
                                        expect(env.properAction).toBe('update')
                                        expect(env.connectedTo.chatid).toBe(chats[0].id)
                                        expect(env.connectedTo.messageid).toBe(messages[0].id)
                                        expect(typeof env.payload).toBe('object')
                                        expect(env.payload.sentimentid).toBe(sentiments[0].toString())
                                        expect(env.payload.content).toBe(sentimentTestDatas[3].content)
                                        user1Notifys.opinUpdMsg = true

                                    }else if(env.eventMethod === 'opinionRemoved'){
                                        expect(env.properAction).toBe('remove')
                                        expect(env.connectedTo.chatid).toBe(chats[0].id)
                                        expect(env.connectedTo.messageid).toBe(messages[0].id)
                                        expect(env.connectedTo.sentimentid).toBe(sentiments[1].toString())
                                        expect(env.payload).toBe('')
                                        user1Notifys.opinDelMsg = true
                                    }else{
                                        user1Notifys.properMethod = false
                                    }
                                }else{
                                    user1Notifys.properEvent = false
                                }
                            })

                            user2WsClient = new WebSocket('ws://localhost:3030/' + tokenOfUser2)
                            user2WsClient.on('message', (msg)=>{
                                expect(typeof msg).toBe('string')
                                const env = JSON.parse(msg)
                                if(env.event === 'chat'){
                                    if(env.eventMethod === 'partnerAddedToChatRoom'){
    
                                        expect(env.properAction).toBe('add')
                                        expect(env.connectedTo).toBe('')
                                        expect(typeof env.payload.chatid).toBe('string')
                                        expect(env.payload.chatid).toBe(chats[1].id)
    
                                        user1Notifys.addPartn = true
                                    }else if(env.eventMethod === 'partnerRemovedFromChatroom'){
    
                                        expect(env.properAction).toBe('remove')
                                        expect(env.connectedTo).toBe('')
                                        expect(typeof env.payload.chatid).toBe('string')
                                        expect(env.payload.chatid).toBe(chats[1].id)
                                        user1Notifys.removePartn = true
                                    }else{
                                        user1Notifys.properMethod = false
                                    }
                                }else{
                                    user1Notifys.properEvent = false
                                }
                            })
                            profiles.push({ 
                                id: prfls[0]._id.toString(),
                                token: tokenOfUser0
                            })
                            profiles.push({ 
                                id: prfls[1]._id.toString(),
                                token: tokenOfUser1
                            })
                            profiles.push({ 
                                id: prfls[2]._id.toString(),
                                token: tokenOfUser2
                            })
                            chats.push({ id: chts[0]._id.toString() })

                            chts[0].owner = prfls[0]._id
                            chts[0].partners.push(prfls[1]._id)

                            const chatID = chts[0]._id
                            await chts[0].save()

                            msgs[0].chatid = chatID
                            msgs[0].owner = prfls[0]._id
                            msgs[0].nextMsg = msgs[1]._id
                            const smt1 = new mongooseId()
                            sentiments.push(smt1)
                            msgs[0].sentiments.push({
                                _id: smt1,
                                owner: prfls[0]._id,
                                ...sentimentTestDatas[0]
                            })
                            const smt2 = new mongooseId()
                            sentiments.push(smt2)
                            msgs[0].sentiments.push({
                                _id: smt2,
                                owner: prfls[0]._id,
                                ...sentimentTestDatas[1]
                            })
                            await msgs[0].save()
                            messages.push({ 
                                id: msgs[0]._id.toString(), 
                                date: msgs[0].sentAt.toISOString() 
                            })

                            msgs[1].chatid = chatID
                            msgs[1].owner = prfls[1]._id
                            msgs[1].prevMsg = msgs[0]._id
                            msgs[1].nextMsg = msgs[2]._id
                            await msgs[1].save()
                            messages.push({ 
                                id: msgs[1]._id.toString(),
                                date: msgs[1].sentAt.toISOString() 
                            })

                            msgs[2].chatid = chatID
                            msgs[2].owner = prfls[1]._id
                            msgs[2].prevMsg = msgs[1]._id
                            msgs[2].nextMsg = msgs[3]._id
                            await msgs[2].save()
                            messages.push({ 
                                id: msgs[2]._id.toString(),
                                date: msgs[2].sentAt.toISOString() 
                            })

                            msgs[3].chatid = chatID
                            msgs[3].owner = prfls[0]._id
                            msgs[3].prevMsg = msgs[2]._id
                            msgs[3].nextMsg = msgs[4]._id
                            await msgs[3].save()
                            messages.push({ 
                                id: msgs[3]._id.toString(),
                                date: msgs[3].sentAt.toISOString() 
                            })

                            msgs[4].chatid = chatID
                            msgs[4].owner = prfls[1]._id
                            msgs[4].prevMsg = msgs[3]._id
                            msgs[4].nextMsg = msgs[5]._id
                            await msgs[4].save()
                            messages.push({ 
                                id: msgs[4]._id.toString(),
                                date: msgs[4].sentAt.toISOString() 
                            })

                            msgs[5].chatid = chatID
                            msgs[5].owner = prfls[1]._id
                            msgs[5].prevMsg = msgs[4]._id
                            await msgs[5].save()
                            messages.push({ 
                                id: msgs[5]._id.toString(),
                                date: msgs[5].sentAt.toISOString() 
                            })

                            done()
                        })
                    })
                })
            })
        })
    })
})

afterAll((done)=>{
    setTimeout( async ()=>{
        let wsResult = 0
        for(const [ key, value ] of Object.entries(user1Notifys)){
            if(!value){
                console.log('Ws faild at ' + key)
            }else{
                wsResult++
            }
        }
        expect(wsResult).toBe(13)
        await exitTestingServer()
        done()
    }, 800)
})

describe('Query of chatting', ()=>{
    it('Querying some chatmessage', (done)=>{
        request(theSrv)
        .post('/graphql')
        .send({'query':`
            query{
                listOfMessagesFromChatting(chatid: "${chats[0].id}", 
                    dating: "${messages[4].date}", amount: 3){
                        chatid, partners{
                            userid, username, relation   
                        }, title, owner{
                            userid, username, relation
                        }, startedAt, messages{
                            messageid, sentAt, content, owner{
                                userid, username, relation
                            }, sentiments {
                                sentimentid, createdAt, updatedAt, content, owner{
                                    userid, username, relation
                                }
                            }
                        }
                    }
            }
        `})
        .set('Authorization', createTokenToHeader(profiles[0].token))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)

            expect(typeof res.body.data.listOfMessagesFromChatting)
                .toBe('object')
            expect(res.body.data.listOfMessagesFromChatting.chatid)
                .toBe(chats[0].id)
            expect(res.body.data.listOfMessagesFromChatting.owner.userid)
                .toBe(profiles[0].id)
            expect(res.body.data.listOfMessagesFromChatting.partners)
                .toHaveLength(1)
            expect(res.body.data.listOfMessagesFromChatting.partners[0].userid)
                .toBe(profiles[1].id)
            expect(res.body.data.listOfMessagesFromChatting.title)
                .toBe('Chatroom 1')
            expect(res.body.data.listOfMessagesFromChatting.messages)
                .toHaveLength(3)

            expect(res.body.data.listOfMessagesFromChatting.messages[0].messageid)
                .toBe(messages[4].id)
            expect(res.body.data.listOfMessagesFromChatting.messages[1].messageid)
                .toBe(messages[3].id)
            expect(res.body.data.listOfMessagesFromChatting.messages[2].messageid)
                .toBe(messages[2].id)
            done()
        })
    })



    it('Create new chatroom, ws1', (done)=>{
        request(theSrv)
        .post('/graphql')
        .send({'query':`
            mutation{
                createChatRoom(partners: ["${profiles[1].id}"], 
                    title: "${chatTestDatas2[0].title}", 
                    firstContent: "${messageTestDatas2[0].content}"){
                        chatid, partners{
                            userid, username, relation   
                        }, title, owner{
                            userid, username, relation
                        }, startedAt, messages{
                            messageid, sentAt, content, owner{
                                userid, username, relation
                            }, sentiments {
                                sentimentid, createdAt, updatedAt, content, owner{
                                    userid, username, relation
                                }
                            }
                        }
                    }
            }
        `})
        .set('Authorization', createTokenToHeader(profiles[0].token))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)

            expect(typeof res.body.data.createChatRoom)
                .toBe('object')

            expect(typeof res.body.data.createChatRoom.chatid)
                .toBe('string')
            expect(res.body.data.createChatRoom.owner.userid)
                .toBe(profiles[0].id)
            expect(res.body.data.createChatRoom.partners)
                .toHaveLength(1)
            expect(res.body.data.createChatRoom.partners[0].userid)
                .toBe(profiles[1].id)
            expect(res.body.data.createChatRoom.title)
                .toBe(chatTestDatas2[0].title)
            expect(res.body.data.createChatRoom.messages)
                .toHaveLength(1)
            expect(typeof res.body.data.createChatRoom.messages[0].messageid)
                .toBe('string')
            expect(res.body.data.createChatRoom.messages[0].content)
                .toBe(messageTestDatas2[0].content)

            chats.push({ id: res.body.data.createChatRoom.chatid })
            done()
        })
    })



    it('Add partner to the new chatroom, ws2', (done)=>{
        request(theSrv)
        .post('/graphql')
        .send({'query':`
            mutation{
                addPartnersToChatRoom(partners: ["${profiles[2].id}"], 
                    chatid: "${chats[1].id}"){
                        chatid, resultText, alterationType, addedUsers{
                            userid, username, relation
                        },removedUsers, updatedTitle
                    }
            }
        `})
        .set('Authorization', createTokenToHeader(profiles[0].token))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)

            expect(typeof res.body.data.addPartnersToChatRoom)
                .toBe('object')
            expect(res.body.data.addPartnersToChatRoom.chatid)
                .toBe(chats[1].id)
            expect(res.body.data.addPartnersToChatRoom.resultText)
                .toBe('Some partner is added to the chat!')
            expect(res.body.data.addPartnersToChatRoom.alterationType)
                .toBe('ADDED_PARTNERS')
            expect(res.body.data.addPartnersToChatRoom.addedUsers)
                .toHaveLength(1)
            expect(res.body.data.addPartnersToChatRoom.removedUsers)
                .toHaveLength(0)
            expect(res.body.data.addPartnersToChatRoom.updatedTitle)
                .toBe('')
            done()
        })
    })

    it('Remove partner from the new chatroom, ws3', (done)=>{
        request(theSrv)
        .post('/graphql')
        .send({'query':`
            mutation{
                removePartnersFromChatRoom(partners: ["${profiles[2].id}"], 
                    chatid: "${chats[1].id}"){
                        chatid, resultText, alterationType, addedUsers{
                            userid, username, relation
                        },
                        removedUsers, updatedTitle
                    }
            }
        `})
        .set('Authorization', createTokenToHeader(profiles[0].token))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)

            expect(typeof res.body.data.removePartnersFromChatRoom)
                .toBe('object')
            expect(res.body.data.removePartnersFromChatRoom.chatid)
                .toBe(chats[1].id)
            expect(res.body.data.removePartnersFromChatRoom.resultText)
                .toBe('Some partner is removed from the chat!')
            expect(res.body.data.removePartnersFromChatRoom.alterationType)
                .toBe('REMOVED_PARTNERS')
            expect(res.body.data.removePartnersFromChatRoom.addedUsers)
                .toHaveLength(0)
            expect(res.body.data.removePartnersFromChatRoom.removedUsers)
                .toHaveLength(1)
            expect(res.body.data.removePartnersFromChatRoom.updatedTitle)
                .toBe('')
            done()
        })
    })




    it('Update chatroom, ws4', (done)=>{
        request(theSrv)
        .post('/graphql')
        .send({'query':`
            mutation{
                updateChatRoom(chatid: "${chats[1].id}" title: "${chatTestDatas2[1].title}"){
                        chatid, resultText, alterationType, addedUsers{
                            userid, username, relation
                        },
                        removedUsers, updatedTitle
                    }
            }
        `})
        .set('Authorization', createTokenToHeader(profiles[0].token))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)

            expect(typeof res.body.data.updateChatRoom)
                .toBe('object')
            expect(res.body.data.updateChatRoom.chatid)
                .toBe(chats[1].id)
            expect(res.body.data.updateChatRoom.resultText)
                .toBe('Chatroom has been updated!')
            expect(res.body.data.updateChatRoom.alterationType)
                .toBe('UPDATED_CHATROOM')
            expect(res.body.data.updateChatRoom.addedUsers)
                .toHaveLength(0)
            expect(res.body.data.updateChatRoom.removedUsers)
                .toHaveLength(0)
            expect(res.body.data.updateChatRoom.updatedTitle)
                .toBe(chatTestDatas2[1].title)
            done()
        })
    })




    it('Delete chatroom, ws5', (done)=>{
        request(theSrv)
        .post('/graphql')
        .send({'query':`
            mutation{
                deleteChatRoom(chatid: "${chats[1].id}"){
                        chatid, resultText, alterationType, addedUsers{
                            userid, username, relation
                        },
                        removedUsers, updatedTitle
                    }
            }
        `})
        .set('Authorization', createTokenToHeader(profiles[0].token))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)

            expect(typeof res.body.data.deleteChatRoom)
                .toBe('object')
            expect(res.body.data.deleteChatRoom.chatid)
                .toBe(chats[1].id)
            expect(res.body.data.deleteChatRoom.resultText)
                .toBe('Chatroom has been deleted!')
            expect(res.body.data.deleteChatRoom.alterationType)
                .toBe('DELETED_CHATROOM')
            expect(res.body.data.deleteChatRoom.addedUsers)
                .toHaveLength(0)
            expect(res.body.data.deleteChatRoom.removedUsers)
                .toHaveLength(0)
            expect(res.body.data.deleteChatRoom.updatedTitle)
                .toBe('')
            done()
        })
    })

    it('Sending a massege, ws6', (done)=>{
        request(theSrv)
        .post('/graphql')
        .send({'query':`
            mutation{
                sendNewMessage(chatid: "${chats[0].id}", content: "${messageTestDatas2[1].content}"){
                        chatid, messageid, content, owner{
                            userid, username, relation
                        },
                        sentAt, sentiments{
                            sentimentid, owner{
                                userid, username, relation
                            }, content, createdAt, updatedAt
                        }
                    }
            }
        `})
        .set('Authorization', createTokenToHeader(profiles[0].token))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)

            expect(typeof res.body.data.sendNewMessage).toBe('object')
            expect(typeof res.body.data.sendNewMessage.messageid).toBe('string')
            expect(res.body.data.sendNewMessage.chatid).toBe(chats[0].id)
            expect(res.body.data.sendNewMessage.content).toBe(messageTestDatas2[1].content)
            expect(res.body.data.sendNewMessage.owner.userid).toBe(profiles[0].id)
            expect(res.body.data.sendNewMessage.sentiments).toHaveLength(0)

            messages.push({ 
                id: res.body.data.sendNewMessage.messageid,
                date: res.body.data.sendNewMessage.sentAt
            })
            done()
        })
    })
    it('Updateing a message, ws7', (done)=>{
        request(theSrv)
        .post('/graphql')
        .send({'query':`
            mutation{
                updateThisMessage(messageid: "${messages[6].id}", content: "${messageTestDatas2[2].content}"){
                        chatid, messageid, content, owner{
                            userid, username, relation
                        },
                        sentAt, sentiments{
                            sentimentid, owner{
                                userid, username, relation
                            }, content, createdAt, updatedAt
                        }
                    }
            }
        `})
        .set('Authorization', createTokenToHeader(profiles[0].token))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)

            expect(typeof res.body.data.updateThisMessage).toBe('object')
            expect(res.body.data.updateThisMessage.messageid).toBe(messages[6].id)
            expect(res.body.data.updateThisMessage.chatid).toBe(chats[0].id)
            expect(res.body.data.updateThisMessage.content).toBe(messageTestDatas2[2].content)
            expect(res.body.data.updateThisMessage.owner.userid).toBe(profiles[0].id)
            expect(res.body.data.updateThisMessage.sentiments).toHaveLength(0)

            done()
        })
    })
    it('Delete a message, ws8', (done)=>{
        request(theSrv)
        .post('/graphql')
        .send({'query':`
            mutation{
                deleteThisMessage(messageid: "${messages[3].id}"){
                        chatid, messageid, resultText
                    }
            }
        `})
        .set('Authorization', createTokenToHeader(profiles[0].token))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)

            expect(typeof res.body.data.deleteThisMessage).toBe('object')
            expect(res.body.data.deleteThisMessage.messageid).toBe(messages[3].id)
            expect(res.body.data.deleteThisMessage.chatid).toBe(chats[0].id)
            expect(res.body.data.deleteThisMessage.resultText)
                .toBe('Message deleted!')

            done()
        })
    })



    it('Add sentiment to a message, ws9', (done)=>{
        MessageModel.findById(messages[2].id, (e1, d1)=>{
            expect(e1).toBe(null)
            expect(typeof d1).toBe('object')
            expect(d1.sentiments).toHaveLength(0)

            request(theSrv)
            .post('/graphql')
            .send({'query':`
                mutation{
                    createSentimentToHere(targeted: MESSAGE, 
                        id:"${messages[2].id}", content:${sentimentTestDatas[2].content}){
                            sentimentid, owner{
                                userid, username, relation
                            }, content, createdAt, updatedAt
                        }
                }
            `})
            .set('Authorization', createTokenToHeader(profiles[0].token))
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)
                expect(res.body.errors).toBe(undefined)
    
                expect(typeof res.body.data.createSentimentToHere).toBe('object')
                expect(typeof res.body.data.createSentimentToHere.sentimentid).toBe('string')
                expect(res.body.data.createSentimentToHere.owner.userid).toBe(profiles[0].id)
                expect(res.body.data.createSentimentToHere.content)
                    .toBe(sentimentTestDatas[2].content)

                MessageModel.findById(messages[2].id, (e2, d2)=>{
                    expect(e2).toBe(null)
                    expect(typeof d2).toBe('object')
                    expect(d2.sentiments).toHaveLength(1)
                    expect(d2.sentiments[0]._id.toString())
                        .toBe(res.body.data.createSentimentToHere.sentimentid)

                    sentiments.push(res.body.data.createSentimentToHere.sentimentid)
                    done()
                })
                    

            })
        })
    })
    it('Update a sentiment of a message, ws10', (done)=>{

        MessageModel.findById(messages[0].id, (e1, d1)=>{
            expect(e1).toBe(null)
            expect(typeof d1).toBe('object')
            expect(d1.sentiments).toHaveLength(2)
            expect(d1.sentiments[0]._id.toString()).toBe(sentiments[0].toString())
            expect(d1.sentiments[0].content).toBe(sentimentTestDatas[0].content)

            request(theSrv)
            .post('/graphql')
            .send({'query':`
                mutation{
                    updateSentimentContent(targeted: MESSAGE, id:"${messages[0].id}", 
                        sentimentid: "${sentiments[0].toString()}", 
                        content:${sentimentTestDatas[3].content}){
                            sentimentid, owner{
                                userid, username, relation
                            }, content, createdAt, updatedAt
                        }
                }
            `})
            .set('Authorization', createTokenToHeader(profiles[0].token))
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)
                expect(res.body.errors).toBe(undefined)
    
                expect(typeof res.body.data.updateSentimentContent).toBe('object')
                expect(res.body.data.updateSentimentContent.sentimentid).toBe(sentiments[0].toString())
                expect(res.body.data.updateSentimentContent.owner.userid).toBe(profiles[0].id)
                expect(res.body.data.updateSentimentContent.content)
                    .toBe(sentimentTestDatas[3].content)

                MessageModel.findById(messages[0].id, (e2, d2)=>{
                    expect(e2).toBe(null)
                    expect(typeof d2).toBe('object')
                    expect(d2.sentiments).toHaveLength(2)
                    expect(d2.sentiments[0]._id.toString()).toBe(sentiments[0].toString())
                    expect(d2.sentiments[0].content).toBe(sentimentTestDatas[3].content)

                    done()
                })
            })
        })
    })
    it('Delete a sentiment of a message', (done)=>{
        MessageModel.findById(messages[0].id, (e1, d1)=>{
            expect(e1).toBe(null)
            expect(typeof d1).toBe('object')
            expect(d1.sentiments).toHaveLength(2)
            expect(d1.sentiments[0]._id.toString()).toBe(sentiments[0].toString())
            expect(d1.sentiments[1]._id.toString()).toBe(sentiments[1].toString())

            request(theSrv)
            .post('/graphql')
            .send({'query':`
                mutation{
                    deleteThisSentiment(targeted: MESSAGE, id:"${messages[0].id}", 
                        sentimentid: "${sentiments[1].toString()}"){
                            resultText, targetType, targetId, targetUpdate, id
                        }
                }
            `})
            .set('Authorization', createTokenToHeader(profiles[0].token))
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)
                expect(res.body.errors).toBe(undefined)
    
                expect(typeof res.body.data.deleteThisSentiment).toBe('object')
                expect(res.body.data.deleteThisSentiment.id).toBe(sentiments[1].toString())
                expect(res.body.data.deleteThisSentiment.resultText)
                    .toBe('Sentiment deletion done!')
                expect(res.body.data.deleteThisSentiment.targetType).toBe('MESSAGE')
                expect(res.body.data.deleteThisSentiment.targetId).toBe(messages[0].id)

                MessageModel.findById(messages[0].id, (e2, d2)=>{
                    expect(e2).toBe(null)
                    expect(typeof d2).toBe('object')
                    expect(d2.sentiments).toHaveLength(1)
                    expect(d2.sentiments[0]._id.toString()).toBe(sentiments[0].toString())
     

                    done()
                })
            })
        })
    })
})