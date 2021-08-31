const WebSocket = require('ws');
const request = require('supertest')

const { startTestingServer, exitTestingServer } = require('../server')
const ProfileModel = require('../models/ProfileModel')
const PostModel = require('../models/PostModel')
const { authorizTokenEncoder } = require('../utils/tokenManager')

const { userTestDatas, createTokenToHeader, postTestDatas1
  } = require('./helperToTestingServices')

let apolloServer = null
const users = []
const posts = []
const otherPosts = []

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
                    if(i < 4){
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
                    await usrs[3].save()
                    psts[2].owner = usrs[3]._id
                    psts[3].owner = usrs[3]._id
                    await psts[2].save()
                    await psts[3].save()
                    posts.push({ id: psts[2]._id.toString()})
                    posts.push({ id: psts[3]._id.toString()})

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
    user3 - post2 (content change at 7), post3 (deleted at 8)
*/

afterAll(()=>{

    expect(notifyCounter).toBe(8)
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
                console.log('Mutation 7 notification sent!')
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