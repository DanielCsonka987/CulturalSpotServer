const WebSocket = require('ws');
const request = require('supertest')
const MongooseID = require('mongoose').Types.ObjectId

const { startTestingServer, exitTestingServer } = require('../server')
const ProfileModel = require('../models/ProfileModel')
const PostModel = require('../models/PostModel')
const CommentModel = require('../models/CommentModel')
const SentimSchima = require('../models/SentimentSchema')
const { authorizTokenEncoder } = require('../utils/tokenManager')

const { userTestDatas, createTokenToHeader, postTestDatas1, 
    commentTestDatas1,commentTestDatas2,
    sentimentTestDatas } = require('./helperToTestingServices')

let apolloServer = null
const users = []
const posts = []
const otherPosts = []
const comments = []
const otherComments = []
const sentiments = []

let notifyCounter = 0
let theWsOf0 = null

beforeAll((done)=>{
    
    const usersToDel = userTestDatas.map(item=>item.email)
    ProfileModel.deleteMany({email: usersToDel}, async (e1, d1)=>{
        expect(e1).toBe(null)
        expect(typeof d1).toBe('object')
        apolloServer = await startTestingServer(true)
        
        ProfileModel.insertMany(userTestDatas, async (e2, usrs)=>{
            expect(e2).toBe(null)
            expect(typeof usrs).toBe('object')
            expect(usrs).toHaveLength(7)
            
            usrs[0].friends.push(usrs[1]._id)
            usrs[0].myInvitations.push(usrs[3]._id)
            usrs[0].myInvitations.push(usrs[4]._id)
            usrs[0].myFriendRequests.push(usrs[5]._id)
            usrs[0].myFriendRequests.push(usrs[6]._id)
            await usrs[0].save()
            users.push({ 
                id: usrs[0]._id.toString(), 
                email: usrs[0].email
            })

            usrs[1].friends.push(usrs[0]._id)
            await usrs[1].save()
            users.push({ 
                id: usrs[1]._id.toString(), 
                email: usrs[1].email
            })
            usrs[2].friends.push(usrs[0]._id)
            await usrs[2].save()
            users.push({ 
                id: usrs[2]._id.toString(), 
                email: usrs[2].email
            })

            usrs[3].myFriendRequests.push(usrs[0]._id)
            await usrs[3].save()
            users.push({ 
                id: usrs[3]._id.toString(), 
                email: usrs[3].email
            })
            usrs[4].myFriendRequests.push(usrs[0]._id)
            await usrs[4].save()
            users.push({ 
                id: usrs[4]._id.toString(), 
                email: usrs[4].email
            })

            usrs[5].myInvitations.push(usrs[0]._id)
            await usrs[5].save()
            users.push({ 
                id: usrs[5]._id.toString(), 
                email: usrs[5].email
            })

            usrs[6].myInvitations.push(usrs[0]._id)
            await usrs[6].save()

            const postToDel = postTestDatas1.map(item=>item.content)
            PostModel.deleteMany({ content: postToDel }, (e3, d3)=>{
                expect(e3).toBe(null)

                const toAdd = []
                for(let i = 0; i < postTestDatas1.length; i++){
                    if(i < 5){
                        toAdd.push(postTestDatas1[i])
                    }else{
                        otherPosts.push(postTestDatas1[i])
                    }
                }
                PostModel.insertMany(toAdd, async (e4, psts)=>{
                    expect(e4).toBe(null)
                    expect(typeof psts).toBe('object')

                    usrs[0].myPosts.push(psts[0]._id)
                    usrs[0].myPosts.push(psts[1]._id)
                    await usrs[0].save()
                    psts[0].owner = usrs[0]._id
                    psts[1].owner = usrs[0]._id
                    await psts[0].save()
                    await psts[1].save()
                    posts.push({ id: psts[0]._id.toString()})
                    posts.push({ id: psts[1]._id.toString()})

                    usrs[3].myPosts.push(psts[2]._id)
                    usrs[3].myPosts.push(psts[3]._id)
                    usrs[3].myPosts.push(psts[4]._id)
                    await usrs[3].save()
                    psts[2].owner = usrs[3]._id
                    psts[3].owner = usrs[3]._id
                    psts[4].owner = usrs[3]._id
                    const stm0 = new MongooseID
                    psts[4].sentiments.push({
                        _id: stm0,
                        owner: usrs[3]._id,
                        ...sentimentTestDatas[0]
                    })
                    const stm1 = new MongooseID
                    psts[4].sentiments.push({
                        _id: stm1,
                        owner: usrs[3]._id,
                        ...sentimentTestDatas[1]
                    })
                    await psts[2].save()
                    await psts[3].save()
                    await psts[4].save()
                    posts.push({ id: psts[2]._id.toString()})
                    posts.push({ id: psts[3]._id.toString()})
                    posts.push({ id: psts[4]._id.toString()})
                    sentiments.push({ id: stm0.toString() })
                    sentiments.push({ id: stm1.toString() })

                    const commToDel = commentTestDatas1.map(item=>item.content)
                    for(const item of commentTestDatas2){
                        commToDel.push(item.content)
                    }
                    CommentModel.deleteMany({ content: commToDel }, (e4, d4)=>{
                        expect(e4).toBe(null)

                        for(const item of commentTestDatas2){
                            otherComments.push(item)
                        }
                        CommentModel.insertMany(commentTestDatas1, async (e5, cmmts)=>{
                            expect(e5).toBe(null)

                            psts[0].comments.push(cmmts[0]._id)
                            psts[0].comments.push(cmmts[1]._id)
                            await psts[0].save()
                            cmmts[0].owner = usrs[0]._id
                            cmmts[0].parentNode = psts[0]._id
                            cmmts[0].rootPost = psts[0]._id
                            cmmts[0].comments.push(cmmts[1]._id)
                            await cmmts[0].save()
                            cmmts[1].owner = usrs[3]._id
                            cmmts[1].parentNode = cmmts[0]._id
                            cmmts[1].rootPost = psts[0]._id
                            await cmmts[1].save()
                            cmmts[2].owner = usrs[3]._id
                            cmmts[2].parentNode = psts[0]._id
                            cmmts[2].rootPost = psts[0]._id
                            await cmmts[2].save()
                            comments.push({ id: cmmts[0]._id.toString() })
                            comments.push({ id: cmmts[1]._id.toString() })
                            comments.push({ id: cmmts[2]._id.toString() })

                            psts[2].comments.push(cmmts[3]._id)
                            psts[2].comments.push(cmmts[4]._id)
                            await psts[2].save()
                            cmmts[3].owner = usrs[3]._id
                            cmmts[3].parentNode = psts[2]._id
                            cmmts[3].rootPost = psts[2]._id
                            await cmmts[3].save()
                            cmmts[4].owner = usrs[3]._id
                            cmmts[4].parentNode = psts[2]._id
                            cmmts[4].rootPost = psts[2]._id
                            await cmmts[4].save()
                            comments.push({ id: cmmts[3]._id.toString() })
                            comments.push({ id: cmmts[4]._id.toString() })


                            psts[4].comments.push(cmmts[5]._id)
                            await psts[4].save()
                            cmmts[5].owner = usrs[3]._id
                            cmmts[5].parentNode = psts[4]._id
                            cmmts[5].rootPost = psts[4]._id
                            const stm2 = new MongooseID
                            cmmts[5].sentiments.push({
                                _id: stm2,
                                owner: usrs[3]._id,
                                ...sentimentTestDatas[2]
                            })
                            const stm3 = new MongooseID
                            cmmts[5].sentiments.push({
                                _id: stm3,
                                owner: usrs[3]._id,
                                ...sentimentTestDatas[3]
                            })
                            await cmmts[5].save()
                            comments.push({ id: cmmts[5]._id.toString() })
                            sentiments.push({ id: stm2.toString() })
                            sentiments.push({ id: stm3.toString() })
                        })
                    })


                    const pathID = authorizTokenEncoder({ subj: users[0].id, email: users[0].email})
                    theWsOf0 = new WebSocket(`ws://localhost:3030/${pathID}`)
                    done()
                })
            })
        })
    })


})


/* 
    User0 = User1 (x at 5) 
    User0 -> (User2* at 1), User3 (accept at 3), User4* (x at 2)
    User0 <- user5 (x at 4), User6*
    
    user0 - post0, post1, (post4 add at 6)
    user3 - post2 (content change at 7), post3 (deleted at 8), post4

    post0 - comment0 by user0 -> comment1 by user3 (updated at 11 to comment8), 
          - comment2 by user3 (update at 12 to comment9), 
          - (comment6 add at 9 by user3)
    post2 - comment3 by user3 -> comment4 by user3 (deleted at 13), 
                            ('-> comment7 add at 10 by user3) 


    post4 - sentiment0 (updated at 16 to sentiment6), sentiment1 (delteted at 18), 
            (add sentiment4 at 14 by User3)
        '-> comment5 -> sentiment2 (updated at 17 to sentiment7), (add sentiment5 at 15)
                    '-> sentiment3 (delteted at 19)
*/

afterAll(()=>{

    expect(notifyCounter).toBe(19)
    return exitTestingServer()
})


describe('Friends mutations tests', ()=>{
    
    it('1 - User0 initiate friendship to User2', (done)=>{
        const user0 = users[0]
        const user2 = users[2]

        const pathID = authorizTokenEncoder({ subj: user2.id, email: user2.email})
        const theWsOf2 = new WebSocket(`ws://localhost:3030/${pathID}`)
        
        theWsOf2.on('message', (msg)=>{
            expect(typeof msg).toBe('string')
            console.log('Mutation 1 notification sent!')
            notifyCounter++;

            const env = JSON.parse(msg)
            expect(env).not.toBe(null)

            expect(typeof env.event).toBe('string')
            expect(env.event).toBe('friend')
            expect(typeof env.eventMethod).toBe('string')
            expect(env.eventMethod).toBe('createdInvitation')
            expect(typeof env.properAction).toBe('string')
            expect(env.properAction).toBe('add')
            expect(env.connectedTo).toBe('')
            expect(typeof env.payload).toBe('object')
            expect(env.payload.id).toBe(user0.id)
            expect(env.payload.username).toBe('User 0')
            expect(env.payload.relation).toBe('UNCERTAIN')

            theWsOf2.close()
            
        })

        request(apolloServer)
        .post('/graphql')
        .send({ "query":`mutation{
            createAFriendshipInvitation(friendid: "${user2.id}"){
                id, username, relation, mutualFriendCount
            }
            
        }`})
        .set('Authorization', createTokenToHeader(
            authorizTokenEncoder({ subj: user0.id})
        ))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)
            expect(typeof res.body.data).toBe('object')

            expect(res.body.data.createAFriendshipInvitation.id).toBe(user2.id)
            expect(res.body.data.createAFriendshipInvitation.username).toBe('User 2')
            done()
        })
    })

    it('2 - User0 discard its invitation to User4', (done)=>{
        const user0 = users[0]
        const user4 = users[4]

        const pathID = authorizTokenEncoder({ subj: user4.id, email: user4.email})
        const theWsOf4 = new WebSocket(`ws://localhost:3030/${pathID}`)
        
        theWsOf4.on('message', (msg)=>{
            expect(typeof msg).toBe('string')
            console.log('Mutation 2 notification sent!')
            notifyCounter++;

            const env = JSON.parse(msg)
            expect(env).not.toBe(null)

            expect(typeof env.event).toBe('string')
            expect(env.event).toBe('friend')
            expect(typeof env.eventMethod).toBe('string')
            expect(env.eventMethod).toBe('cancelledInvitation')
            expect(typeof env.properAction).toBe('string')
            expect(env.properAction).toBe('remove')
            expect(env.connectedTo).toBe(user0.id)
            expect(env.payload).toBe('')
            
            theWsOf4.close()
        })

        request(apolloServer)
        .post('/graphql')
        .send({ "query":`mutation{
            removeAFriendshipInitiation(friendid: "${user4.id}"){
                resultText, useridAtProcess
            }
            
        }`})
        .set('Authorization', createTokenToHeader(
            authorizTokenEncoder({ subj: user0.id})
        ))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)
            expect(typeof res.body.data).toBe('object')

            expect(res.body.data.removeAFriendshipInitiation.useridAtProcess)
                .toBe(user4.id)
            expect(res.body.data.removeAFriendshipInitiation.resultText)
                .toBe('Friendship initiation cancelled!')
            done()
        })
    })


    it('3 - User3 accept invitation to User0', (done)=>{
        const user0 = users[0]
        const user3 = users[3]

        //const pathID = authorizTokenEncoder({ subj: user0.id, email: user0.email})
        //const theWsOf0 = new WebSocket(`ws://localhost:3030/${pathID}`)
        
        theWsOf0.on('message', (msg)=>{
            expect(typeof msg).toBe('string')
            const env = JSON.parse(msg)
            expect(env).not.toBe(null)

            if(env.eventMethod === 'approvedRequest'){
                console.log('Mutation 3 notification sent!')
                notifyCounter++;
    
                expect(typeof env.event).toBe('string')
                expect(env.event).toBe('friend')
                expect(typeof env.eventMethod).toBe('string')
                expect(env.eventMethod).toBe('approvedRequest')
                expect(typeof env.properAction).toBe('string')
                expect(env.properAction).toBe('add')
                expect(env.connectedTo).toBe('')
                expect(typeof env.payload).toBe('object')
                expect(env.payload.id).toBe(user3.id)
                expect(env.payload.username).toBe('User 3')
                expect(env.payload.email).toBe(user3.email)
            }

        })

        request(apolloServer)
        .post('/graphql')
        .send({ "query":`mutation{
            approveThisFriendshipRequest(friendid: "${user0.id}"){
                id, username, email 
            }
            
        }`})
        .set('Authorization', createTokenToHeader(
            authorizTokenEncoder({ subj: user3.id})
        ))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)
            expect(typeof res.body.data).toBe('object')

            expect(res.body.data.approveThisFriendshipRequest.id)
                .toBe(user0.id)
            expect(res.body.data.approveThisFriendshipRequest.username)
                .toBe('User 0')
            expect(res.body.data.approveThisFriendshipRequest.email)
                .toBe(user0.email)


            done()

        })
    })

    it('4 - User0 discard sent incitation of User5', (done)=>{
        const user0 = users[0]
        const user5 = users[5]

        const pathID = authorizTokenEncoder({ subj: user5.id, email: user5.email})
        const theWsOf5 = new WebSocket(`ws://localhost:3030/${pathID}`)
        
        theWsOf5.on('message', (msg)=>{
            expect(typeof msg).toBe('string')
            console.log('Mutation 4 notification sent!')
            notifyCounter++;

            const env = JSON.parse(msg)
            expect(env).not.toBe(null)

            expect(typeof env.event).toBe('string')
            expect(env.event).toBe('friend')
            expect(typeof env.eventMethod).toBe('string')
            expect(env.eventMethod).toBe('discardedRequest')
            expect(typeof env.properAction).toBe('string')
            expect(env.properAction).toBe('remove')
            expect(env.connectedTo).toBe(user0.id)
            expect(env.payload).toBe('')

            theWsOf5.close()
        })

        request(apolloServer)
        .post('/graphql')
        .send({ "query":`mutation{
            discardThisFriendshipRequest(friendid: "${user5.id}"){
                resultText, useridAtProcess
            }
            
        }`})
        .set('Authorization', createTokenToHeader(
            authorizTokenEncoder({ subj: user0.id})
        ))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)
            expect(typeof res.body.data).toBe('object')

            expect(res.body.data.discardThisFriendshipRequest.useridAtProcess)
                .toBe(user5.id)
            expect(res.body.data.discardThisFriendshipRequest.resultText)
                .toBe('Friendship request discarded!')

            done()
        })
    })


    it('5 - User0 remove friendship of User1', (done)=>{
        const user0 = users[0]
        const user1 = users[1]

        const pathID = authorizTokenEncoder({ subj: user1.id, email: user1.email})
        const theWsOf1 = new WebSocket(`ws://localhost:3030/${pathID}`)
        
        theWsOf1.on('message', (msg)=>{
            expect(typeof msg).toBe('string')
            console.log('Mutation 5 notification sent!')
            notifyCounter++;

            const env = JSON.parse(msg)
            expect(env).not.toBe(null)

            expect(typeof env.event).toBe('string')
            expect(env.event).toBe('friend')
            expect(typeof env.eventMethod).toBe('string')
            expect(env.eventMethod).toBe('removedFriendship')
            expect(typeof env.properAction).toBe('string')
            expect(env.properAction).toBe('remove')
            expect(env.connectedTo).toBe(user0.id)
            expect(env.payload).toBe('')

            theWsOf1.close()
        })

        request(apolloServer)
        .post('/graphql')
        .send({ "query":`mutation{
            removeThisFriend(friendid: "${user1.id}"){
                resultText, useridAtProcess
            }
            
        }`})
        .set('Authorization', createTokenToHeader(
            authorizTokenEncoder({ subj: user0.id})
        ))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)
            expect(typeof res.body.data).toBe('object')

            expect(res.body.data.removeThisFriend.useridAtProcess)
                .toBe(user1.id)
            expect(res.body.data.removeThisFriend.resultText)
                .toBe('Friendship removed!')
            done()
        })
    })
})


describe('Posts mutations tests', ()=>{

    it('6 - User0 make a post dedicated to User3 ', (done)=>{
        const user0 = users[0]
        const user3 = users[3]

        const pathID = authorizTokenEncoder({ subj: user3.id, email: user3.email})
        const theWsOf3 = new WebSocket(`ws://localhost:3030/${pathID}`)
        
        theWsOf3.on('message', (msg)=>{
            expect(typeof msg).toBe('string')
            console.log('Mutation 6 notification sent!')
            notifyCounter++;

            const env = JSON.parse(msg)
            expect(env).not.toBe(null)

            expect(typeof env.event).toBe('string')
            expect(env.event).toBe('post')
            expect(typeof env.eventMethod).toBe('string')
            expect(env.eventMethod).toBe('postMade')
            expect(typeof env.properAction).toBe('string')
            expect(env.properAction).toBe('add')
            expect(env.connectedTo).toBe('')
            expect(typeof env.payload).toBe('object')

            expect(env.payload.postid).not.toBe(undefined)
            expect(env.payload.owner).toBe(user0.id)
            expect(env.payload.dedicatedTo).toBe(user3.id)
            theWsOf3.close()
        })

        request(apolloServer)
        .post('/graphql')
        .send({ "query":`mutation{
            makeAPost(content: "${otherPosts[0].content}", dedication: "${user3.id}"){
                postid, content, owner{
                    id, username
                }, dedicatedTo{
                    id, username
                }
            }
            
        }`})
        .set('Authorization', createTokenToHeader(
            authorizTokenEncoder({ subj: user0.id})
        ))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)
            expect(typeof res.body.data).toBe('object')

            expect(res.body.data.makeAPost.owner.id)
                .toBe(user0.id)
            expect(res.body.data.makeAPost.dedicatedTo.id)
                .toBe(user3.id)
            done()
        })
    })


    it('7 - User3 change its post2, user0 have a notify', (done)=>{
        const user3 = users[3]

        theWsOf0.on('message', (msg)=>{
            expect(typeof msg).toBe('string')
            const env = JSON.parse(msg)
            expect(env).not.toBe(null)

            if(env.eventMethod === 'contentChanged'){
                console.log('Mutation 7 notification sent!')
                notifyCounter++;
    
                expect(typeof env.event).toBe('string')
                expect(env.event).toBe('post')
                expect(typeof env.eventMethod).toBe('string')
                expect(env.eventMethod).toBe('contentChanged')
                expect(typeof env.properAction).toBe('string')
                expect(env.properAction).toBe('update')
                expect(env.connectedTo).toBe('')
                expect(typeof env.payload).toBe('object')
    
                expect(env.payload.postid).toBe(posts[2].id)
                expect(env.payload.owner).toBe(user3.id)
                expect(env.payload.dedicatedTo).toBe(undefined)
                expect(env.payload.content).toBe(otherPosts[1].content)
                expect(typeof env.payload.updatedAt).toBe('string')
            }


        })

        request(apolloServer)
        .post('/graphql')
        .send({ "query":`mutation{
            updateThisPost(postid: "${posts[2].id}", 
                newcontent: "${otherPosts[1].content}"){
                postid, content, owner{
                    id, username
                }, dedicatedTo{
                    id, username
                }, content
            }
            
        }`})
        .set('Authorization', createTokenToHeader(
            authorizTokenEncoder({ subj: user3.id})
        ))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)
            expect(typeof res.body.data).toBe('object')

            expect(res.body.data.updateThisPost.owner.id)
                .toBe(user3.id)
            expect(res.body.data.updateThisPost.dedicatedTo)
                .toBe(null)
            expect(res.body.data.updateThisPost.postid)
                .toBe(posts[2].id)
            expect(res.body.data.updateThisPost.content)
                .toBe(otherPosts[1].content)
            done()
        })
    })

    it('8 - User3 delets its post3, user0 have a notify', (done)=>{
        const user3 = users[3]

        theWsOf0.on('message', (msg)=>{
            expect(typeof msg).toBe('string')
            const env = JSON.parse(msg)
            expect(env).not.toBe(null)

            if(env.eventMethod === 'postRemoved'){
                console.log('Mutation 8 notification sent!')
                notifyCounter++;
    
                expect(typeof env.event).toBe('string')
                expect(env.event).toBe('post')
                expect(typeof env.eventMethod).toBe('string')
                expect(env.eventMethod).toBe('postRemoved')
                expect(typeof env.properAction).toBe('string')
                expect(env.properAction).toBe('remove')
                expect(env.connectedTo).toBe(posts[3].id)
                expect(typeof env.payload).toBe('string')
                expect(env.payload).toBe('')
            }
        })

        request(apolloServer)
        .post('/graphql')
        .send({ "query":`mutation{
            removeThisPost(postid: "${posts[3].id}"){
                postid, resultText
            }
            
        }`})
        .set('Authorization', createTokenToHeader(
            authorizTokenEncoder({ subj: user3.id})
        ))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)
            expect(typeof res.body.data).toBe('object')

            expect(res.body.data.removeThisPost.postid)
                .toBe(posts[3].id)
            expect(res.body.data.removeThisPost.resultText)
                .toBe('Your post has been removed!')
            done()
        })
    })
})

describe('Comments and sentiments mutations tests', ()=>{

    it('9 - User3 comments to post0, user0 have notify', (done)=>{
        const user3 = users[3]
    
        theWsOf0.on('message', (msg)=>{
            expect(typeof msg).toBe('string')
            const env = JSON.parse(msg)
            expect(env).not.toBe(null)
    
            if(env.eventMethod === 'commentCreated' && 
                env.event === 'post'){
                console.log('Mutation 9 notification sent!')
                notifyCounter++;
    
                expect(typeof env.event).toBe('string')
                expect(env.event).toBe('post')
                expect(typeof env.eventMethod).toBe('string')
                expect(env.eventMethod).toBe('commentCreated')
                expect(typeof env.properAction).toBe('string')
                expect(env.properAction).toBe('add')

                expect(typeof env.connectedTo).toBe('object')
                expect(env.connectedTo.parent).toBe(posts[2].id)
                expect(env.connectedTo.root).toBe(posts[2].id)

                expect(typeof env.payload).toBe('object')
                expect(typeof env.payload.commentid).toBe('string')
                expect(env.payload.owner).toBe(user3.id)
                expect(env.payload.content).toBe(otherComments[0].content)
            }
        })
    
        request(apolloServer)
        .post('/graphql')
        .send({ "query":`mutation{
            createCommentToHere(targeted: POST, id: "${posts[2].id}", 
                content: "${otherComments[0].content}"){
                commentid, owner{
                    id, username
                }, content
            }
        }`})
        .set('Authorization', createTokenToHeader(
            authorizTokenEncoder({ subj: user3.id})
        ))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)
            expect(typeof res.body.data).toBe('object')
    
            expect(typeof res.body.data.createCommentToHere.commentid)
                .toBe('string')
            expect(res.body.data.createCommentToHere.owner.id)
                .toBe(users[3].id)
            expect(res.body.data.createCommentToHere.content)
                .toBe(otherComments[0].content)
            
            comments.push({ id: res.body.data.createCommentToHere.commentid })
            done()
        })
    })

    it('10 - User3 comments comment3, user0 have a notify', (done)=>{
        const user3 = users[3]
    
        theWsOf0.on('message', (msg)=>{
            expect(typeof msg).toBe('string')
            const env = JSON.parse(msg)
            expect(env).not.toBe(null)
    
            if(env.eventMethod === 'commentCreated' &&
                env.event === 'comment'){
                console.log('Mutation 10 notification sent!')
                notifyCounter++;
    
                expect(typeof env.event).toBe('string')
                expect(env.event).toBe('comment')
                expect(typeof env.eventMethod).toBe('string')
                expect(env.eventMethod).toBe('commentCreated')
                expect(typeof env.properAction).toBe('string')
                expect(env.properAction).toBe('add')

                expect(typeof env.connectedTo).toBe('object')
                expect(env.connectedTo.parent).toBe(comments[3].id)
                expect(env.connectedTo.root).toBe(posts[2].id)

                expect(typeof env.payload).toBe('object')
    
                expect(typeof env.payload.commentid).toBe('string')
                expect(env.payload.owner).toBe(user3.id)
                expect(env.payload.content).toBe(otherComments[1].content)
            }
        })
    
        request(apolloServer)
        .post('/graphql')
        .send({ "query":`mutation{
            createCommentToHere(targeted: COMMENT, id: "${comments[3].id}", 
                content: "${otherComments[1].content}"){
                commentid, owner{
                    id, username
                }, content
            }
        }`})
        .set('Authorization', createTokenToHeader(
            authorizTokenEncoder({ subj: user3.id})
        ))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)
            expect(typeof res.body.data).toBe('object')
    
            expect(typeof res.body.data.createCommentToHere.commentid)
                .toBe('string')
            expect(res.body.data.createCommentToHere.owner.id)
                .toBe(users[3].id)
            expect(res.body.data.createCommentToHere.content)
                .toBe(otherComments[1].content)
            
            comments.push({ id: res.body.data.createCommentToHere.commentid })
            done()
        })
    })

    it('11 - User3 update comment1 to comment6, user0 have a notify', (done)=>{
        const user3 = users[3]
    
        theWsOf0.on('message', (msg)=>{
            expect(typeof msg).toBe('string')
            const env = JSON.parse(msg)
            expect(env).not.toBe(null)
    
            if(env.eventMethod === 'commentUpdated' &&
                env.event === 'comment'){
                console.log('Mutation 11 notification sent!')
                notifyCounter++;
    
                expect(typeof env.event).toBe('string')
                expect(env.event).toBe('comment')
                expect(typeof env.eventMethod).toBe('string')
                expect(env.eventMethod).toBe('commentUpdated')
                expect(typeof env.properAction).toBe('string')
                expect(env.properAction).toBe('update')

                expect(typeof env.connectedTo).toBe('object')
                expect(env.connectedTo.parent).toBe(comments[0].id)
                expect(env.connectedTo.root).toBe(posts[0].id)

                expect(typeof env.payload).toBe('object')
                expect(env.payload.commentid).toBe(comments[1].id)
                expect(typeof env.payload.updatedAt).toBe('string')
                expect(env.payload.content).toBe(otherComments[2].content)
            }
        })
    
        request(apolloServer)
        .post('/graphql')
        .send({ "query":`mutation{
            updateCommentContent(commentid: "${comments[1].id}", 
                content: "${otherComments[2].content}"){
                commentid, owner{
                    id, username
                }, content
            }
        }`})
        .set('Authorization', createTokenToHeader(
            authorizTokenEncoder({ subj: user3.id})
        ))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)
            expect(typeof res.body.data).toBe('object')
    
            expect(res.body.data.updateCommentContent.commentid)
                .toBe(comments[1].id)
            expect(res.body.data.updateCommentContent.owner.id)
                .toBe(users[3].id)
            expect(res.body.data.updateCommentContent.content)
                .toBe(otherComments[2].content)
            
            done()
        })
    })

    it('12 - User3 update comment1 of post0, user0 have a notify', (done)=>{
        const user3 = users[3]
    
        theWsOf0.on('message', (msg)=>{
            expect(typeof msg).toBe('string')
            const env = JSON.parse(msg)
            expect(env).not.toBe(null)

            if(env.eventMethod === 'commentUpdated' &&
                env.event === 'post'){
                console.log('Mutation 12 notification sent!')
                notifyCounter++;
    
                expect(typeof env.event).toBe('string')
                expect(env.event).toBe('post')
                expect(typeof env.eventMethod).toBe('string')
                expect(env.eventMethod).toBe('commentUpdated')
                expect(typeof env.properAction).toBe('string')
                expect(env.properAction).toBe('update')

                expect(typeof env.connectedTo).toBe('object')
                expect(env.connectedTo.parent).toBe(posts[0].id)
                expect(env.connectedTo.root).toBe(posts[0].id)

                expect(typeof env.payload).toBe('object')
    
                expect(env.payload.commentid).toBe(comments[2].id)
                expect(typeof env.payload.updatedAt).toBe('string')
                expect(env.payload.content).toBe(otherComments[3].content)
            }
        })
    
        request(apolloServer)
        .post('/graphql')
        .send({ "query":`mutation{
            updateCommentContent(commentid: "${comments[2].id}", 
                content: "${otherComments[3].content}"){
                commentid, owner{
                    id, username
                }, content
            }
        }`})
        .set('Authorization', createTokenToHeader(
            authorizTokenEncoder({ subj: user3.id})
        ))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)
            expect(typeof res.body.data).toBe('object')
    
            expect(res.body.data.updateCommentContent.commentid)
                .toBe(comments[2].id)
            expect(res.body.data.updateCommentContent.owner.id)
                .toBe(users[3].id)
            expect(res.body.data.updateCommentContent.content)
                .toBe(otherComments[3].content)
            
            done()
        })
    })

    it('13 - User3 delete comment4, user0 have a notify', (done)=>{
        const user3 = users[3]
    
        theWsOf0.on('message', (msg)=>{
            expect(typeof msg).toBe('string')
            const env = JSON.parse(msg)
            expect(env).not.toBe(null)

            if(env.eventMethod === 'commentDeleted' &&
                env.event === 'comment'){
                console.log('Mutation 13 notification sent!')
                notifyCounter++;
    
                expect(typeof env.event).toBe('string')
                expect(env.event).toBe('comment')
                expect(typeof env.eventMethod).toBe('string')
                expect(env.eventMethod).toBe('commentDeleted')
                expect(typeof env.properAction).toBe('string')
                expect(env.properAction).toBe('remove')

                expect(typeof env.connectedTo).toBe('object')
                expect(env.connectedTo.root).toBe(posts[2].id)
                expect(env.connectedTo.parent).toBe(comments[3].id)
                expect(typeof env.connectedTo.parentUpdate).toBe('string')

                expect(typeof env.payload).toBe('object')
                expect(env.payload.id).toBe(comments[4].id)
            }
        })
    
        request(apolloServer)
        .post('/graphql')
        .send({ "query":`mutation{
            deleteThisComment(targeted: COMMENT, id: "${comments[3].id}",
                commentid: "${comments[4].id}"){
                resultText, targetType, targetId, targetUpdate, id
            }
        }`})
        .set('Authorization', createTokenToHeader(
            authorizTokenEncoder({ subj: user3.id})
        ))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)
            expect(typeof res.body.data).toBe('object')
    
            expect(res.body.data.deleteThisComment.id)
                .toBe(comments[4].id)
            expect(res.body.data.deleteThisComment.targetType)
                .toBe('COMMENT')
            expect(res.body.data.deleteThisComment.targetId)
                .toBe(comments[3].id)
            expect(typeof res.body.data.deleteThisComment.targetUpdate)
                .toBe('string')
            expect(res.body.data.deleteThisComment.resultText)
                .toBe('Comment deletion done!')

            comments[4] = {}
            done()
        })
    })


    it('14 - User3 make sentiment2 to post4, user0 have a notify', (done)=>{
        const user3 = users[3]
    
        theWsOf0.on('message', (msg)=>{
            expect(typeof msg).toBe('string')
            const env = JSON.parse(msg)
            expect(env).not.toBe(null)

            if(env.eventMethod === 'opinionedAdded' &&
                env.event === 'post'){
                console.log('Mutation 14 notification sent!')
                notifyCounter++;
    
                expect(typeof env.event).toBe('string')
                expect(env.event).toBe('post')
                expect(typeof env.eventMethod).toBe('string')
                expect(env.eventMethod).toBe('opinionedAdded')
                expect(typeof env.properAction).toBe('string')
                expect(env.properAction).toBe('add')

                expect(typeof env.connectedTo).toBe('object')
                expect(env.connectedTo.root).toBe('')
                expect(env.connectedTo.parent).toBe(posts[4].id)
                expect(typeof env.connectedTo.parentUpdate).toBe('string')

                expect(typeof env.payload).toBe('object')
                expect(typeof env.payload.sentimentid).toBe('string')
                expect(env.payload.content).toBe(sentimentTestDatas[4].content)
                expect(env.payload.owner).toBe(users[3].id)
            }
        })
    
        request(apolloServer)
        .post('/graphql')
        .send({ "query":`mutation{
            createSentimentToHere(targeted: POST, id: "${posts[4].id}",
                content: ${sentimentTestDatas[4].content}){
                sentimentid, owner{
                    id, username
                }, content
            }
        }`})
        .set('Authorization', createTokenToHeader(
            authorizTokenEncoder({ subj: user3.id})
        ))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)
            expect(typeof res.body.data).toBe('object')
    
            expect(typeof res.body.data.createSentimentToHere.sentimentid)
                .toBe('string')
            expect(res.body.data.createSentimentToHere.content)
                .toBe(sentimentTestDatas[4].content)
            expect(res.body.data.createSentimentToHere.owner.id)
                .toBe(users[3].id)

            sentiments.push({ id: res.body.data.createSentimentToHere.sentimentid })
            done()
        })
    })

    it('15 - User3 make sentiment3 to comment5, user0 have a notify', (done)=>{
        const user3 = users[3]
    
        theWsOf0.on('message', (msg)=>{
            expect(typeof msg).toBe('string')
            const env = JSON.parse(msg)
            expect(env).not.toBe(null)

            if(env.eventMethod === 'opinionedAdded' &&
                env.event === 'comment'){
                console.log('Mutation 15 notification sent!')
                notifyCounter++;
    
                expect(typeof env.event).toBe('string')
                expect(env.event).toBe('comment')
                expect(typeof env.eventMethod).toBe('string')
                expect(env.eventMethod).toBe('opinionedAdded')
                expect(typeof env.properAction).toBe('string')
                expect(env.properAction).toBe('add')

                expect(typeof env.connectedTo).toBe('object')
                expect(env.connectedTo.root).toBe(posts[4].id)
                expect(env.connectedTo.parent).toBe(comments[5].id)
                expect(typeof env.connectedTo.parentUpdate).toBe('string')

                expect(typeof env.payload).toBe('object')
                expect(typeof env.payload.sentimentid).toBe('string')
                expect(env.payload.content).toBe(sentimentTestDatas[5].content)
                expect(env.payload.owner).toBe(users[3].id)
            }
        })
    
        request(apolloServer)
        .post('/graphql')
        .send({ "query":`mutation{
            createSentimentToHere(targeted: COMMENT, id: "${comments[5].id}",
                content: ${sentimentTestDatas[5].content}){
                sentimentid, owner{
                    id, username
                }, content
            }
        }`})
        .set('Authorization', createTokenToHeader(
            authorizTokenEncoder({ subj: user3.id})
        ))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)
            expect(typeof res.body.data).toBe('object')
    
            expect(typeof res.body.data.createSentimentToHere.sentimentid)
                .toBe('string')
            expect(res.body.data.createSentimentToHere.content)
                .toBe(sentimentTestDatas[5].content)
            expect(res.body.data.createSentimentToHere.owner.id)
                .toBe(users[3].id)

            sentiments.push({ id: res.body.data.createSentimentToHere.sentimentid })
            done()
        })
    })

    it('16 - User3 update a sentiment of post4, user0 have a notify', (done)=>{
        const user3 = users[3]
    
        theWsOf0.on('message', (msg)=>{
            expect(typeof msg).toBe('string')
            const env = JSON.parse(msg)
            expect(env).not.toBe(null)

            if(env.eventMethod === 'opinionedUpdated' &&
                env.event === 'post'){
                console.log('Mutation 16 notification sent!')
                notifyCounter++;
    
                expect(typeof env.event).toBe('string')
                expect(env.event).toBe('post')
                expect(typeof env.eventMethod).toBe('string')
                expect(env.eventMethod).toBe('opinionedUpdated')
                expect(typeof env.properAction).toBe('string')
                expect(env.properAction).toBe('update')

                expect(typeof env.connectedTo).toBe('object')
                expect(env.connectedTo.root).toBe('')
                expect(env.connectedTo.parent).toBe(posts[4].id)
                expect(typeof env.connectedTo.parentUpdate).toBe('string')

                expect(typeof env.payload).toBe('object')
                expect(env.payload.sentimentid).toBe(sentiments[0].id)
                expect(env.payload.content).toBe(sentimentTestDatas[6].content)
                expect(env.payload.owner).toBe(users[3].id)
            }
        })
    
        request(apolloServer)
        .post('/graphql')
        .send({ "query":`mutation{
            updateSentimentContent(targeted: POST, id: "${posts[4].id}",
                sentimentid: "${sentiments[0].id}", 
                content: ${sentimentTestDatas[6].content}){
                sentimentid, owner{
                    id, username
                }, content
            }
        }`})
        .set('Authorization', createTokenToHeader(
            authorizTokenEncoder({ subj: user3.id})
        ))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)
            expect(typeof res.body.data).toBe('object')
    
            expect(res.body.data.updateSentimentContent.sentimentid)
                .toBe(sentiments[0].id)
            expect(res.body.data.updateSentimentContent.content)
                .toBe(sentimentTestDatas[6].content)
            expect(res.body.data.updateSentimentContent.owner.id)
                .toBe(users[3].id)

            done()
        })
    })

    it('17 - User3 update a sentiment2 of comment5, user0 have a notify', (done)=>{
        const user3 = users[3]
    
        theWsOf0.on('message', (msg)=>{
            expect(typeof msg).toBe('string')
            const env = JSON.parse(msg)
            expect(env).not.toBe(null)

            if(env.eventMethod === 'opinionedUpdated' &&
                env.event === 'comment'){
                console.log('Mutation 17 notification sent!')
                notifyCounter++;
    
                expect(typeof env.event).toBe('string')
                expect(env.event).toBe('comment')
                expect(typeof env.eventMethod).toBe('string')
                expect(env.eventMethod).toBe('opinionedUpdated')
                expect(typeof env.properAction).toBe('string')
                expect(env.properAction).toBe('update')

                expect(typeof env.connectedTo).toBe('object')
                expect(env.connectedTo.root).toBe(posts[4].id)
                expect(env.connectedTo.parent).toBe(comments[5].id)
                expect(typeof env.connectedTo.parentUpdate).toBe('string')

                expect(typeof env.payload).toBe('object')
                expect(env.payload.sentimentid).toBe(sentiments[2].id)
                expect(env.payload.content).toBe(sentimentTestDatas[7].content)
                expect(env.payload.owner).toBe(users[3].id)
            }
        })
    
        request(apolloServer)
        .post('/graphql')
        .send({ "query":`mutation{
            updateSentimentContent(targeted: COMMENT, id: "${comments[5].id}",
                sentimentid: "${sentiments[2].id}", 
                content: ${sentimentTestDatas[7].content}){
                sentimentid, owner{
                    id, username
                }, content
            }
        }`})
        .set('Authorization', createTokenToHeader(
            authorizTokenEncoder({ subj: user3.id})
        ))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)
            expect(typeof res.body.data).toBe('object')
    
            expect(res.body.data.updateSentimentContent.sentimentid)
                .toBe(sentiments[2].id)
            expect(res.body.data.updateSentimentContent.content)
                .toBe(sentimentTestDatas[7].content)
            expect(res.body.data.updateSentimentContent.owner.id)
                .toBe(users[3].id)

            done()
        })
    })

    it('19 - User3 delete its sentiment3 on post3, user0 have a notofy', (done)=>{
        const user3 = users[3]
    
        theWsOf0.on('message', (msg)=>{
            expect(typeof msg).toBe('string')
            const env = JSON.parse(msg)
            expect(env).not.toBe(null)

            if(env.eventMethod === 'opinionRemoved' &&
                env.event === 'post'){
                console.log('Mutation 18 notification sent!')
                notifyCounter++;
    
                expect(typeof env.event).toBe('string')
                expect(env.event).toBe('post')
                expect(typeof env.eventMethod).toBe('string')
                expect(env.eventMethod).toBe('opinionRemoved')
                expect(typeof env.properAction).toBe('string')
                expect(env.properAction).toBe('remove')

                expect(typeof env.connectedTo).toBe('object')
                expect(env.connectedTo.root).toBe('')
                expect(env.connectedTo.parent).toBe(posts[4].id)
                expect(typeof env.connectedTo.parentUpdate).toBe('string')

                expect(typeof env.payload).toBe('object')
                expect(env.payload.id).toBe(sentiments[1].id)
            }
        })
    
        request(apolloServer)
        .post('/graphql')
        .send({ "query":`mutation{
            deleteThisSentiment(targeted: POST, id: "${posts[4].id}",
                sentimentid: "${sentiments[1].id}"){
                    resultText, targetType, targetId, targetUpdate, id
            }
        }`})
        .set('Authorization', createTokenToHeader(
            authorizTokenEncoder({ subj: user3.id})
        ))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)
            expect(typeof res.body.data).toBe('object')
    
            expect(res.body.data.deleteThisSentiment.targetType)
                .toBe('POST')
            expect(res.body.data.deleteThisSentiment.targetId)
                .toBe(posts[4].id)
            expect(res.body.data.deleteThisSentiment.resultText)
                .toBe('Sentiment deletion done!')
            expect(res.body.data.deleteThisSentiment.id)
                .toBe(sentiments[1].id)

            done()
        })
    })

    it('19 - User3 delete its sentiment3 on post3, user0 have a notofy', (done)=>{
        const user3 = users[3]
    
        theWsOf0.on('message', (msg)=>{
            expect(typeof msg).toBe('string')
            const env = JSON.parse(msg)
            expect(env).not.toBe(null)

            if(env.eventMethod === 'opinionRemoved' &&
                env.event === 'comment'){
                console.log('Mutation 19 notification sent!')
                notifyCounter++;
    
                expect(typeof env.event).toBe('string')
                expect(env.event).toBe('comment')
                expect(typeof env.eventMethod).toBe('string')
                expect(env.eventMethod).toBe('opinionRemoved')
                expect(typeof env.properAction).toBe('string')
                expect(env.properAction).toBe('remove')

                expect(typeof env.connectedTo).toBe('object')
                expect(env.connectedTo.root).toBe(posts[4].id)
                expect(env.connectedTo.parent).toBe(comments[5].id)
                expect(typeof env.connectedTo.parentUpdate).toBe('string')

                expect(typeof env.payload).toBe('object')
                expect(env.payload.id).toBe(sentiments[3].id)
            }
        })
    
        request(apolloServer)
        .post('/graphql')
        .send({ "query":`mutation{
            deleteThisSentiment(targeted: COMMENT, id: "${comments[5].id}",
                sentimentid: "${sentiments[3].id}"){
                    resultText, targetType, targetId, targetUpdate, id
            }
        }`})
        .set('Authorization', createTokenToHeader(
            authorizTokenEncoder({ subj: user3.id})
        ))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)
            expect(typeof res.body.data).toBe('object')
    
            expect(res.body.data.deleteThisSentiment.targetType)
                .toBe('COMMENT')
            expect(res.body.data.deleteThisSentiment.targetId)
                .toBe(comments[5].id)
            expect(res.body.data.deleteThisSentiment.resultText)
                .toBe('Sentiment deletion done!')
            expect(res.body.data.deleteThisSentiment.id)
                .toBe(sentiments[3].id)

            done()
        })
    })

})