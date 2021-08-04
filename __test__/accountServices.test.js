
const request = require('supertest')

const ProfileModel = require('../models/ProfileModel')
const EmailReportModel = require('../models/EmailReportModel')
const { createTokenToHeader, userTestDatas, userTestRegister } = require('./helperToTesting')
const { autorizTokenEncoder } = require('../utils/tokenManager')
const { startTestingServer, exitTestingServer } = require('../server')

let userEmails= []
let userIds = []

let theSrv = null;
beforeAll( async ()=>{
    theSrv =  await startTestingServer(true)
    const removeContent = userTestDatas.map(item=>{ return item.email })
    removeContent.push(userTestRegister.email)
    await ProfileModel.deleteMany(
        {email: removeContent } , async (err, rep)=>{
            
            await ProfileModel.insertMany(userTestDatas, async (error, report)=>{
            expect(error).toBe(null)
            expect(typeof report).toBe('object')
            userIds = report.map(item=>{ return item._id.toString() })
            userEmails = report.map(item=>{ return item.email })

            //id at pointer 0 will be removed
            //id at pointer 1 will be at the main target of friend management tests
            report[1].friends.push(report[2]._id)   //at mut.5 removed
            report[1].initiatedCon.push(report[3]._id)
            report[1].undecidedCon.push(report[4]._id)  //at mut.4 accepted
            report[1].undecidedCon.push(report[5]._id)  //at mut.3 removed
            await report[1].save()

            report[2].friends.push(report[1]._id)
            report[2].friends.push(report[3]._id)
            await report[2].save()

            report[3].undecidedCon.push(report[1]._id)
            report[3].friends.push(report[2]._id)
            await report[3].save()

            report[4].initiatedCon.push(report[1]._id)
            await report[4].save()
            report[5].initiatedCon.push(report[5]._id)
            await report[5].save()
        })
        //1 more user exist - at mut.1 initiated friendship, that at mut.2 removed
    })
})
afterAll((done)=>{
    setTimeout(async()=>{
        await exitTestingServer()
        done()
    }, 500)

})

describe('Starter base REST URLs', ()=>{
    it('GET the base url', (done)=>{
        request(theSrv)
        .get('/')
        .expect("Content-Type", /text\/html/)
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body).toBeInstanceOf(Object);
            expect(res.text.includes('GET request accepted - frontpage is sent!'))
                .toBeTruthy()
            expect(res.text.includes('<h1>')).toBeTruthy()
            expect(res.text.includes('</h1>')).toBeTruthy()
            return done()
        })
            
    })
    it('GET password change middle GET URL', (done)=>{
        request(theSrv)
        .get('/resetpassword/')
        .expect("Content-Type", /text\/html/)
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body).toBeInstanceOf(Object);
            expect(res.text.includes('GET request accepted 2')).toBeTruthy()
            expect(res.text.includes('<h1>')).toBeTruthy()
            expect(res.text.includes('</h1>')).toBeTruthy()
            return done()
        })
    })
})


describe('GrapQL profile queries', ()=>{
    it('Test attempt', (done)=>{
        request(theSrv)
        .post('/graphql')
        .send({
            "query": "{ testquery }"
        })
        .set("Accept", "application/json")
        .expect('Content-Type', "application/json; charset=utf-8")
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.data.testquery).toBe('Server is running fine!')
            done()
        })
    })
    it('Login attempt', (done)=>{
        request(theSrv)
        .post('/graphql')
        .send({
            "query": `mutation{
                 login(email:"${userEmails[0]}", password: "testing") 
                { id, token, tokenExpire, registeredAt }
            }`
        })
        .set("Accept", "application/json")
        .expect('Content-Type', "application/json; charset=utf-8")
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(typeof res.body.data.login.id).toBe('string')

            const theGotId = res.body.data.login.id
            ProfileModel.findOne({ _id: theGotId }, (error, result)=>{
                expect(error).toBe(null)
                expect(result.registeredAt).toEqual(res.body.data.login.registeredAt)
                done()
            })
        })
    })
    it('Registration attempt', (done)=>{
        request(theSrv)
        .post('/graphql')
        .send({
            "query": `mutation{  
                registration( 
                    email:"${userTestRegister.email}", username: "${userTestRegister.username}",
                    password: "${userTestRegister.pwd}", passwordconf: "${userTestRegister.pwd}" )
                { id, token, tokenExpire, username } 
            }`
        })
        .set("Accept", "application/json")
        .expect('Content-Type', "application/json; charset=utf-8")
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)

            expect(typeof res.body.data.registration.id).toBe('string')
            expect(typeof res.body.data.registration.username).toBe('string')
            expect(res.body.data.registration.username).toBe(userTestRegister.username)

            const theNewId = res.body.data.registration.id
            ProfileModel.findOne({ _id: theNewId }, (error, result)=>{
                expect(error).toBe(null)
                expect(result.username).toBe(userTestRegister.username)

                userIds.push(result._id.toString())
                userEmails.push(result.email)
                done()
            })
        })
    })
    it('Change pwd attempt', (done)=>{
        const userEmailTarget = userEmails[userEmails.length-1];
        const theUserId = userIds[userIds.length-1].toString();
        let theOldHashPwd = ''; 
        ProfileModel.findOne({email: userEmailTarget}, (err, doc)=>{
            expect(err).toBe(null)
            theOldHashPwd = doc.pwdHash;

            let tokenToAuth = autorizTokenEncoder({ subj: theUserId, email: userEmailTarget })
    
            request(theSrv)
            .post("/graphql")
            .send({
                query: `mutation{
                    changePassword(oldpassword: "testing", 
                    newpassword: "againPwd", newconf: "againPwd")
                    {
                        id, username, email, resultText
                    }
                }`
            })
            .set('Authorization', createTokenToHeader(tokenToAuth))
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)
                expect(typeof res.body.data).toBe('object')

                expect(res.body.data.changePassword.id).toBe(theUserId)
                expect(res.body.data.changePassword.resultText).toBe('Your password changed!')
    
                ProfileModel.findOne({_id: res.body.data.changePassword.id}, 
                    async (error, doc)=>{
                    expect(error).toBe(null)
                    expect(doc.pwdHash).not.toEqual(theOldHashPwd)
                    console.log('The new password hash to check in the DB record. \n %s',
                        doc.pwdHash)
                    done()
                })
            })

        })
    })

    it('Change user detail attempt', (done)=>{
        const userEmailTarget = userEmails[userEmails.length - 1];
        const theUserId = userIds[userIds.length - 1].toString();
        const newUsername = 'Recognisable NAME'
        ProfileModel.findOne({email: userEmailTarget}, (err, doc)=>{
            expect(err).toBe(null)
            theOldName = doc.username

            const tokenToAuth = autorizTokenEncoder({ subj: theUserId, email: userEmailTarget })

            request(theSrv)
            .post('/graphql')
            .send({query: `mutation{
                changeAccountDatas(username: "${newUsername}"){
                    id, username, email, resultText
                }
            }`})
            .set('Authorization', createTokenToHeader(tokenToAuth))
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)

                expect(typeof res.body.data).toBe('object')
                expect(typeof res.body.data.changeAccountDatas.id).toBe('string')
                expect(res.body.data.changeAccountDatas.id).toBe(theUserId)
                expect(res.body.data.changeAccountDatas.resultText).toBe('Account datas changed!')

                ProfileModel.findOne({ _id: res.body.data.changeAccountDatas.id }, 
                    async (error, doc)=>{
                    expect(error).toBe(null)
                    expect(doc.username).toBe(newUsername)
                    done()
                })  
            })
        })
    })

    it('Delete account attempt', (done)=>{
        const userEmailTarget = userEmails[0];
        const theUserId = userIds[0].toString();
        ProfileModel.findOne({email: userEmailTarget}, (err, doc)=>{
            expect(err).toBe(null)

            let tokenToAuth = autorizTokenEncoder({ subj: theUserId, email: userEmailTarget })

            request(theSrv)
            .post('/graphql')
            .send({query: `mutation{
                deleteAccount(password: "testing", passwordconf: "testing"){
                    id, username, email, resultText
                }
            }`})
            .set('Authorization', createTokenToHeader(tokenToAuth))
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)

                expect(typeof res.body.data).toBe('object')
                expect(typeof res.body.data.deleteAccount.id).toBe('string')
                expect(res.body.data.deleteAccount.id).toBe(theUserId)
                expect(res.body.data.deleteAccount.resultText).toBe('Account deleted!')

                ProfileModel.findOne({ _id: res.body.data.deleteAccount.id }, 
                    async (error, doc)=>{
                    expect(error).toBe(null)
                    expect(doc).toBe(null)

                    userEmails.shift()
                    userIds.shift()
                    done()
                })  
            })
        })
    })
    it('ResetPassword attempt', (done)=>{
        const userEmailTarget = userEmails[2];
        ProfileModel.findOne({email: userEmailTarget}, (err, doc)=>{
            expect(err).toBe(null)
            const theUserId = doc._id.toString();

            request(theSrv)
            .post('/graphql')
            .send({query: `mutation{
                resetPassword(email: "${userEmailTarget}"){
                    id, username, email, resultText
                }
            }`})
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)

                expect(typeof res.body.data).toBe('object')
                expect(typeof res.body.data.resetPassword.id).toBe('string')
                expect(res.body.data.resetPassword.id).not.toBe(theUserId)
                expect(res.body.data.resetPassword.id).toBe('none')
                expect(res.body.data.resetPassword.resultText).toBe('Password reset email is sent!')
                setTimeout(()=>{
                    EmailReportModel.findOne({ msgto: userEmailTarget }, (error, doc)=>{
                        expect(error).toBe(null)
                        expect(doc).not.toBe(null)
    
                        ProfileModel.findOne({ email: userEmailTarget }, (errObj, docObj)=>{
                            expect(errObj).toBe(null)
                            expect(docObj.resetPwdMarker).not.toBe(undefined)
                            done()
                        })
    
                    })  
                }, 1200)
            })
        })
        
    })
})

describe('Graphql frrend queries', ()=>{
    it('My friends query', (done)=>{
        const authToken = autorizTokenEncoder({ subj: userIds[0], email: userEmails[0] } )
        request(theSrv)
        .post('/graphql')
        .send({query: ` query{
            listOfMyFriends{
                    id, username, email
                }
            }`
        })
        .set('Authorization', createTokenToHeader(authToken))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err,res)=>{
            expect(err).toBe(null)
            expect(typeof res.body.data).toBe('object')

            expect(typeof res.body.data.listOfMyFriends).toBe('object')
            expect(res.body.data.listOfMyFriends.length).toBe(1)
            expect(res.body.data.listOfMyFriends[0].id).toBe(userIds[1])
            expect(res.body.data.listOfMyFriends[0].email).toBe(userEmails[1])
            done()
        })
    })
    it('My undecided friend-request query', (done)=>{
        const authToken = autorizTokenEncoder({ subj: userIds[0], email: userEmails[0] } )
        request(theSrv)
        .post('/graphql')
        .send({query: ` query{
            listOfUndecidedFriendships{
                    id, username, relation, mutualFriendCount
                }
            }`
        })
        .set('Authorization', createTokenToHeader(authToken))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err,res)=>{
            expect(err).toBe(null)
            expect(typeof res.body.data).toBe('object')

            expect(typeof res.body.data.listOfUndecidedFriendships).toBe('object')
            expect(res.body.data.listOfUndecidedFriendships.length).toBe(2)
            expect(res.body.data.listOfUndecidedFriendships[0].id).toBe(userIds[3])
            expect(res.body.data.listOfUndecidedFriendships[0].relation).toBe('UNCERTAIN')
            expect(res.body.data.listOfUndecidedFriendships[1].id).toBe(userIds[4])
            expect(res.body.data.listOfUndecidedFriendships[1].relation).toBe('UNCERTAIN')
            done()
        })
    })
    it('My initiated friend-request query', (done)=>{
        const authToken = autorizTokenEncoder({ subj: userIds[0], email: userEmails[0] } )
        request(theSrv)
        .post('/graphql')
        .send({query: ` query{
            listOfInitiatedFriendships{
                    id, username, relation, mutualFriendCount
                }
            }`
        })
        .set('Authorization', createTokenToHeader(authToken))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err,res)=>{
            expect(err).toBe(null)
            expect(typeof res.body.data).toBe('object')

            expect(typeof res.body.data.listOfInitiatedFriendships).toBe('object')
            expect(res.body.data.listOfInitiatedFriendships.length).toBe(1)
            expect(res.body.data.listOfInitiatedFriendships[0].id).toBe(userIds[2])
            expect(res.body.data.listOfInitiatedFriendships[0].relation).toBe('INITIATED')
            done()
        })
    })
    it('Spec. users public account', (done)=>{
        const authToken = autorizTokenEncoder({ subj: userIds[0], email: userEmails[0] } )
        request(theSrv)
        .post('/graphql')
        .send({query: ` query{
            showThisUserInDetail(friendid: "${userIds[1]}"){
                    id, username, email, registeredAt, relation, mutualFriendCount, friends{
                        id, username, relation, mutualFriendCount
                    }
                }
            }`
        })
        .set('Authorization', createTokenToHeader(authToken))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err,res)=>{
            expect(err).toBe(null)
            expect(typeof res.body.data).toBe('object')

            expect(typeof res.body.data.showThisUserInDetail).toBe('object')
            expect(res.body.data.showThisUserInDetail.id).toBe(userIds[1])
            expect(res.body.data.showThisUserInDetail.email).toBe(userEmails[1])
            expect(res.body.data.showThisUserInDetail.relation).toBe('FRIEND')
            done()
        })
    })
    it('Show-me-new-friends query', (done)=>{
        const authToken = autorizTokenEncoder({ subj: userIds[0], email: userEmails[0] } )
        request(theSrv)
        .post('/graphql')
        .send({query: ` query{
            showMeWhoCouldBeMyFriend{
                    id, username, relation, mutualFriendCount
                }
            }`
        })
        .set('Authorization', createTokenToHeader(authToken))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err,res)=>{
            expect(err).toBe(null)
            expect(typeof res.body.data).toBe('object')

            expect(res.body.data.showMeWhoCouldBeMyFriend.length).toBe(3)

            //the undecided users
            expect(res.body.data.showMeWhoCouldBeMyFriend[0].id).toBe(userIds[3])
            expect(res.body.data.showMeWhoCouldBeMyFriend[0].username).toBe(userTestDatas[4].username)
            expect(res.body.data.showMeWhoCouldBeMyFriend[0].mutualFriendCount).toBe(0)
            expect(res.body.data.showMeWhoCouldBeMyFriend[0].relation).toBe('UNCERTAIN')

            expect(res.body.data.showMeWhoCouldBeMyFriend[1].id).toBe(userIds[4])
            expect(res.body.data.showMeWhoCouldBeMyFriend[1].username).toBe(userTestDatas[5].username)
            expect(res.body.data.showMeWhoCouldBeMyFriend[1].mutualFriendCount).toBe(0)
            expect(res.body.data.showMeWhoCouldBeMyFriend[1].relation).toBe('UNCERTAIN')

            //the only friend of the friend
            expect(res.body.data.showMeWhoCouldBeMyFriend[2].id).toBe(userIds[2])
            expect(res.body.data.showMeWhoCouldBeMyFriend[2].username).toBe(userTestDatas[3].username)
            expect(res.body.data.showMeWhoCouldBeMyFriend[2].mutualFriendCount).toBe(1)
            expect(res.body.data.showMeWhoCouldBeMyFriend[2].relation).toBe('INITIATED')
            done()
        })
    })
})

describe('Grapql friend mutations', ()=>{
    it('1 Initiate friendship', (done)=>{
        const authToken = autorizTokenEncoder({ subj: userIds[0], email: userEmails[0] } )
        request(theSrv)
        .post('/graphql')
        .send({query: ` mutation{
                createAFriendshipInvitation(friendid: "${userIds[5]}"){
                    id, username, mutualFriendCount, relation
                }
            }`
        })
        .set('Authorization', createTokenToHeader(authToken))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err,res)=>{
            expect(err).toBe(null)
            expect(typeof res.body.data).toBe('object')

            expect(res.body.data.createAFriendshipInvitation.id).toBe(
                userIds[5]
            )
            expect(res.body.data.createAFriendshipInvitation.relation).toBe(
                'INITIATED'
            )
            ProfileModel.findOne({_id: userIds[0]}, (error, doc)=>{
                expect(error).toBe(null)
                expect(doc.initiatedCon.includes(userIds[5])).toBeTruthy()

                ProfileModel.findOne({ _id: userIds[5]}, (e, d)=>{
                    expect(e).toBe(null)
                    expect(d.undecidedCon.includes(userIds[0])).toBeTruthy()
                    done()
                })
            })
        })
    })

    it('2 Remove friendship initiation', (done)=>{
        const authToken = autorizTokenEncoder({ subj: userIds[0], email: userEmails[0] })
        request(theSrv)
        .post('/graphql')
        .send({query: `mutation{
                removeAFriendshipInitiation(friendid: "${userIds[5]}"){
                    resultText, useridAtProcess
                }
            }
        `})
        .set('Authorization', createTokenToHeader(authToken))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end( (err,res)=>{
            expect(err).toBe(null)
            expect(typeof res.body.data).toBe('object')

            expect(res.body.data.removeAFriendshipInitiation.useridAtProcess).toBe(
                userIds[5]
            )
            expect(res.body.data.removeAFriendshipInitiation.resultText).toBe(
                'Firendship initiation cancelled!'
            )

            ProfileModel.findOne({_id: userIds[0]}, (error, doc)=>{
                expect(error).toBe(null)
                expect(doc.initiatedCon.includes(userIds[5])).toBeFalsy()

                ProfileModel.findOne({ _id: userIds[5]}, (e, d)=>{
                    expect(e).toBe(null)
                    expect(d.undecidedCon.includes(userIds[0])).toBeFalsy()
                    done()
                })
            })
        })
    })

    it('3 Remove friendship request', (done)=>{
        const authToken = autorizTokenEncoder({ subj: userIds[0], email: userEmails[0] })
        request(theSrv)
        .post('/graphql')
        .send({query: ` 
            mutation{
                removeThisFriendshipRequest(friendid: "${userIds[4]}"){
                    resultText, useridAtProcess
                }
            }
        `})
        .set('Authorization', createTokenToHeader(authToken))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end( (err,res)=>{
            expect(err).toBe(null)
            expect(typeof res.body.data).toBe('object')

            expect(res.body.data.removeThisFriendshipRequest.useridAtProcess).toBe(
                userIds[4])
            expect(res.body.data.removeThisFriendshipRequest.resultText).toBe(
                'Firendship request cancelled!'
            )

            ProfileModel.findOne({_id: userIds[0]}, (error, doc)=>{
                expect(error).toBe(null)
                expect(doc.undecidedCon.includes(userIds[4])).toBeFalsy()

                ProfileModel.findOne({ _id: userIds[4]}, (e, d)=>{
                    expect(e).toBe(null)
                    expect(d.initiatedCon.includes(userIds[0])).toBeFalsy()
                    done()
                })
            })
        })
    })

    it('4 Approve friendship request', (done)=>{
        const authToken = autorizTokenEncoder({ subj: userIds[0], email: userEmails[0] })
        request(theSrv)
        .post('/graphql')
        .send({query: ` 
            mutation{
                approveThisFriendshipRequest(friendid: "${userIds[3]}"){
                    id, username, email
                }
            }
        `})
        .set('Authorization', createTokenToHeader(authToken))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end( (err,res)=>{
            expect(err).toBe(null)
            expect(typeof res.body.data).toBe('object')

            expect(res.body.data.approveThisFriendshipRequest.id).toBe(
                userIds[3]
            )
            expect(res.body.data.approveThisFriendshipRequest.email).toBe(
                userEmails[3]
            )
            ProfileModel.findOne({_id: userIds[0]}, (error, doc)=>{
                expect(error).toBe(null)
                expect(doc.undecidedCon.includes(userIds[3])).toBeFalsy()
                expect(doc.friends.includes(userIds[3])).toBeTruthy()

                ProfileModel.findOne({ _id: userIds[3]}, (e, d)=>{
                    expect(e).toBe(null)
                    expect(d.initiatedCon.includes(userIds[0])).toBeFalsy()
                    expect(d.friends.includes(userIds[0])).toBeTruthy()
                    done()
                })
            })
        })
    })

    it('5 Remove a friendship', (done)=>{
        const authToken = autorizTokenEncoder({ subj: userIds[0], email: userEmails[0] })
        request(theSrv)
        .post('/graphql')
        .send({query: ` 
            mutation{
                removeThisFriend(friendid: "${userIds[1]}"){
                    resultText, useridAtProcess
                }
            }
        `})
        .set('Authorization', createTokenToHeader(authToken))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end( (err,res)=>{
            expect(err).toBe(null)
            expect(typeof res.body.data).toBe('object')

            expect(res.body.data.removeThisFriend.useridAtProcess).toBe(
                userIds[1]
            )
            expect(res.body.data.removeThisFriend.resultText).toBe(
                'Firendship removed!'
            )
            ProfileModel.findOne({_id: userIds[0]}, (error, doc)=>{
                expect(error).toBe(null)
                expect(doc.friends.includes(userIds[1])).toBeFalsy()

                ProfileModel.findOne({ _id: userIds[1]}, (e, d)=>{
                    expect(e).toBe(null)
                    expect(d.friends.includes(userIds[0])).toBeFalsy()
                    done()
                })
            })
        })
    })
})
