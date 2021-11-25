const request = require('supertest')
const mongooseID = require('mongoose').Types.ObjectId

const ProfileModel = require('../models/ProfileModel')
const PostModel = require('../models/PostModel')
const CommentModel = require('../models/CommentModel')

const { startTestingServer, exitTestingServer } = require('../server')

const { userTestDatas, postTestDatas1, postTestDatas2, 
    commentTestDatas1, commentTestDatas2,
    sentimentTestDatas, createTokenToHeader  } 
    = require('./helperToTestingServices')
const { authorizTokenEncoder } = require('../utils/tokenManager')

                //begining tedstdata config:
let usersToTest = []    //4 users
let postIds = []        //6 posts + 2
let commentIds = null     //7 comments + 4
let sentimentIds = null   //8 sentiments
let theSrv = null

beforeAll((done)=>{
    const allUserEmailsHere = userTestDatas.map(item=>{return item.email})
    
    ProfileModel.deleteMany({email: allUserEmailsHere}, (error, report)=>{
        expect(error).toBe(null)
        
        const userToManageHere = []
        for(let i=0; i< 4; i++){ 
            userToManageHere.push(userTestDatas[i])
        }
        ProfileModel.insertMany(userToManageHere, async (err, usersDocs)=>{
            expect(err).toBe(null)

            for(const item of usersDocs){
                usersToTest.push( 
                    { userid: item._id.toString(), email: item.email, _id:item._id }
                )
            }

            usersDocs[0].friends.push(usersDocs[1]._id)
            usersDocs[0].friends.push(usersDocs[2]._id)
            await usersDocs[0].save()

            usersDocs[1].friends.push(usersDocs[0]._id)
            await usersDocs[1].save()
            usersDocs[2].friends.push(usersDocs[0]._id)
            usersDocs[2].friends.push(usersDocs[3]._id)
            await usersDocs[2].save()

            usersDocs[3].friends.push(usersDocs[2]._id)
            await usersDocs[3].save()

            const tempPost1 = postTestDatas1.map(item => { return item.content})
            const tempPost2 = postTestDatas2.map(item => { return item.content})
            PostModel.deleteMany({content: [...tempPost1, ...tempPost2]}, async (e1, r)=>{
                expect(e1).toBe(null)

                const tempComm1 = commentTestDatas1.map(item =>{ return item.content })
                const tempComm2 = commentTestDatas2.map(item =>{ return item.content })
                CommentModel.deleteMany({ content: [...tempComm1, ...tempComm2] }, async (e2, re)=>{
                    expect(e2).toBe(null)

                    theSrv = await startTestingServer(true)

                    PostModel.insertMany(postTestDatas1, (eObj, postObj)=>{
                        expect(eObj).toBe(null)
                        postIds = postObj.map(item=>{ return item._id.toString() })
    
                        CommentModel.insertMany(commentTestDatas1, async (eObj2, commObj)=>{
                            expect(eObj2).toBe(null)
    
                            commentIds = new Map()
                            sentimentIds = new Map()
                            //user0 -> post0 dedicatedTo user2 -> X
                            postObj[0].owner = usersDocs[0]._id
                            postObj[0].dedicatedTo = usersDocs[2]._id
                            await postObj[0].save()
                            //user0 -> post3 -> sentiment0
                            postObj[3].owner = usersDocs[0]._id
                            const sentimID0 = new mongooseID()
                            sentimentIds.set(0, sentimID0.toString())
                            postObj[3].sentiments.push({
                                _id: sentimID0,
                                owner: usersDocs[2]._id,
                                ...sentimentTestDatas[0]
                            })
                            await postObj[3].save()
                            usersDocs[0].myPosts.push({ 
                                postid: postObj[0]._id, createdAt: postObj[0].createdAt
                            })
                            usersDocs[0].myPosts.push({
                                postid: postObj[3]._id, createdAt: postObj[3].createdAt
                            })
                            await usersDocs[0].save()
    
                            //user1 -> post1 -> comment0
                            postObj[1].owner = usersDocs[1]._id
                            postObj[1].comments.push({ 
                                commentid: commObj[0]._id, 
                                createdAt: commObj[0].createdAt 
                            })
                            await postObj[1].save()
                            usersDocs[1].myPosts.push({
                                postid: postObj[1]._id, createdAt: postObj[1].createdAt
                            })
                            await usersDocs[1].save()
                            commentIds.set(commObj[0].content, commObj[0]._id.toString())
                            commObj[0].owner = usersDocs[0]._id
                            commObj[0].rootPost = postObj[1]._id
                            commObj[0].parentNode = postObj[1]._id
                            await commObj[0].save()
    
                            //user3 -> post2 -> comment2, comment3
                            postObj[2].owner = usersDocs[3]._id
                            postObj[2].comments.push({ 
                                commentid: commObj[2]._id, 
                                createdAt: commObj[2].createdAt 
                            })
                            postObj[2].comments.push({ 
                                commentid: commObj[3]._id, 
                                createdAt: commObj[3].createdAt
                            })
                            await postObj[2].save()
                            commentIds.set(commObj[2].content, commObj[2]._id.toString())
                            commentIds.set(commObj[3].content, commObj[3]._id.toString())
                            commObj[2].owner = usersDocs[1]._id
                            commObj[2].rootPost = postObj[2]._id
                            commObj[2].parentNode = postObj[2]._id
                            commObj[3].owner = usersDocs[1]._id
                            commObj[3].rootPost = postObj[2]._id
                            commObj[3].parentNode = postObj[2]._id
                            await commObj[2].save()
                            await commObj[3].save()
                            //user3 -> post5 -> X
                            postObj[5].owner = usersDocs[3]._id
                            await postObj[5].save()
                            postObj[6].owner = usersDocs[3]._id
                            await postObj[6].save()
                            usersDocs[3].myPosts.push({
                                postid: postObj[2]._id, createdAt: postObj[2].createdAt
                            })
                            usersDocs[3].myPosts.push({
                                postid: postObj[5]._id, createdAt: postObj[5].createdAt
                            })
                            usersDocs[3].myPosts.push({
                                postid: postObj[6]._id, createdAt: postObj[6].createdAt
                            })
                            await usersDocs[3].save()
    
    
                            //user2 -> post4 -> sentiment1, sentiment2, comment1
                            postObj[4].owner = usersDocs[2]._id
                            postObj[4].comments.push({ 
                                commentid: commObj[1]._id, 
                                createdAt: commObj[1].createdAt 
                            })
                            commentIds.set(commObj[1].content, commObj[1]._id.toString())
                            commObj[1].owner = usersDocs[0]._id
                            commObj[1].rootPost = postObj[4]._id
                            commObj[1].parentNode = postObj[4]._id
                            await commObj[1].save()
                            const sentimID1 = new mongooseID()
                            sentimentIds.set(1, sentimID1.toString())
                            postObj[4].sentiments.push({
                                _id: sentimID1,
                                owner: usersDocs[0]._id,
                                ...sentimentTestDatas[1]
                            })
                            const sentimID2 = new mongooseID()
                            sentimentIds.set(2, sentimID2.toString())
                            postObj[4].sentiments.push({
                                _id:  sentimID2,
                                owner: usersDocs[0]._id,
                                ...sentimentTestDatas[2]
                            })
                            await postObj[4].save()
                            usersDocs[2].myPosts.push({
                                postid: postObj[4]._id, createdAt: postObj[4].createdAt
                            })
                            await usersDocs[2].save()
                            
                            
                            commObj[3].comments.push({
                                commentid: commObj[4]._id,
                                createdAt: commObj[4].createdAt
                            })
                            await commObj[3].save()
                            commObj[4].comments.push({ 
                                commentid: commObj[5]._id,
                                createdAt: commObj[5].createdAt
                            })
                            commObj[4].owner = usersDocs[0]._id
                            commObj[4].rootPost = postObj[2]._id
                            commObj[4].parentNode = commObj[3]._id
                            await commObj[4].save()
                            commentIds.set(commObj[4].content, commObj[4]._id.toString())

                            commObj[5].comments.push({ 
                                commentid: commObj[6]._id, 
                                createdAt: commObj[6].createdAt
                            })
                            commObj[5].owner = usersDocs[1]._id
                            commObj[5].rootPost = postObj[2]._id
                            commObj[5].parentNode = commObj[4]._id
                            await commObj[5].save()
                            commentIds.set(commObj[5].content, commObj[5]._id.toString())

                            commObj[6].owner = usersDocs[0]._id
                            commObj[6].rootPost = postObj[2]._id
                            commObj[6].parentNode = commObj[5]._id
                            await commObj[6].save()
                            commentIds.set(commObj[6].content, commObj[6]._id.toString())
    
                            done()
                        })
                    })
                })



                /*
                friends:
                    user0 - user1
                        - user2
                    user 3 - user2

                posts:
                    user0 -> post0 dedicatedTo user2 -> X
                          -> post3 -> sentiment0 (u2)
                    user1 -> post1 -> comment0 (u0)
                        |-> mut. +post7  |-> mut. updated content and dedication user0
                    user2 -> post4 -> sentiment1 (u1), sentiment2 (u0), comment1 (u0)
                        |-> mut. +post8 dedicatedTo user0
                    user3 -> post2 -> comment2** (u1), comment3* (u1)
                          -> post5 -> X
                          -> post6
                comments:
                            comment3* -> comment4 (u0) -> comment5 (u1) -> comment6 (u0)
                            mut.1 = post5 -> +comment7 (u2)
                            mut.2 = comment2** -> +comment8 (u2)
                            mut.3 = post2 -> +sentiment3 (u2)
                            mut.4 = comment3* => +sentiment4 (u2)

                            mut.5 comment2 update = content of comment9 (as u1 !)
                            mut.6 sentiment3 update of post2 = content of sentiment5 (as u2 !)
                            mut.7 sentiment4 update of comment3* = content of sentiment6 (as u2 !)

                            mut.8 delete comment4 from commet3*
                            mut.9 delete comment1 of post4 at user2
                            mut.10 delete sentiment4 of comment3 at user3
                            mut.11 delete sentiment2 of post4 at user2
                 */

            })
        })
    })
})


afterAll((done)=>{
    setTimeout( async ()=>{
        await exitTestingServer()
        done()
    }, 500)
})

describe('GQL Post query processes', ()=>{
    
    it('Fetch in the post of user1', (done)=>{
        const actualUser = usersToTest[1];
        const token = authorizTokenEncoder({subj: actualUser.userid, 
            email: actualUser.email})

        request(theSrv)
        .post('/graphql')
        .send({query: `query{
            listOfMySentPosts{
                postid, owner{
                    userid, username, mutualFriendCount, relation
                }, 
                dedicatedTo{
                    userid, username, mutualFriendCount, relation
                }, 
                content, comments,
                sentiments {
                    sentimentid, owner{
                        userid, username, mutualFriendCount, relation
                    }, content
                }
            }
        }`})
        .set('Accept', 'application/json')
        .set('Authorization', createTokenToHeader(token))
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(typeof res.body).toBe('object')
            expect(res.body.errors).toBe(undefined)

            expect(res.body.data.listOfMySentPosts).not.toBe(undefined)
            expect(res.body.data.listOfMySentPosts[0].postid)
                .toBe(postIds[1])
            expect(res.body.data.listOfMySentPosts[0].content)
                .toBe('Post content 1')
            expect(res.body.data.listOfMySentPosts[0].owner.userid)
                .toBe(actualUser.userid)
            expect(res.body.data.listOfMySentPosts[0].comments).toBe(1)
            expect(res.body.data.listOfMySentPosts[0].sentiments).toHaveLength(0)

            done()
        })
    })
    it('Fetch in the posts with filtering to the earlier post0', (done)=>{
        const actualUser = usersToTest[3];
        const token = authorizTokenEncoder(
            {subj: actualUser.userid, email: actualUser.email }
        )
        request(theSrv)
        .post('/graphql')
        .send({query: `query{
            listOfMySentPosts(dating: "${new Date('30 May 2020 23:04 UTC').toISOString()}", 
                amount: 1){
                postid, owner{
                    userid, username, mutualFriendCount, relation
                }, 
                dedicatedTo{
                    userid, username, mutualFriendCount, relation
                }, 
                content, comments, 
                sentiments {
                    sentimentid, owner{
                        userid, username, mutualFriendCount, relation
                    }, content
                }
            }
        }`})
        .set('Authorization', createTokenToHeader(token))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(typeof res.body).toBe('object')
            expect(res.body.errors).toBe(undefined)

            expect(res.body.data.listOfMySentPosts).not.toBe(undefined)
            expect(res.body.data.listOfMySentPosts).toHaveLength(1)

            expect(res.body.data.listOfMySentPosts[0].content)
                .toBe('Post content 5')
            expect(res.body.data.listOfMySentPosts[0].postid)
                .toBe(postIds[5])
            expect(res.body.data.listOfMySentPosts[0].owner.userid)
                .toBe(usersToTest[3].userid)
            expect(res.body.data.listOfMySentPosts[0].dedicatedTo)
                .toBe(null)
            expect(res.body.data.listOfMySentPosts[0].comments).toBe(0)
            expect(res.body.data.listOfMySentPosts[0].sentiments).toHaveLength(0)

            done()
        })
    })

    it('Fetch in the posts of user2, dedicated to it', (done)=>{
        const actualUser = usersToTest[2];
        const token = authorizTokenEncoder(
            {subj: actualUser.userid, email: actualUser.email }
        )
        request(theSrv)
        .post('/graphql')
        .send({query: `query{
            listOfMyRecievedPosts{
                postid, owner{
                    userid, username, mutualFriendCount, relation
                }, 
                dedicatedTo{
                    userid, username, mutualFriendCount, relation
                }, 
                content, comments, 
                sentiments {
                    sentimentid, owner{
                        userid, username, mutualFriendCount, relation
                    }, content
                }
            }
        }`})
        .set('Authorization', createTokenToHeader(token))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(typeof res.body).toBe('object')
            expect(res.body.errors).toBe(undefined)

            expect(res.body.data.listOfMyRecievedPosts).not.toBe(undefined)
            expect(res.body.data.listOfMyRecievedPosts).toHaveLength(1)

            expect(res.body.data.listOfMyRecievedPosts[0].content)
                .toBe('Post content 0')
            expect(res.body.data.listOfMyRecievedPosts[0].postid)
                .toBe(postIds[0])
            expect(res.body.data.listOfMyRecievedPosts[0].owner.userid)
                .toBe(usersToTest[0].userid)
            expect(res.body.data.listOfMyRecievedPosts[0].dedicatedTo.userid)
                .toBe(actualUser.userid)
            expect(res.body.data.listOfMyRecievedPosts[0].comments).toBe(0)
            expect(res.body.data.listOfMyRecievedPosts[0].sentiments).toHaveLength(0)

            done()
        })
    })
    it('Fetch in the posts of user2, dedicated to it, with filtering', (done)=>{
        const actualUser = usersToTest[2];
        const dating = new Date('14 April 2021 07:11 UTC').toISOString()
        const token = authorizTokenEncoder(
            {subj: actualUser.userid, email: actualUser.email }
        )
        request(theSrv)
        .post('/graphql')
        .send({query: `query{
            listOfMyRecievedPosts(dating: "${dating}"){
                postid, owner{
                    userid, username, mutualFriendCount, relation
                }, 
                dedicatedTo{
                    userid, username, mutualFriendCount, relation
                }, 
                content, comments, 
                sentiments {
                    sentimentid, owner{
                        userid, username, mutualFriendCount, relation
                    }, content
                }
            }
        }`})
        .set('Authorization', createTokenToHeader(token))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(typeof res.body).toBe('object')
            expect(res.body.errors).toBe(undefined)

            expect(res.body.data.listOfMyRecievedPosts).not.toBe(undefined)
            expect(res.body.data.listOfMyRecievedPosts).toHaveLength(1)

            expect(res.body.data.listOfMyRecievedPosts[0].content)
                .toBe('Post content 0')
            expect(res.body.data.listOfMyRecievedPosts[0].postid)
                .toBe(postIds[0])
            expect(res.body.data.listOfMyRecievedPosts[0].owner.userid)
                .toBe(usersToTest[0].userid)
            expect(res.body.data.listOfMyRecievedPosts[0].dedicatedTo.userid)
                .toBe(actualUser.userid)
            expect(res.body.data.listOfMyRecievedPosts[0].comments).toBe(0)
            expect(res.body.data.listOfMyRecievedPosts[0].sentiments).toHaveLength(0)

            done()
        })
    })
  

    it('Fetch in all the posts of user0', (done)=>{

        const token = authorizTokenEncoder({subj: usersToTest[0].userid, 
            email: usersToTest[0].email })
        request(theSrv)
        .post('/graphql')
        .send({query: `query{
            listOfAllPosts{
                postid, owner{
                    userid, username, mutualFriendCount, relation
                }, 
                dedicatedTo{
                    userid, username, mutualFriendCount, relation
                }, 
                content, comments, sentiments{
                    sentimentid, owner{
                        userid, username, mutualFriendCount, relation
                    }, content
                }, createdAt, updatedAt
            }
        }`})
        .set('Authorization', createTokenToHeader(token))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(typeof res.body).toBe('object')
            expect(res.body.errors).toBe(undefined)
            expect(res.body.data.listOfAllPosts).toHaveLength(4)

            expect(res.body.data.listOfAllPosts[0].content)
            .toBe('Post content 1')
            expect(res.body.data.listOfAllPosts[0].postid)
            .toBe(postIds[1])
            expect(res.body.data.listOfAllPosts[0].owner.userid)
            .toBe(usersToTest[1].userid)
            expect(res.body.data.listOfAllPosts[0].comments).toBe(1)
            expect(res.body.data.listOfAllPosts[0].sentiments).toHaveLength(0)

            expect(res.body.data.listOfAllPosts[1].content)
                .toBe('Post content 3')
            expect(res.body.data.listOfAllPosts[1].postid)
                .toBe(postIds[3])
            expect(res.body.data.listOfAllPosts[1].owner.userid)
                .toBe(usersToTest[0].userid)
            expect(res.body.data.listOfAllPosts[1].comments).toBe(0)

            expect(res.body.data.listOfAllPosts[1].sentiments).toHaveLength(1)
            expect(res.body.data.listOfAllPosts[1].sentiments[0].sentimentid)
                .toBe(sentimentIds.get(0))
            expect(res.body.data.listOfAllPosts[1].sentiments[0].owner.userid)
                .toBe(usersToTest[2].userid)
            expect(res.body.data.listOfAllPosts[1].sentiments[0].owner.relation)
                .toBe('FRIEND')
            expect(res.body.data.listOfAllPosts[1].sentiments[0].content)
                .toBe('LIKE')

            expect(res.body.data.listOfAllPosts[2].content).toBe('Post content 0')
            expect(res.body.data.listOfAllPosts[2].postid)
                .toBe(postIds[0])
            expect(res.body.data.listOfAllPosts[2].owner.userid)
                .toBe(usersToTest[0].userid)
            expect(res.body.data.listOfAllPosts[2].dedicatedTo.userid)
                .toBe(usersToTest[2].userid)
            expect(res.body.data.listOfAllPosts[2].comments).toBe(0)
            expect(res.body.data.listOfAllPosts[2].sentiments).toHaveLength(0)
            
            expect(res.body.data.listOfAllPosts[3].content)
                .toBe('Post content 4')
            expect(res.body.data.listOfAllPosts[3].postid)
                .toBe(postIds[4])
            expect(res.body.data.listOfAllPosts[3].owner.userid)
                .toBe(usersToTest[2].userid)
            expect(res.body.data.listOfAllPosts[3].comments).toBe(1)
            expect(res.body.data.listOfAllPosts[3].sentiments).toHaveLength(2)
            expect(res.body.data.listOfAllPosts[3].sentiments[0].sentimentid)
                .toBe(sentimentIds.get(1))
            expect(res.body.data.listOfAllPosts[3].sentiments[1].sentimentid)
                .toBe(sentimentIds.get(2))

            done()
        })
    })

    it('Fetch in all the posts of user0, filtering to date', (done)=>{
        const dating = new Date('14 November 2020 07:11 UTC').toISOString()
        const token = authorizTokenEncoder({subj: usersToTest[0].userid, 
            email: usersToTest[0].email })
        request(theSrv)
        .post('/graphql')
        .send({query: `query{
            listOfAllPosts(dating: "${dating}" ){
                postid, owner{
                    userid, username, mutualFriendCount, relation
                }, 
                dedicatedTo{
                    userid, username, mutualFriendCount, relation
                }, 
                content, comments, sentiments{
                    sentimentid, owner{
                        userid, username, mutualFriendCount, relation
                    }, content
                }, createdAt, updatedAt
            }
        }`})
        .set('Authorization', createTokenToHeader(token))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(typeof res.body).toBe('object')
            expect(res.body.errors).toBe(undefined)
            expect(res.body.data.listOfAllPosts).toHaveLength(3)

            expect(res.body.data.listOfAllPosts[0].content)
                .toBe('Post content 3')
            expect(res.body.data.listOfAllPosts[0].postid)
                .toBe(postIds[3])
            expect(res.body.data.listOfAllPosts[0].owner.userid)
                .toBe(usersToTest[0].userid)
            expect(res.body.data.listOfAllPosts[0].comments).toBe(0)

            expect(res.body.data.listOfAllPosts[0].sentiments).toHaveLength(1)
            expect(res.body.data.listOfAllPosts[0].sentiments[0].sentimentid)
                .toBe(sentimentIds.get(0))
            expect(res.body.data.listOfAllPosts[0].sentiments[0].owner.userid)
                .toBe(usersToTest[2].userid)
            expect(res.body.data.listOfAllPosts[0].sentiments[0].owner.relation)
                .toBe('FRIEND')
            expect(res.body.data.listOfAllPosts[0].sentiments[0].content)
                .toBe('LIKE')

    
            expect(res.body.data.listOfAllPosts[1].content).toBe('Post content 0')
            expect(res.body.data.listOfAllPosts[1].postid)
                .toBe(postIds[0])
            expect(res.body.data.listOfAllPosts[1].owner.userid)
                .toBe(usersToTest[0].userid)
            expect(res.body.data.listOfAllPosts[1].dedicatedTo.userid)
                .toBe(usersToTest[2].userid)
            expect(res.body.data.listOfAllPosts[1].comments).toBe(0)
            expect(res.body.data.listOfAllPosts[1].sentiments).toHaveLength(0)
            
            expect(res.body.data.listOfAllPosts[2].content)
                .toBe('Post content 4')
            expect(res.body.data.listOfAllPosts[2].postid)
                .toBe(postIds[4])
            expect(res.body.data.listOfAllPosts[2].owner.userid)
                .toBe(usersToTest[2].userid)
            expect(res.body.data.listOfAllPosts[2].comments).toBe(1)
            expect(res.body.data.listOfAllPosts[2].sentiments).toHaveLength(2)
            expect(res.body.data.listOfAllPosts[2].sentiments[0].sentimentid)
                .toBe(sentimentIds.get(1))
            expect(res.body.data.listOfAllPosts[2].sentiments[1].sentimentid)
                .toBe(sentimentIds.get(2))

            done()
        })
    })
})

describe('GQL Post mutation processes', ()=>{

    it('Saving new post at user1, no addresse', (done)=>{
        const newContent = postTestDatas2[0].content
        const token = authorizTokenEncoder({subj: usersToTest[1].userid, 
            email: usersToTest[1].email })
        request(theSrv)
        .post('/graphql')
        .send({query: `mutation{
            makeAPost(content: "${newContent}"){
                postid, owner{
                    userid, username, mutualFriendCount, relation
                }, 
                dedicatedTo{
                    userid, username, mutualFriendCount, relation
                }, 
                content, comments, sentiments{
                    sentimentid, owner{
                        userid, username, mutualFriendCount, relation
                    }
                }
            }
        }`})
        .set('Authorization', createTokenToHeader(token))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(typeof res.body).toBe('object')
            expect(res.body.errors).toBe(undefined)
            expect(res.body.data.makeAPost).not.toBe(undefined)
            expect(res.body.data.makeAPost.content)
                .toBe(newContent)
            PostModel.findOne({ content: newContent}, (e,d)=>{
                expect(e).toBe(null)

                expect(res.body.data.makeAPost.postid)
                    .toBe(d._id.toString())
                expect(res.body.data.makeAPost.owner.userid)
                    .toBe(usersToTest[1].userid)
                expect(res.body.data.makeAPost.dedicatedTo)
                    .toBe(null)
                done()
            })

        })
    })
    it('Saving new post at user1, with addresse', (done)=>{
        const newContent = postTestDatas2[1].content
        const token = authorizTokenEncoder({subj: usersToTest[2].userid, 
            email: usersToTest[2].email })
        request(theSrv)
        .post('/graphql')
        .send({query: `mutation{
            makeAPost(content: "${newContent}", 
                dedication: "${usersToTest[0].userid}"){
                postid, owner{
                    userid, username, mutualFriendCount, relation
                }, 
                dedicatedTo{
                    userid, username, mutualFriendCount, relation
                }, 
                content, comments, sentiments{
                    sentimentid, owner{
                        userid, username, mutualFriendCount, relation
                    }
                }
            }
        }`})
        .set('Authorization', createTokenToHeader(token))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(typeof res.body).toBe('object')
            expect(res.body.errors).toBe(undefined)
            expect(res.body.data.makeAPost).not.toBe(undefined)
            expect(res.body.data.makeAPost.content)
                .toBe(newContent)
            PostModel.findOne({ content: newContent}, (e,d)=>{
                expect(e).toBe(null)

                expect(res.body.data.makeAPost.postid)
                    .toBe(d._id.toString())
                expect(res.body.data.makeAPost.owner.userid)
                    .toBe(usersToTest[2].userid)
                expect(res.body.data.makeAPost.dedicatedTo.userid)
                    .toBe(usersToTest[0].userid)
                done()
            })

        })
    })

    it('Created post updating at user1 of post6', (done)=>{
        const oldContent = postTestDatas2[0].content
        const newContent = postTestDatas2[2].content
        const token = authorizTokenEncoder({subj: usersToTest[1].userid, 
            email: usersToTest[1].email })
        PostModel.findOne({content: oldContent}, (e, d)=>{
            expect(e).toBe(null)
            expect(d).not.toBe(null)
            const postidToChange = d._id.toString()

            request(theSrv)
            .post('/graphql')
            .send({query: `mutation{
                updateThisPost(postid: "${postidToChange}",
                    newcontent: "${newContent}", 
                    newdedication: "${usersToTest[0].userid}"){
                        postid, owner{
                            userid, username, mutualFriendCount, relation
                        }, 
                        dedicatedTo{
                            userid, username, mutualFriendCount, relation
                        }, 
                        content, comments, sentiments{
                            sentimentid, owner{
                                userid, username, mutualFriendCount, relation
                            }
                        }
                }
            }`})
            .set('Authorization', createTokenToHeader(token))
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)
                expect(typeof res.body).toBe('object')
                expect(res.body.errors).toBe(undefined)
                expect(res.body.data.updateThisPost).not.toBe(undefined)
                expect(res.body.data.updateThisPost.content)
                    .toBe(newContent)
                expect(res.body.data.updateThisPost.postid)
                    .toBe(postidToChange)

                PostModel.findOne({ content: newContent}, (e,d)=>{
                    expect(e).toBe(null)

                    expect(res.body.data.updateThisPost.postid)
                        .toBe(d._id.toString())
                    expect(res.body.data.updateThisPost.owner.userid)
                        .toBe(usersToTest[1].userid)
                    expect(res.body.data.updateThisPost.dedicatedTo.userid)
                        .toBe(usersToTest[0].userid)
                    done()
                
                })
            })
        })
    })
    it('Delete a post at user3 of post6', (done)=>{
        const targetContent = postTestDatas1[6].content
        PostModel.findOne({content: targetContent}, (e, d)=>{
            expect(e).toBe(null)
            expect(d).not.toBe(null)
            const targetDelId = d._id.toString()

            const token = authorizTokenEncoder({subj: usersToTest[3].userid,
                email: usersToTest[3].email })
            request(theSrv)
            .post('/graphql')
            .send({query: `mutation{
                removeThisPost(postid: "${targetDelId}"){
                    resultText, postid
                }
            }`})
            .set('Accept', 'application/json')
            .set('Authorization', createTokenToHeader(token))
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)
                expect(res.body.errors).toBe(undefined)
                expect(res.body.data.removeThisPost).not.toBe(undefined)
                
                expect(res.body.data.removeThisPost.postid)
                    .toBe(targetDelId)
                expect(res.body.data.removeThisPost.resultText)
                    .toBe('Your post has been removed!')

                PostModel.findById(targetDelId, (error, result)=>{
                    expect(error).toBe(null)
                    expect(result).toBe(null)

                    done()
                })
            })

        })
    })
})

describe('GQL Comments query processes', ()=>{

    it('Fetch in some comment from post2 with user2', (done)=>{
        const post2ID = postIds[2]
        PostModel.findById(post2ID, (e, d)=>{
            expect(e).toBe(null)
            expect(d).not.toBe(null)
            expect(d.comments).toHaveLength(2)

            const twoCommentID = d.comments.map(item=>{ return item.commentid.toString() })
            const thePostID = d._id.toString()
            const token = authorizTokenEncoder({subj: usersToTest[2].userid,
                email: usersToTest[2].email })
    
            request(theSrv)
            .post('/graphql')
            .send({query: `query{
                listOfTheseComments(targeted: POST, id: "${thePostID}"){
                    commentid, owner{
                        userid, username, relation, mutualFriendCount
                    }, content, sentiments {
                        sentimentid, owner{
                            userid, username, relation, mutualFriendCount
                        }, content
                    }, comments
                }
            }`})
            .set('Accept', 'application/json')
            .set('Authorization', createTokenToHeader(token))
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)
                expect(res.body.errors).toBe(undefined)
                expect(typeof res.body.data.listOfTheseComments).toBe('object')
                expect(res.body.data.listOfTheseComments).toHaveLength(2)

                expect(res.body.data.listOfTheseComments[0].commentid)
                    .toBe(twoCommentID[0])
                expect(res.body.data.listOfTheseComments[0].content)
                    .toBe('Commenting 2')
                expect(res.body.data.listOfTheseComments[0].comments)
                    .toBe(0)

                expect(res.body.data.listOfTheseComments[1].commentid)
                    .toBe(twoCommentID[1])
                expect(res.body.data.listOfTheseComments[1].content)
                    .toBe('Commenting 3')
                expect(res.body.data.listOfTheseComments[1].comments)
                    .toBe(1)
                done()
            })
        })
    })

    it('Fetch in some comment from post2 with user2 - with filtering', (done)=>{
        const post2ID = postIds[2]
        PostModel.findById(post2ID, (e, d)=>{
            expect(e).toBe(null)
            expect(d).not.toBe(null)
            expect(d.comments).toHaveLength(2)

            const twoCommentID = d.comments.map(item=>{ return item.commentid.toString() })
            const thePostID = d._id.toString()
            const token = authorizTokenEncoder({subj: usersToTest[2].userid,
                email: usersToTest[2].email })
    
            request(theSrv)
            .post('/graphql')
            .send({query: `query{
                listOfTheseComments(targeted: POST, id: "${thePostID}", amount: 1){
                    commentid, owner{
                        userid, username, relation, mutualFriendCount
                    }, content, sentiments {
                        sentimentid, owner{
                            userid, username, relation, mutualFriendCount
                        }, content
                    }, comments
                }
            }`})
            .set('Accept', 'application/json')
            .set('Authorization', createTokenToHeader(token))
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)
                expect(res.body.errors).toBe(undefined)
                expect(typeof res.body.data.listOfTheseComments).toBe('object')
                expect(res.body.data.listOfTheseComments).toHaveLength(1)

                expect(res.body.data.listOfTheseComments[0].commentid)
                    .toBe(twoCommentID[0])
                expect(res.body.data.listOfTheseComments[0].content)
                    .toBe('Commenting 2')
                expect(res.body.data.listOfTheseComments[0].comments)
                    .toBe(0)

                done()
            })
        })
    })
})

describe('GQL Comments mutation processes', ()=>{
    it('Mutation 1, create a comment to post5 at user 3', (done)=>{
        const post5ID = postIds[5]
        PostModel.findById(post5ID, (e1, d1)=>{
            expect(e1).toBe(null)
            expect(d1).not.toBe(null)
            expect(d1.comments).toHaveLength(0)

            const thePostID = d1._id.toString()

            const newCommentContent = commentTestDatas2[0].content
            const token = authorizTokenEncoder({subj: usersToTest[2].userid,
                email: usersToTest[2].email })

            request(theSrv)
            .post('/graphql')
            .send({query: `mutation{
                createCommentToHere(targeted: POST, id: "${thePostID}"
                    content: "${newCommentContent}"){
                    commentid, owner{
                        userid, username, relation, mutualFriendCount
                    }, content, sentiments {
                        sentimentid, owner{
                            userid, username, relation, mutualFriendCount
                        }, content
                    }, comments
                }
            }`})
            .set('Accept', 'application/json')
            .set('Authorization', createTokenToHeader(token))
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)
                expect(res.body.errors).toBe(undefined)
                expect(typeof res.body.data.createCommentToHere).toBe('object')
                expect(res.body.data.createCommentToHere.content)
                    .toBe(newCommentContent)
                expect(res.body.data.createCommentToHere.owner.userid)
                    .toBe(usersToTest[2].userid)
                expect(res.body.data.createCommentToHere.comments).toBe(0)

                PostModel.findById(post5ID, (e2, d2)=>{
                    expect(e2).toBe(null)
                    expect(d2).not.toBe(null)
                    expect(d2.comments).toHaveLength(1)

                    expect(d2.comments[0].commentid.toString())
                        .toBe(res.body.data.createCommentToHere.commentid)
                    commentIds.set(newCommentContent, d2.comments[0].commentid.toString())
                    done()
                })
            })
        })
    })
    it('Mutation 2, create a comment to comment2 at post5', (done)=>{
        const comm2ID = commentIds.get('Commenting 2')
        CommentModel.findById(comm2ID, (e1, d1)=>{
            expect(e1).toBe(null)
            expect(d1).not.toBe(null)
            expect(d1.comments).toHaveLength(0)

            const theCommID = d1._id.toString()

            const newCommentContent = commentTestDatas2[1].content
            const token = authorizTokenEncoder({subj: usersToTest[2].userid,
                email: usersToTest[2].email })

            request(theSrv)
            .post('/graphql')
            .send({query: `mutation{
                createCommentToHere(targeted: COMMENT, id: "${theCommID}"
                    content: "${newCommentContent}"){
                    commentid, owner{
                        userid, username, relation, mutualFriendCount
                    }, content, sentiments {
                        sentimentid, owner{
                            userid, username, relation, mutualFriendCount
                        }, content
                    }, comments
                }
            }`})
            .set('Accept', 'application/json')
            .set('Authorization', createTokenToHeader(token))
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)
                expect(res.body.errors).toBe(undefined)

                expect(typeof res.body.data.createCommentToHere).toBe('object')
                expect(res.body.data.createCommentToHere.content)
                    .toBe(newCommentContent)
                expect(res.body.data.createCommentToHere.owner.userid)
                    .toBe(usersToTest[2].userid)
                expect(res.body.data.createCommentToHere.comments).toBe(0)

                CommentModel.findById(comm2ID, (e2, d2)=>{
                    expect(e2).toBe(null)
                    expect(d2).not.toBe(null)

                    expect(d2.comments).toHaveLength(1)
                    expect(d2.comments[0].commentid.toString())
                        .toBe(res.body.data.createCommentToHere.commentid)
                    commentIds.set(d2.content, d2._id.toString())
                    done()
                })
            })
        })
    })


    it('Mutation 3, create a sentiment to post2 at user3', (done)=>{
        const post2ID = postIds[2]
        PostModel.findById(post2ID, (e1, d1)=>{
            expect(e1).toBe(null)
            expect(d1).not.toBe(null)
            expect(d1.sentiments).toHaveLength(0)

            const thePostID = d1._id.toString()

            const newSentimentContent = sentimentTestDatas[3].content
            const token = authorizTokenEncoder({subj: usersToTest[2].userid,
                email: usersToTest[2].email })

            request(theSrv)
            .post('/graphql')
            .send({query: `mutation{
                createSentimentToHere(targeted: POST, id: "${thePostID}"
                    content: ${newSentimentContent}){
                        sentimentid, owner{
                            userid, username, relation, mutualFriendCount
                    }, content
                }
            }`})
            .set('Accept', 'application/json')
            .set('Authorization', createTokenToHeader(token))
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)
                expect(res.body.errors).toBe(undefined)
                expect(typeof res.body.data.createSentimentToHere).toBe('object')
                expect(res.body.data.createSentimentToHere.content)
                    .toBe(newSentimentContent)
                expect(res.body.data.createSentimentToHere.owner.userid)
                    .toBe(usersToTest[2].userid)

                PostModel.findById(post2ID, (e2, d2)=>{
                    expect(e2).toBe(null)
                    expect(d2).not.toBe(null)
                    expect(d2.sentiments).toHaveLength(1)

                    expect(d2.sentiments[0]._id.toString())
                        .toBe(res.body.data.createSentimentToHere.sentimentid)
                    sentimentIds.set(3, d2.sentiments[0]._id.toString())
                    done()
                })
            })
        })

    })

    it('Mutation 4, create a sentiment to comment3 (of post2) at user3', (done)=>{
        const comm3ID = commentIds.get('Commenting 3')
        CommentModel.findById(comm3ID, (e1, d1)=>{
            expect(e1).toBe(null)
            expect(d1).not.toBe(null)
            expect(d1.sentiments).toHaveLength(0)

            const theCommID = d1._id.toString()

            const newSentimContent = sentimentTestDatas[4].content
            const token = authorizTokenEncoder({subj: usersToTest[2].userid,
                email: usersToTest[2].email })

            request(theSrv)
            .post('/graphql')
            .send({query: `mutation{
                createSentimentToHere(targeted: COMMENT, id: "${theCommID}"
                    content: ${newSentimContent}){
                    sentimentid, owner{
                        userid, username, relation, mutualFriendCount
                    }, content
                }
            }`})
            .set('Accept', 'application/json')
            .set('Authorization', createTokenToHeader(token))
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)
                expect(res.body.errors).toBe(undefined)

                expect(typeof res.body.data.createSentimentToHere).toBe('object')
                expect(res.body.data.createSentimentToHere.content)
                    .toBe(newSentimContent)
                expect(res.body.data.createSentimentToHere.owner.userid)
                    .toBe(usersToTest[2].userid)

                CommentModel.findById(comm3ID, (e2, d2)=>{
                    expect(e2).toBe(null)
                    expect(d2).not.toBe(null)

                    expect(d2.sentiments).toHaveLength(1)
                    expect(d2.sentiments[0]._id.toString())
                        .toBe(res.body.data.createSentimentToHere.sentimentid)
                    sentimentIds.set(4, d2.sentiments[0]._id.toString())

                    done()
                })
            })
        })
    })

    it('Mutation 5, update a content of comment2 to comment9, at post2', (done)=>{
        const comm0ID = commentIds.get('Commenting 2')
        CommentModel.findById(comm0ID, (e1, d1)=>{
            expect(e1).toBe(null)
            expect(d1).not.toBe(null)
            expect(d1.content).toBe('Commenting 2')
            
            const newContent = commentTestDatas2[2].content
            const token = authorizTokenEncoder({subj: usersToTest[1].userid,
                email: usersToTest[1].email })
            request(theSrv)
            .post('/graphql')
            .send({query: `mutation{
                updateCommentContent(commentid: "${comm0ID}" content: "${newContent}")
                {
                    commentid, owner{
                        userid, username, relation, mutualFriendCount
                    }, content, sentiments {
                        sentimentid, owner{
                            userid, username, relation, mutualFriendCount
                        }, content
                    }, comments
                }
            }`})
            .set('Accept', 'application/json')
            .set('Authorization', createTokenToHeader(token))
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)
                expect(res.body.errors).toBe(undefined)

                expect(typeof res.body.data.updateCommentContent).toBe('object')
                expect(res.body.data.updateCommentContent.commentid)
                    .toBe(comm0ID)
                expect(res.body.data.updateCommentContent.content)
                    .toBe(newContent)

                CommentModel.findById(comm0ID, (e2, d2)=>{
                    expect(e2).toBe(null)
                    expect(d2).not.toBe(null)

                    expect(d2.content).toBe(newContent)
                    commentIds.delete('Commenting 2')
                    commentIds.set(d2.content, d2._id.toString())
                    done()
                })
            })
        })
    })

    it('Mutation 6, update a sentiment of sentiment3 to sentiment5, at post2', (done)=>{
        const post2ID = postIds[2]
        const oldContent = sentimentTestDatas[3].content
        PostModel.findById(post2ID, (e1, d1)=>{
            expect(e1).toBe(null)
            expect(d1).not.toBe(null)
            expect(d1.sentiments).toHaveLength(1)
            expect(d1.sentiments[0]._id.toString()).toBe(sentimentIds.get(3))
            expect(d1.sentiments[0].content).toBe(oldContent)

            const sentimID = d1.sentiments[0]._id.toString()
            const newContent = sentimentTestDatas[5].content
            expect(oldContent).not.toBe(newContent)

            const token = authorizTokenEncoder({subj: usersToTest[2].userid,
                email: usersToTest[2].email })

            request(theSrv)
            .post('/graphql')
            .send({query: `mutation{
                updateSentimentContent(targeted: POST, id: "${post2ID}",
                    sentimentid: "${sentimID}" content: ${newContent})
                {
                    sentimentid, owner{
                        userid, username, relation, mutualFriendCount
                    }, content
                }
            }`})
            .set('Accept', 'application/json')
            .set('Authorization', createTokenToHeader(token))
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)
                expect(res.body.errors).toBe(undefined)

                expect(res.body.data.updateSentimentContent.sentimentid)
                    .toBe(sentimID)
                expect(res.body.data.updateSentimentContent.content)
                    .toBe(newContent)

                PostModel.findById(post2ID, (e2, d2)=>{
                    expect(e2).toBe(null)
                    expect(d2).not.toBe(null)

                    expect(d2.sentiments).toHaveLength(1)
                    expect(d2.sentiments[0]._id.toString()).toBe(sentimID)
                    expect(d2.sentiments[0].content).toBe(newContent)
                    done()
                })
            })
        })
    })

    it('Mutation 7, update a sentiment of sentiment4 to sentiment6, at comment3', (done)=>{
        const comm3ID = commentIds.get('Commenting 3')
        CommentModel.findById(comm3ID, (e1, d1)=>{
            expect(e1).toBe(null)
            expect(d1).not.toBe(null)
            expect(d1.sentiments).toHaveLength(1)
            expect(d1.sentiments[0]._id.toString()).toBe(sentimentIds.get(4))
            expect(d1.sentiments[0].content).toBe(sentimentTestDatas[4].content)

            const sentimID = d1.sentiments[0]._id.toString()
            const newContent = sentimentTestDatas[6].content
            expect(d1.sentiments[0].content).not.toBe(newContent)
            
            const token = authorizTokenEncoder({subj: usersToTest[2].userid,
                email: usersToTest[2].email })

            request(theSrv)
            .post('/graphql')
            .send({query: `mutation{
                updateSentimentContent(targeted: COMMENT, id: "${comm3ID}",
                    sentimentid: "${sentimID}" content: ${newContent})
                {
                    sentimentid, owner{
                        userid, username, relation, mutualFriendCount
                    }, content
                }
            }`})
            .set('Accept', 'application/json')
            .set('Authorization', createTokenToHeader(token))
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)
                expect(res.body.errors).toBe(undefined)

                expect(res.body.data.updateSentimentContent.sentimentid)
                    .toBe(sentimID)
                expect(res.body.data.updateSentimentContent.content)
                    .toBe(newContent)

                CommentModel.findById(comm3ID, (e2, d2)=>{
                    expect(e2).toBe(null)
                    expect(d2).not.toBe(null)
                    expect(d2.sentiments).toHaveLength(1)
                    expect(d2.sentiments[0]._id.toString()).toBe(sentimentIds.get(4))
                    expect(d2.sentiments[0].content).toBe(newContent)
                    done()
                })
            })
        })
    })


    it('Mutation 8, delete a comment of comment4 from comment3', (done)=>{
        const comm3ID = commentIds.get('Commenting 3')
        const comm4ID = commentIds.get('Commenting 4')
        const comm5ID = commentIds.get('Commenting 5')
        const comm6ID = commentIds.get('Commenting 6')
        CommentModel.findById(comm3ID, (e1, d1)=>{
            expect(e1).toBe(null)
            expect(d1).not.toBe(null)
            expect(d1.comments).toHaveLength(1)
            expect(d1.comments[0].commentid.toString()).toBe(comm4ID)

            const token = authorizTokenEncoder({subj: usersToTest[0].userid,
                email: usersToTest[0].email })

            request(theSrv)
            .post('/graphql')
            .send({query: `mutation{
                deleteThisComment(targeted: COMMENT, id: "${comm3ID}",
                    commentid: "${comm4ID}")
                {
                    targetType, targetId, id, resultText
                }
            }`})
            .set('Accept', 'application/json')
            .set('Authorization', createTokenToHeader(token))
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)
                expect(res.body.errors).toBe(undefined)

                expect(res.body.data.deleteThisComment.id)
                    .toBe(comm4ID)
                expect(res.body.data.deleteThisComment.targetType)
                    .toBe('COMMENT')
                expect(res.body.data.deleteThisComment.targetId)
                    .toBe(comm3ID)
                expect(res.body.data.deleteThisComment.resultText)
                    .toBe('Comment deletion done!')

                CommentModel.findById(comm3ID, (e2, d2)=>{
                    expect(e2).toBe(null)
                    expect(d2).not.toBe(null)
                    expect(d2.comments).toHaveLength(0)

                    setTimeout(()=>{
                        CommentModel.find({_id: [comm4ID, comm5ID, comm6ID ] }, (e3, d3)=>{
                            expect(e3).toBe(null)
                            expect(d3).toStrictEqual([])
                            done()
                        })
                    }, 600)

                })
            })
        })
    })

    it('Mutation 9, deletion of comment4 at post4', (done)=>{
        const comm1ID = commentIds.get('Commenting 1')
        const post1ID = postIds[4]
        PostModel.findById(post1ID, (e1, d1)=>{
            expect(e1).toBe(null)
            expect(d1).not.toBe(null)
            expect(d1.comments).toHaveLength(1)
            expect(d1.comments[0].commentid.toString()).toBe(comm1ID)

            const token = authorizTokenEncoder({subj: usersToTest[0].userid,
                email: usersToTest[0].email })

            request(theSrv)
            .post('/graphql')
            .send({query: `mutation{
                deleteThisComment(targeted: POST, id: "${post1ID}",
                    commentid: "${comm1ID}")
                {
                    targetType, targetId, id, resultText
                }
            }`})
            .set('Accept', 'application/json')
            .set('Authorization', createTokenToHeader(token))
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)
                expect(res.body.errors).toBe(undefined)

                expect(res.body.data.deleteThisComment.id)
                    .toBe(comm1ID)
                expect(res.body.data.deleteThisComment.targetType)
                    .toBe('POST')
                expect(res.body.data.deleteThisComment.targetId)
                    .toBe(post1ID)
                expect(res.body.data.deleteThisComment.resultText)
                    .toBe('Comment deletion done!')
                PostModel.findById(post1ID, (e2, d2)=>{
                    expect(e2).toBe(null)
                    expect(d2).not.toBe(null)
                    expect(d2.comments).toHaveLength(0)
                    done()
                })
            })
        })
    })
    it('Mutation 10. deletion sentiment4 of comment3', (done)=>{
        const comm3ID = commentIds.get('Commenting 3')
        const sentim4ID = sentimentIds.get(4)
        CommentModel.findById(comm3ID, (e1, d1)=>{
            expect(e1).toBe(null)
            expect(d1).not.toBe(null)
            expect(d1.sentiments).toHaveLength(1)
            expect(d1.sentiments[0]._id.toString()).toBe(sentim4ID)

            const token = authorizTokenEncoder({subj: usersToTest[2].userid,
                email: usersToTest[2].email })

            request(theSrv)
            .post('/graphql')
            .send({query: `mutation{
                deleteThisSentiment(targeted: COMMENT, id: "${comm3ID}",
                    sentimentid: "${sentim4ID}")
                {
                    targetType, targetId, id, resultText
                }
            }`})
            .set('Accept', 'application/json')
            .set('Authorization', createTokenToHeader(token))
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)
                expect(res.body.errors).toBe(undefined)

                expect(res.body.data.deleteThisSentiment.id)
                    .toBe(sentim4ID)
                expect(res.body.data.deleteThisSentiment.targetType)
                    .toBe('COMMENT')
                expect(res.body.data.deleteThisSentiment.targetId)
                    .toBe(comm3ID)
                expect(res.body.data.deleteThisSentiment.resultText)
                    .toBe('Sentiment deletion done!')

                CommentModel.findById(comm3ID, (e2, d2)=>{
                    expect(e2).toBe(null)
                    expect(d2).not.toBe(null)
                    expect(d2.sentiments).toHaveLength(0)
                    done()
                })
            })
        })
    })
    it('Mutation 11, deletion sentiment2 of post4', (done)=>{


        const post4ID = postIds[4]
        const sentim2ID = sentimentIds.get(2)
        PostModel.findById(post4ID, (e1, d1)=>{
            expect(e1).toBe(null)
            expect(d1).not.toBe(null)
            expect(d1.sentiments).toHaveLength(2)
            expect(d1.sentiments[1]._id.toString()).toBe(sentim2ID)

            const token = authorizTokenEncoder({subj: usersToTest[0].userid,
                email: usersToTest[0].email })

            request(theSrv)
            .post('/graphql')
            .send({query: `mutation{
                deleteThisSentiment(targeted: POST, id: "${post4ID}",
                    sentimentid: "${sentim2ID}")
                {
                    targetType, targetId, id, resultText
                }
            }`})
            .set('Accept', 'application/json')
            .set('Authorization', createTokenToHeader(token))
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)
                expect(res.body.errors).toBe(undefined)

                expect(res.body.data.deleteThisSentiment.id)
                    .toBe(sentim2ID)
                expect(res.body.data.deleteThisSentiment.targetType)
                    .toBe('POST')
                expect(res.body.data.deleteThisSentiment.targetId)
                    .toBe(post4ID)
                expect(res.body.data.deleteThisSentiment.resultText)
                    .toBe('Sentiment deletion done!')

                    PostModel.findById(post4ID, (e2, d2)=>{
                    expect(e2).toBe(null)
                    expect(d2).not.toBe(null)
                    expect(d2.sentiments).toHaveLength(1)
                    expect(d1.sentiments[0]._id.toString())
                        .not.toBe(sentim2ID)

                    done()
                })
            })
        })
        
    })

})