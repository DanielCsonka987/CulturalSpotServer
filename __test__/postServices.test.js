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

let usersToTest = []    //4 users
let postIds = []        //6 posts
let commentIds = []     //3 comments
let sentimentIds = []   //3 sentiments
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

            usersDocs[0].friends.push(usersDocs[1]._id)
            usersDocs[0].friends.push(usersDocs[2]._id)
            await usersDocs[0].save()

            
            usersDocs[1].friends.push(usersDocs[0]._id)
            await usersDocs[1].save()
            usersDocs[2].friends.push(usersDocs[0]._id)
            await usersDocs[1].save()

            usersToTest = usersDocs.map(item=>{ 
                return { userid: item._id.toString(), mail: item.email }
            })
            const tempPost1 = postTestDatas1.map(item => { return item.content})
            const tempPost2 = postTestDatas2.map(item => { return item.content})
            const contentToDel = [...tempPost1, ...tempPost2]
            PostModel.deleteMany({content: contentToDel}, async (e, r)=>{
                expect(e).toBe(null)

                theSrv = await startTestingServer(4041)

                PostModel.insertMany(postTestDatas1, (eObj, postObj)=>{
                    expect(eObj).toBe(null)
                    postIds = postObj.map(item=>{ return item._id.toString() })

                    CommentModel.insertMany(commentTestDatas1, async (eObj2, commObj)=>{
                        expect(eObj2).toBe(null)

                        //user0 -> post0 dedicatedTo user2 -> X
                        postObj[0].owner = usersDocs[0]._id
                        postObj[0].dedicatedTo = usersDocs[2]._id
                        await postObj[0].save()
                        //user0 -> post3 -> sentiment0
                        postObj[3].owner = usersDocs[0]._id
                        const sentimID0 = new mongooseID()
                        sentimentIds.push(sentimID0.toString())
                        postObj[3].sentiments.push({
                            _id: sentimID0,
                            owner: usersDocs[2]._id,
                            ...sentimentTestDatas[0]
                        })
                        await postObj[3].save()
                        usersDocs[0].myPosts.push(postObj[0]._id)
                        usersDocs[0].myPosts.push(postObj[3]._id)
                        await usersDocs[0].save()

                        //user1 -> post1 -> comment0
                        postObj[1].owner = usersDocs[1]._id
                        postObj[1].comments.push(commObj[0]._id)
                        await postObj[1].save()
                        usersDocs[1].myPosts.push(postObj[1]._id)
                        await usersDocs[1].save()
                        commentIds.push(commObj[0]._id.toString())
                        commObj[0].owner = usersDocs[0]._id
                        await commObj[0].save()

                        //user3 -> post2 -> comment2, comment3
                        postObj[2].owner = usersDocs[3]._id
                        postObj[2].comments.push(commObj[2]._id)
                        postObj[2].comments.push(commObj[3]._id)
                        await postObj[2].save()
                        commentIds.push(commObj[1]._id.toString())
                        commentIds.push(commObj[2]._id.toString())
                        commObj[1].owner = usersDocs[1]._id
                        commObj[2].owner = usersDocs[1]._id
                        await commObj[1].save()
                        await commObj[2].save()
                        //user3 -> post5 -> X
                        postObj[5].owner = usersDocs[3]._id
                        await postObj[5].save()
                        usersDocs[3].myPosts.push(postObj[2]._id)
                        usersDocs[3].myPosts.push(postObj[5]._id)
                        await usersDocs[3].save()


                        //user2 -> post4 -> sentiment1, sentiment2, comment1
                        postObj[4].owner = usersDocs[2]._id
                        postObj[4].comments.push(commObj[1]._id)
                        commentIds.push(commObj[1]._id.toString())
                        commObj[1].owner = usersDocs[0]
                        await commObj[1].save()
                        const sentimID1 = new mongooseID()
                        sentimentIds.push(sentimID1.toString())
                        postObj[4].sentiments.push({
                            _id: sentimID1,
                            owner: usersDocs[1]._id,
                            ...sentimentTestDatas[1]
                        })
                        const sentimID2 = new mongooseID()
                        sentimentIds.push(sentimID2.toString())
                        postObj[4].sentiments.push({
                            _id:  sentimID2,
                            owner: usersDocs[0]._id,
                            ...sentimentTestDatas[2]
                        })
                        await postObj[4].save()
                        usersDocs[2].myPosts.push(postObj[4]._id)
                        await usersDocs[2].save()
                        
                        

                        done()
                    })
                })
                /*
                    user0 -> post0 dedicatedTo user2 -> X
                          -> post3 -> sentiment0 (u2)
                    user1 -> post1 -> comment0 (u0)
                        |-> mut. +post6  |-> mut. updated content and dedication user0
                    user2 -> post4 -> sentiment1 (u1), sentiment2 (u0), comment1 (u0)
                        |-> mut. +post7 dedicatedTo user0
                    user3 -> post2 -> comment2 (u1), comment3 (u1)
                          -> post5 -> X
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
        const token = authorizTokenEncoder({subj: usersToTest[1].userid, 
            email: usersToTest[1].mail})

        request(theSrv)
        .post('/graphql')
        .send({query: `query{
            listOfMySentPosts{
                postid, owner{
                    id, username, mutualFriendCount, relation
                }, 
                dedicatedTo{
                    id, username, mutualFriendCount, relation
                }, 
                content, comments,
                sentiments {
                    sentimentid, owner{
                        id, username, mutualFriendCount, relation
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
            expect(res.body.data.listOfMySentPosts[0].owner.id)
                .toBe(usersToTest[1].userid)
            expect(res.body.data.listOfMySentPosts[0].comments).toHaveLength(1)
            expect(res.body.data.listOfMySentPosts[0].comments[0])
                .toBe(commentIds[0])
            expect(res.body.data.listOfMySentPosts[0].sentiments).toHaveLength(0)

            done()
        })
    })
    it('Fetch in the posts of user2, dedicated to it', (done)=>{

        const token = authorizTokenEncoder({subj: usersToTest[2].userid, 
            email: usersToTest[2].mail })
        request(theSrv)
        .post('/graphql')
        .send({query: `query{
            listOfMyRecievedPosts{
                postid, owner{
                    id, username, mutualFriendCount, relation
                }, 
                dedicatedTo{
                    id, username, mutualFriendCount, relation
                }, 
                content, comments, 
                sentiments {
                    sentimentid, owner{
                        id, username, mutualFriendCount, relation
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
            expect(res.body.data.listOfMyRecievedPosts[0].owner.id)
                .toBe(usersToTest[0].userid)
            expect(res.body.data.listOfMyRecievedPosts[0].dedicatedTo.id)
                .toBe(usersToTest[2].userid)
            expect(res.body.data.listOfMyRecievedPosts[0].comments).toHaveLength(0)
            expect(res.body.data.listOfMyRecievedPosts[0].sentiments).toHaveLength(0)

            done()
        })
    })

    it('Fetch in all the posts of user0', (done)=>{

        const token = authorizTokenEncoder({subj: usersToTest[0].userid, 
            email: usersToTest[0].mail })
        request(theSrv)
        .post('/graphql')
        .send({query: `query{
            listOfAllPosts{
                postid, owner{
                    id, username, mutualFriendCount, relation
                }, 
                dedicatedTo{
                    id, username, mutualFriendCount, relation
                }, 
                content, comments, sentiments{
                    sentimentid, owner{
                        id, username, mutualFriendCount, relation
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

            expect(res.body.data.listOfAllPosts).not.toBe(undefined)
            expect(res.body.data.listOfAllPosts).toHaveLength(4)

            expect(res.body.data.listOfAllPosts[0].content).toBe('Post content 0')
            expect(res.body.data.listOfAllPosts[0].postid)
                .toBe(postIds[0])
            expect(res.body.data.listOfAllPosts[0].owner.id)
                .toBe(usersToTest[0].userid)
            expect(res.body.data.listOfAllPosts[0].dedicatedTo.id)
                .toBe(usersToTest[2].userid)
            expect(res.body.data.listOfAllPosts[0].comments).toHaveLength(0)
            expect(res.body.data.listOfAllPosts[0].sentiments).toHaveLength(0)

            expect(res.body.data.listOfAllPosts[1].content)
                .toBe('Post content 3')
            expect(res.body.data.listOfAllPosts[1].postid)
                .toBe(postIds[3])
            expect(res.body.data.listOfAllPosts[1].owner.id)
                .toBe(usersToTest[0].userid)
            expect(res.body.data.listOfAllPosts[1].comments).toHaveLength(0)

            expect(res.body.data.listOfAllPosts[1].sentiments).toHaveLength(1)
            expect(res.body.data.listOfAllPosts[1].sentiments[0].sentimentid)
                .toBe(sentimentIds[0])
            expect(res.body.data.listOfAllPosts[1].sentiments[0].owner.id)
                .toBe(usersToTest[2].userid)
            expect(res.body.data.listOfAllPosts[1].sentiments[0].owner.relation)
                .toBe('FRIEND')
            expect(res.body.data.listOfAllPosts[1].sentiments[0].content)
                .toBe('LIKE')


            expect(res.body.data.listOfAllPosts[2].content)
                .toBe('Post content 1')
            expect(res.body.data.listOfAllPosts[2].postid)
                .toBe(postIds[1])
            expect(res.body.data.listOfAllPosts[2].owner.id)
                .toBe(usersToTest[1].userid)
            expect(res.body.data.listOfAllPosts[2].comments).toHaveLength(1)
            expect(res.body.data.listOfAllPosts[2].comments[0])
                .toBe(commentIds[0])
            expect(res.body.data.listOfAllPosts[2].sentiments).toHaveLength(0)

            expect(res.body.data.listOfAllPosts[3].content)
                .toBe('Post content 4')
            expect(res.body.data.listOfAllPosts[3].postid)
                .toBe(postIds[4])
            expect(res.body.data.listOfAllPosts[3].owner.id)
                .toBe(usersToTest[2].userid)
            expect(res.body.data.listOfAllPosts[3].comments).toHaveLength(1)
            expect(res.body.data.listOfAllPosts[3].comments[0])
                .toBe(commentIds[1])
            expect(res.body.data.listOfAllPosts[3].sentiments).toHaveLength(2)
            expect(res.body.data.listOfAllPosts[3].sentiments[0].sentimentid)
                .toBe(sentimentIds[1])
            expect(res.body.data.listOfAllPosts[3].sentiments[1].sentimentid)
                .toBe(sentimentIds[2])

            done()
        })
    })
})

describe('GQL Post mutation processes', ()=>{

    it('Saving new post at user1, no addresse', (done)=>{
        const newContent = postTestDatas2[0].content
        const token = authorizTokenEncoder({subj: usersToTest[1].userid, 
            email: usersToTest[1].mail })
        request(theSrv)
        .post('/graphql')
        .send({query: `mutation{
            makeAPost(content: "${newContent}"){
                postid, owner{
                    id, username, mutualFriendCount, relation
                }, 
                dedicatedTo{
                    id, username, mutualFriendCount, relation
                }, 
                content, comments, sentiments{
                    sentimentid, owner{
                        id, username, mutualFriendCount, relation
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
                expect(res.body.data.makeAPost.owner.id)
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
            email: usersToTest[2].mail })
        request(theSrv)
        .post('/graphql')
        .send({query: `mutation{
            makeAPost(content: "${newContent}", 
                dedication: "${usersToTest[0].userid}"){
                postid, owner{
                    id, username, mutualFriendCount, relation
                }, 
                dedicatedTo{
                    id, username, mutualFriendCount, relation
                }, 
                content, comments, sentiments{
                    sentimentid, owner{
                        id, username, mutualFriendCount, relation
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
                expect(res.body.data.makeAPost.owner.id)
                    .toBe(usersToTest[2].userid)
                expect(res.body.data.makeAPost.dedicatedTo.id)
                    .toBe(usersToTest[0].userid)
                done()
            })

        })
    })

    it('Created post updating at user1 of post6', (done)=>{
        const oldContent = postTestDatas2[0].content
        const newContent = postTestDatas2[2].content
        const token = authorizTokenEncoder({subj: usersToTest[1].userid, 
            email: usersToTest[1].mail })
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
                            id, username, mutualFriendCount, relation
                        }, 
                        dedicatedTo{
                            id, username, mutualFriendCount, relation
                        }, 
                        content, comments, sentiments{
                            sentimentid, owner{
                                id, username, mutualFriendCount, relation
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
                    expect(res.body.data.updateThisPost.owner.id)
                        .toBe(usersToTest[1].userid)
                    expect(res.body.data.updateThisPost.dedicatedTo.id)
                        .toBe(usersToTest[0].userid)
                    done()
                
                })
            })
        })
    })
    it('Delete a post at user0 of post0', (done)=>{
        const targetContent = postTestDatas1[0].content
        PostModel.findOne({content: targetContent}, (e, d)=>{
            expect(e).toBe(null)
            expect(d).not.toBe(null)
            const targetDelId = d._id.toString()

            const token = authorizTokenEncoder({subj: usersToTest[0].userid,
                email: usersToTest[0].mail })
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