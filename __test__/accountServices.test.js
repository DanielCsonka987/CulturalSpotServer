
const request = require('supertest')
const jwt = require('jsonwebtoken')

const ProfileModel = require('../models/ProfileModel')
const ChatModel = require('../models/ChattingModel')
const EmailReportModel = require('../models/EmailReportModel')
const { createTokenToHeader, userTestDatas, userTestRegister, chatTestDatas1 } 
    = require('./helperToTestingServices')
const { authorizTokenEncoder, createLoginRefreshToken,
    authorizTokenVerify, authorizTokenInputRevise,
    createResetTokenToLink } = require('../utils/tokenManager')
const { startTestingServer, exitTestingServer } = require('../server')

const userTesting = new Map()

let theSrv = null;
beforeAll((done)=>{
    const removeContent = userTestDatas.map(item=>{ return item.email })
    removeContent.push(userTestRegister.email)
    ProfileModel.deleteMany({email: removeContent } , async (e1, r1)=>{
        expect(e1).toBe(null)
        theSrv =  await startTestingServer(true, true)  //ethereal emailer start

        ProfileModel.insertMany(userTestDatas, (e2, prfls)=>{
            expect(e2).toBe(null)
            expect(typeof prfls).toBe('object')

            ChatModel.deleteOne({ title: chatTestDatas1[0].title }, (e3, r3)=>{
                expect(e3).toBe(null)
                
                ChatModel.create(chatTestDatas1[0], async (e4, chtng)=>{
                    expect(e4).toBe(null)

                    for(const item of prfls){
                        userTesting.set(item.username, { id: item._id.toString(), email: item.email, obj: item._id })
                    }
                    //id at pointer 0 will be removed
                    //id at pointer 1 will be at the main target of friend management tests
                    //id at pointer 3 will be login with -> lastLogin field must changes
                    for(const item of prfls){
                        if(item._id.toString() === userTesting.get('User 1').id){
                            item.friends.push(userTesting.get('User 2').obj)   //at mut.5 removed
                            item.myInvitations.push(userTesting.get('User 3').obj)
                            item.myFriendRequests.push(userTesting.get('User 4').obj)  //at mut.4 accepted
                            item.myFriendRequests.push(userTesting.get('User 5').obj)  //at mut.3 removed
                            await item.save()
                        }
                        if(item._id.toString() === userTesting.get('User 2').id){
                            item.friends.push(userTesting.get('User 1').obj)
                            item.friends.push(userTesting.get('User 3').obj)
                            item.myChats.push(chtng._id)
                            await item.save()

                            chtng.owner = item._id
                            await chtng.save()
                        }
                        if(item._id.toString() === userTesting.get('User 3').id){
                            item.myFriendRequests.push(userTesting.get('User 1').obj)
                            item.friends.push(userTesting.get('User 2').obj)
                            await item.save()
                        }
                        if(item._id.toString() === userTesting.get('User 4').id){
                            item.myInvitations.push(userTesting.get('User 1').obj)
                            await item.save()
                        }
                        if(item._id.toString() === userTesting.get('User 5').id){
                            item.resetPwdMarker = '1636659924221'
                            item.myInvitations.push(userTesting.get('User 1').obj)
                            await item.save()
                        }
                    }
                    //the user6 exist - at mut.1 initiated friendship, that at mut.2 removed
        
                    done()

                })
            })
        })
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
            expect(res.body.errors).toBe(undefined)

            expect(res.text.includes('Web site created using create-react-app'))
                .toBeTruthy()
            expect(res.text.includes('<noscript>')).toBeTruthy()
            expect(res.text.includes('You need to enable JavaScript to run this app.')).toBeTruthy()
            done()
        })
            
    })
})

describe('GET ResetPassword step-2 tests', ()=>{
    it('GET URL - no real input', (done)=>{
        request(theSrv)
        .get('/passwordresetting/123')
        .expect("Content-Type", /text\/html/)
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body.errors).toBe(undefined)

            const cookies = res.header['set-cookie']
            expect(cookies[0].includes('srverror=No_authroization_to_use_this_service!_Please_repeat_the_resetting_process_from_the_begining!;' + 
                ' Max-Age=10; Path=/passwordresetting/123;') ).toBeTruthy()

            expect(res.text.includes('Web site created using create-react-app'))
                .toBeTruthy()
            expect(res.text.includes('<noscript>')).toBeTruthy()
            expect(res.text.includes('You need to enable JavaScript to run this app.')).toBeTruthy()
            done()
        })
    })
    it('GET URL - token, no valid Userid', (done)=>{

        const theToken = createResetTokenToLink('0123456', 'hashPwd', '012345abcd')
        request(theSrv)
        .get(`/passwordresetting/${theToken}`)
        .expect("Content-Type", /text\/html/)
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body.errors).toBe(undefined)

            const cookies = res.header['set-cookie']
            expect(cookies[0].includes('srverror=The_system_connot_find_the_pointed_account!_Please_repeat_the_resetting_process_from_the_begining!;' + 
                ' Max-Age=10; Path=/passwordresetting/' + theToken + ';') ).toBeTruthy()

            expect(res.text.includes('Web site created using create-react-app'))
                .toBeTruthy()
            expect(res.text.includes('<noscript>')).toBeTruthy()
            expect(res.text.includes('You need to enable JavaScript to run this app.')).toBeTruthy()
            done()
        })
    })
    it('GET URL - token, valid Userid, no marker in DB', (done)=>{
        const targetUserEmail = userTesting.get('User 6').email
        ProfileModel.find({email: targetUserEmail }, (e, d)=>{
            expect(e).toBe(null)
            expect(d[0]).not.toBe(null)
            const theToken = createResetTokenToLink('0123456', 'hashPwd', d[0]._id.toString() )
            request(theSrv)
            .get(`/passwordresetting/${theToken}`)
            .expect("Content-Type", /text\/html/)
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)
                expect(res.body).toBeInstanceOf(Object);
                expect(res.body.errors).toBe(undefined)

                const cookies = res.header['set-cookie']
                expect(cookies[0].includes('srverror=No_permission_to_reset_this_account_password!_Please_repeat_the_resetting_process_from_the_begining!;' + 
                    ' Max-Age=10; Path=/passwordresetting/' + theToken + ';') ).toBeTruthy()

                expect(res.text.includes('Web site created using create-react-app'))
                    .toBeTruthy()
                expect(res.text.includes('<noscript>')).toBeTruthy()
                expect(res.text.includes('You need to enable JavaScript to run this app.')).toBeTruthy()
                done()
            })

        })
    })
    
    it('GET URL - token, valid Userid and marker in DB, encryption not proper', (done)=>{
        const targetUserEmail = userTesting.get('User 6').email
        ProfileModel.find({email: targetUserEmail }, async (e, d)=>{
            expect(e).toBe(null)
            expect(d[0]).not.toBe(null)
            d[0].resetPwdMarker = '0123456'
            await d[0].save()

            const theToken = createResetTokenToLink('0123456', 'hashPwd', d[0]._id.toString() )
            request(theSrv)
            .get(`/passwordresetting/${theToken}`)
            .expect("Content-Type", /text\/html/)
            .expect(200)
            .end( async (err, res)=>{
                expect(err).toBe(null)
                expect(res.body).toBeInstanceOf(Object);
                expect(res.body.errors).toBe(undefined)

                const cookies = res.header['set-cookie']
                expect(cookies[0].includes('srverror=Identifing_you_is_failed!_Please_repeat_the_resetting_process_from_the_begining!;' + 
                    ' Max-Age=10; Path=/passwordresetting/' + theToken + ';') ).toBeTruthy()

                expect(res.text.includes('Web site created using create-react-app'))
                    .toBeTruthy()
                expect(res.text.includes('<noscript>')).toBeTruthy()
                expect(res.text.includes('You need to enable JavaScript to run this app.')).toBeTruthy()

                d[0].resetPwdMarker = ''
                await d[0].save()
                done()
            })
        })
    })
    it('GET URL - token, expired', (done)=>{
        const targetUserEmail = userTesting.get('User 6').email
        ProfileModel.find({email: targetUserEmail }, async (e, d)=>{
            expect(e).toBe(null)
            expect(d[0]).not.toBe(null)
            d[0].resetPwdMarker = '0123456'
            await d[0].save()

            const theToken = d[0]._id.toString() + '.' + jwt.sign({marker: '0123456'}, 
                '0123456' + d[0].pwdHash, { expiresIn: '1ms' }
            )
            request(theSrv)
            .get(`/passwordresetting/${theToken}`)
            .expect("Content-Type", /text\/html/)
            .expect(200)
            .end(async (err, res)=>{
                expect(err).toBe(null)
                expect(res.body).toBeInstanceOf(Object);
                expect(res.body.errors).toBe(undefined)

                const cookies = res.header['set-cookie']
                expect(cookies[0].includes('srverror=Password_resetting_request_is_already_expired!_Please_repeat_the_resetting_process_from_the_begining!;' + 
                    ' Max-Age=10; Path=/passwordresetting/' + theToken + ';') ).toBeTruthy()

                expect(res.text.includes('Web site created using create-react-app'))
                    .toBeTruthy()
                expect(res.text.includes('<noscript>')).toBeTruthy()
                expect(res.text.includes('You need to enable JavaScript to run this app.')).toBeTruthy()

                d[0].resetPwdMarker = ''
                await d[0].save()
                done()
            })
        })
    })
    it('GET URL - token, all proper', (done)=>{
        const targetUserEmail = userTesting.get('User 6').email
        ProfileModel.find({email: targetUserEmail }, async (e, d)=>{
            expect(e).toBe(null)
            expect(d[0]).not.toBe(null)
            d[0].resetPwdMarker = '0123456'
            await d[0].save()

            const theToken = d[0]._id.toString() + '.' + jwt.sign({marker: '0123456'}, 
                '0123456' + d[0].pwdHash, { expiresIn: '10min' }
            )
            request(theSrv)
            .get(`/passwordresetting/${theToken}`)
            .expect("Content-Type", /text\/html/)
            .expect(200)
            .end(async (err, res)=>{
                expect(err).toBe(null)
                expect(res.body).toBeInstanceOf(Object);
                expect(res.body.errors).toBe(undefined)

                expect(res.header['set-cookie']).toBe(undefined)

                expect(res.text.includes('Web site created using create-react-app'))
                    .toBeTruthy()
                expect(res.text.includes('<noscript>')).toBeTruthy()
                expect(res.text.includes('You need to enable JavaScript to run this app.')).toBeTruthy()
                
                d[0].resetPwdMarker = ''
                await d[0].save()
                done()
            })
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
            expect(res.body.data.testquery).toMatch('Server is running fine')
            done()
        })
    })

    it('Rerequest users all private content', (done)=>{
        const userEmailTarget = userTesting.get('User 2').email;
        const theUserId = userTesting.get('User 2').id;
        let tokenToAuth = authorizTokenEncoder({ subj: theUserId, email: userEmailTarget })
        
        request(theSrv)
        .post(`/graphql`)
        .send({'query':` query{
            requireClientContent{
                id, username, email, registeredAt, lastLoggedAt,
                friends, invitations, requests, allPosts{
                    postid, content
                }, allChats{
                    chatid, title
                }
            }
        }`})
        .set('Authorization', createTokenToHeader(tokenToAuth))
        .set('Accept', 'application/json')
        .expect("Content-Type", 'application/json; charset=utf-8')
        .expect(200)
        .end(async (err, res)=>{
            expect(err).toBe(null)
            expect(res.body).toBeInstanceOf(Object);
            expect(res.body.errors).toBe(undefined)

            expect(res.body.data.requireClientContent.username).toMatch('User 2')
            expect(res.body.data.requireClientContent.email).toMatch(userEmailTarget)
            expect(res.body.data.requireClientContent.friends).toBe(2)
            expect(res.body.data.requireClientContent.allChats).toHaveLength(1)
            done()
        })
    })
    it('Login attempt', (done)=>{
        request(theSrv)
        .post('/graphql')
        .send({
            "query": `mutation{
                 login(email:"${userTesting.get('User 3').email}", password: "testing") 
                { id, token, tokenExpire, registeredAt }
            }`
        })
        .set("Accept", "application/json")
        .expect('Content-Type', "application/json; charset=utf-8")
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)

            expect(typeof res.body.data.login.id).toBe('string')

            const theGotId = res.body.data.login.id
            ProfileModel.findOne({ _id: theGotId }, (error, result)=>{
                expect(error).toBe(null)
                expect(result).not.toBe(null)
                expect(result.registeredAt.toISOString()).toEqual(res.body.data.login.registeredAt)
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
            expect(res.body.errors).toBe(undefined)

            expect(typeof res.body.data.registration.id).toBe('string')
            expect(typeof res.body.data.registration.username).toBe('string')
            expect(res.body.data.registration.username).toBe(userTestRegister.username)

            const theNewId = res.body.data.registration.id
            ProfileModel.findOne({ _id: theNewId }, (error, result)=>{
                expect(error).toBe(null)
                expect(result).not.toBe(null)
                expect(result.username).toBe(userTestRegister.username)

                userTesting.set(result.username, { id: result._id.toString(), email: result.email, obj: result._id })
                EmailReportModel.findOne({ msgto: result.email }, (errorObj, doc)=>{
                    expect(errorObj).toBe(null)
                    expect(doc).not.toBe(null)

                    EmailReportModel.deleteOne({_id: doc._id }, (e, r)=>{
                        expect(e).toBe(null)
                        
                        done()
                    })
                })
            })
        })
    })
    it('Change pwd attempt', (done)=>{
        const userEmailTarget = userTesting.get('User 2').email;
        const theUserId = userTesting.get('User 2').id;
        let theOldHashPwd = ''; 
        ProfileModel.findOne({email: userEmailTarget}, (err, doc)=>{
            expect(err).toBe(null)
            theOldHashPwd = doc.pwdHash;

            let tokenToAuth = authorizTokenEncoder({ subj: theUserId, email: userEmailTarget })
    
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
                expect(res.body.errors).toBe(undefined)

                expect(res.body.data.changePassword.id).toBe(theUserId)
                expect(res.body.data.changePassword.resultText).toBe('Your password changed!')
    
                ProfileModel.findById(res.body.data.changePassword.id, (error, doc)=>{
                    expect(error).toBe(null)
                    expect(doc).not.toBe(null)
                    expect(doc.pwdHash).not.toEqual(theOldHashPwd)
                    /*console.log('The new password hash to check in the DB record. \n %s \n %s',
                        doc._id.toString(),
                        doc.pwdHash)*/
                    done()
                })
            })

        })
    })

    it('Change user detail attempt', (done)=>{
        const userEmailTarget = userTesting.get('User 1').email;
        const theUserId = userTesting.get('User 1').id;
        const newUsername = 'Recognisable NAME'
        const tokenToAuth = authorizTokenEncoder({ subj: theUserId, email: userEmailTarget })

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
            expect(res.body.errors).toBe(undefined)

            expect(typeof res.body.data).toBe('object')
            expect(typeof res.body.data.changeAccountDatas.id).toBe('string')
            expect(res.body.data.changeAccountDatas.id).toBe(theUserId)
            expect(res.body.data.changeAccountDatas.resultText).toBe('Account datas changed!')


            ProfileModel.findById(res.body.data.changeAccountDatas.id, (error, doc)=>{
                expect(error).toBe(null)
                expect(doc).not.toBe(null)
                expect(doc.username).toBe(newUsername)
                done()
            })  
            
        })
        
    })

    it('Delete account attempt', (done)=>{
        const userEmailTarget = userTesting.get('User 0').email;
        const theUserId = userTesting.get('User 0').id;

        let tokenToAuth = authorizTokenEncoder({ subj: theUserId, email: userEmailTarget })

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
            expect(res.body.errors).toBe(undefined)

            expect(typeof res.body.data).toBe('object')
            expect(typeof res.body.data.deleteAccount.id).toBe('string')
            expect(res.body.data.deleteAccount.id).toBe(theUserId)
            expect(res.body.data.deleteAccount.resultText).toBe('Account deleted!')

            ProfileModel.findOne({ _id: res.body.data.deleteAccount.id }, (error, doc)=>{
                expect(error).toBe(null)
                expect(doc).toBe(null)
                userTesting.delete('User 0')

                EmailReportModel.findOne({ msgto: userEmailTarget }, (errorObj, doc)=>{
                    expect(errorObj).toBe(null)
                    expect(doc).not.toBe(null)

                    EmailReportModel.deleteOne({_id: doc._id }, (e, r)=>{
                        expect(e).toBe(null)
                        
                        done()
                    })
                })

                done()
            })  
        })
        
    })
    it('ResetPassword step-1 attempt', (done)=>{
        const userEmailTarget = userTesting.get('User 4').email;
        const theUserId = userTesting.get('User 4').id;

        request(theSrv)
        .post('/graphql')
        .send({query: `mutation{
            resetPasswordStep1(email: "${userEmailTarget}"){
                id, username, email, resultText
            }
        }`})
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)

            expect(typeof res.body.data).toBe('object')
            expect(typeof res.body.data.resetPasswordStep1.id).toBe('string')
            expect(res.body.data.resetPasswordStep1.id).not.toBe(theUserId)
            expect(res.body.data.resetPasswordStep1.id).toBe('none')
            expect(res.body.data.resetPasswordStep1.resultText).toBe('Password reset email is sent!')

                EmailReportModel.findOne({ msgto: userEmailTarget }, (error, doc)=>{
                    expect(error).toBe(null)
                    expect(doc).not.toBe(null)

                    ProfileModel.findOne({ _id: theUserId }, (errObj, docObj)=>{
                        expect(errObj).toBe(null)
                        expect(docObj).not.toBe(null)
                        expect(docObj.resetPwdMarker).not.toBe(undefined)

                        EmailReportModel.deleteOne({ _id: doc._id}, (e, r)=>{
                            expect(e).toBe(null)
                            done()
                        })
                    })

                })  

        })
        
        
    })

    it('RenewPassword setp3 - user send new password', (done)=>{
        const theUserId = userTesting.get('User 5').id;
        ProfileModel.findOne({ _id: theUserId }, (e1, d1)=>{
            expect(e1).toBe(null)
            expect(d1).not.toBe(null)
            expect(d1.resetPwdMarker).not.toBe(null)
            expect(d1.resetPwdMarker).not.toBe('')
            const oldHash = d1.pwdHash
            const resetToken = createResetTokenToLink(
                d1.resetPwdMarker, oldHash, d1._id
            )

            request(theSrv)
            .post('/graphql')
            .send({query: `mutation{
                resetPasswordStep3(newpassword: "testing", newconf: "testing"){
                    id, username, email, resultText
                }
            }`})
            .set('Accept', 'application/json')
            .set('Resetting', `${resetToken}`)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)
                expect(res.body.errors).toBe(undefined)
                
                expect(typeof res.body.data).toBe('object')
                expect(res.body.data.resetPasswordStep3.resultText).toBe('Password resetting done!')
                expect(res.body.data.resetPasswordStep3.email).toBe(d1.email)

                setTimeout(()=>{
                    ProfileModel.findOne({ _id: theUserId }, (e2, d2)=>{
                        expect(e2).toBe(null)
                        expect(d2).not.toBe(null)
    
                        expect(d2.pwdHash).not.toBe(oldHash)
                        expect(d2.resetPwdMarker).toBe('')
                        done()
                    })
                }, 500)
            })
        })

    })

    it('Renew authorization token', (done)=>{
        const userIdTarget = userTesting.get('User 5').id
        const refToken = createLoginRefreshToken({id: userIdTarget})
        ProfileModel.findOne({ _id: userIdTarget }, async (error, doc)=>{
            expect(error).toBe(null)
            
            doc.refreshToken = refToken;
            await doc.save()

            request(theSrv)
            .post('/graphql')
            .send({
                "query": `query{
                     refreshAuth
                    { id, newToken, tokenExpire }
                }`
            })
            .set("Accept", "application/json")
            .set("Refreshing", refToken)
            .expect('Content-Type', "application/json; charset=utf-8")
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)
                expect(res.body.errors).toBe(undefined)

                expect(res.body.data.refreshAuth.id).toBe(userIdTarget.toString())
                expect(typeof res.body.data.refreshAuth.newToken).toBe('string')
                expect(res.body.data.refreshAuth.tokenExpire).toBe(3600)
    
                const theNewAuthToken = createTokenToHeader(res.body.data.refreshAuth.newToken)
                const headerObj = { headers: { authorization: theNewAuthToken}}
                const verifTokenRes = authorizTokenInputRevise(headerObj)
                expect(verifTokenRes.tokenMissing).toBe(false)

                const tokenPalyload = authorizTokenVerify(verifTokenRes)
                expect(tokenPalyload.subj).toBe(userIdTarget.toString())
                expect(tokenPalyload.isExpired).toBe(false)
                done()
            })
        })
    })

    it('Logout process', (done)=>{
        const userIdTarget = userTesting.get('User 1').id
        const refToken = createLoginRefreshToken({id: userIdTarget})
        ProfileModel.findOne({_id: userIdTarget}, async (error, doc)=>{
            expect(error).toBe(null)
            doc.refreshToken = refToken;
            await doc.save()
            
            const authToken = authorizTokenEncoder(
                {subj: doc._id.toString(), email: doc.email}
            )

            request(theSrv)
            .post('/graphql')
            .send({
                "query": `mutation{
                     logout
                    { resultText, id, email, username }
                }`
            })
            .set("Accept", "application/json")
            .set("Authorization", createTokenToHeader(authToken))
            .expect('Content-Type', "application/json; charset=utf-8")
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)
                expect(res.body.errors).toBe(undefined)

                expect(res.body.data.logout.resultText).toBe('You have been logged out!')
                expect(res.body.data.logout.id).toBe(userIdTarget.toString())

                ProfileModel.findOne({_id: userIdTarget}, (e, d)=>{
                    expect(e).toBe(null)
                    expect(d).not.toBe(null)
                    expect(d.refreshToken).toBe('')

                    done()
                })
            })
        })
    })

})

describe('Graphql friend queries', ()=>{

    it('Seek users by username query', (done)=>{
        const userEmailTarget = userTesting.get('User 1').email;
        const userIdTarget = userTesting.get('User 1').id;
        const authToken = authorizTokenEncoder({ subj: userIdTarget, email: userEmailTarget } )
        request(theSrv)
        .post('/graphql')
        .send({query: ` query{
            searchForSomeUser(username: "${'User'}"){
                    userid, username, relation, mutualFriendCount
                }
            }`
        })
        .set('Authorization', createTokenToHeader(authToken))
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err,res)=>{
            expect(err).toBe(null)
            expect(res.body.errors).toBe(undefined)

            expect(typeof res.body.data.searchForSomeUser).toBe('object')
            expect(res.body.data.searchForSomeUser).toHaveLength(7) //User 0 -> User 6
            done()
        })
    })
    it('My friends query', (done)=>{
        const userEmailTarget = userTesting.get('User 1').email;
        const userIdTarget = userTesting.get('User 1').id;
        const authToken = authorizTokenEncoder({ subj: userIdTarget, email: userEmailTarget } )
        request(theSrv)
        .post('/graphql')
        .send({query: ` query{
            listOfMyFriends{
                    userid, username, email
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
            expect(res.body.errors).toBe(undefined)

            expect(typeof res.body.data.listOfMyFriends).toBe('object')
            expect(res.body.data.listOfMyFriends.length).toBe(1)
            expect(res.body.data.listOfMyFriends[0].userid).toBe(userTesting.get('User 2').id)
            expect(res.body.data.listOfMyFriends[0].email).toBe(userTesting.get('User 2').email)
            done()
        })
    })
    it('My undecided friend-request query', (done)=>{
        const userEmailTarget = userTesting.get('User 1').email;
        const userIdTarget = userTesting.get('User 1').id;
        const authToken = authorizTokenEncoder({ subj: userIdTarget, email: userEmailTarget } )
        request(theSrv)
        .post('/graphql')
        .send({query: ` query{
            listOfUndecidedFriendships{
                    userid, username, relation, mutualFriendCount
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
            expect(res.body.errors).toBe(undefined)

            expect(typeof res.body.data.listOfUndecidedFriendships).toBe('object')
            expect(res.body.data.listOfUndecidedFriendships.length).toBe(2)
            expect(res.body.data.listOfUndecidedFriendships[0].userid).toBe(userTesting.get('User 4').id)
            expect(res.body.data.listOfUndecidedFriendships[0].relation).toBe('UNCERTAIN')
            expect(res.body.data.listOfUndecidedFriendships[1].userid).toBe(userTesting.get('User 5').id)
            expect(res.body.data.listOfUndecidedFriendships[1].relation).toBe('UNCERTAIN')
            done()
        })
    })
    it('My initiated friend-request query', (done)=>{
        const userEmailTarget = userTesting.get('User 1').email;
        const userIdTarget = userTesting.get('User 1').id;
        const authToken = authorizTokenEncoder({ subj: userIdTarget, email: userEmailTarget } )
        request(theSrv)
        .post('/graphql')
        .send({query: ` query{
            listOfInitiatedFriendships{
                    userid, username, relation, mutualFriendCount
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
            expect(res.body.errors).toBe(undefined)

            expect(typeof res.body.data.listOfInitiatedFriendships).toBe('object')
            expect(res.body.data.listOfInitiatedFriendships.length).toBe(1)
            expect(res.body.data.listOfInitiatedFriendships[0].userid)
                .toBe(userTesting.get('User 3').id)
            expect(res.body.data.listOfInitiatedFriendships[0].relation)
                .toBe('INITIATED')
            done()
        })
    })
    it('Spec. users public account', (done)=>{
        const userEmailTarget = userTesting.get('User 1').email;
        const userIdTarget = userTesting.get('User 1').id;
        const authToken = authorizTokenEncoder({ subj: userIdTarget, email: userEmailTarget } )
        request(theSrv)
        .post('/graphql')
        .send({query: ` query{
            showThisUserInDetail(userid: "${userTesting.get('User 2').id}"){
                    userid, username, email, registeredAt, relation, mutualFriendCount, friends{
                        userid, username, relation, mutualFriendCount
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
            expect(res.body.errors).toBe(undefined)

            expect(typeof res.body.data.showThisUserInDetail)
                .toBe('object')
            expect(res.body.data.showThisUserInDetail.userid)
                .toBe(userTesting.get('User 2').id)
            expect(res.body.data.showThisUserInDetail.email)
                .toBe(userTesting.get('User 2').email)
            expect(res.body.data.showThisUserInDetail.relation)
                .toBe('FRIEND')
            done()
        })
    })
    it('Show-me-new-friends query', (done)=>{
        const userEmailTarget = userTesting.get('User 1').email;
        const userIdTarget = userTesting.get('User 1').id;
        const authToken = authorizTokenEncoder({ subj: userIdTarget, email: userEmailTarget } )
        request(theSrv)
        .post('/graphql')
        .send({query: ` query{
            showMeWhoCouldBeMyFriend{
                    userid, username, relation, mutualFriendCount
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
            expect(res.body.errors).toBe(undefined)

            expect(res.body.data.showMeWhoCouldBeMyFriend.length).toBe(3)

            //the undecided users
            expect(res.body.data.showMeWhoCouldBeMyFriend[0].userid)
                .toBe(userTesting.get('User 4').id)
            expect(res.body.data.showMeWhoCouldBeMyFriend[0].username)
                .toBe(userTestDatas[4].username)
            expect(res.body.data.showMeWhoCouldBeMyFriend[0].mutualFriendCount).toBe(0)
            expect(res.body.data.showMeWhoCouldBeMyFriend[0].relation)
                .toBe('UNCERTAIN')

            expect(res.body.data.showMeWhoCouldBeMyFriend[1].userid)
                .toBe(userTesting.get('User 5').id)
            expect(res.body.data.showMeWhoCouldBeMyFriend[1].username)
                .toBe(userTestDatas[5].username)
            expect(res.body.data.showMeWhoCouldBeMyFriend[1].mutualFriendCount).toBe(0)
            expect(res.body.data.showMeWhoCouldBeMyFriend[1].relation)
                .toBe('UNCERTAIN')

            //the only friend of the friend
            expect(res.body.data.showMeWhoCouldBeMyFriend[2].userid).toBe(userTesting.get('User 3').id)
            expect(res.body.data.showMeWhoCouldBeMyFriend[2].username).toBe(userTestDatas[3].username)
            expect(res.body.data.showMeWhoCouldBeMyFriend[2].mutualFriendCount).toBe(1)
            expect(res.body.data.showMeWhoCouldBeMyFriend[2].relation).toBe('INITIATED')
            done()
        })
    })
})

describe('Grapql friend mutations', ()=>{
    it('1 Initiate friendship', (done)=>{
        const userEmailTarget = userTesting.get('User 1').email;
        const userIdTarget = userTesting.get('User 1').id;
        const authToken = authorizTokenEncoder({ subj: userIdTarget, email: userEmailTarget } )
        request(theSrv)
        .post('/graphql')
        .send({query: ` mutation{
                createAFriendshipInvitation(userid: "${userTesting.get('User 6').id}"){
                    userid, username, mutualFriendCount, relation
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
            expect(res.body.errors).toBe(undefined)

            expect(res.body.data.createAFriendshipInvitation.userid)
                .toBe(userTesting.get('User 6').id)
            expect(res.body.data.createAFriendshipInvitation.relation)
                .toBe( 'INITIATED' )
            ProfileModel.findOne({_id: userTesting.get('User 1').id}, (error, doc)=>{
                expect(error).toBe(null)
                expect(doc).not.toBe(null)
                expect(doc.myInvitations.includes(userTesting.get('User 6').obj)).toBeTruthy()

                ProfileModel.findOne({ _id: userTesting.get('User 6').id }, (e, d)=>{
                    expect(e).toBe(null)
                    expect(d).not.toBe(null)
                    expect(d.myFriendRequests.includes(userTesting.get('User 1').obj)).toBeTruthy()
                    done()
                })
            })
        })
    })

    it('2 Remove friendship initiation', (done)=>{
        const userEmailTarget = userTesting.get('User 1').email;
        const userIdTarget = userTesting.get('User 1').id;
        const authToken = authorizTokenEncoder({ subj: userIdTarget, email: userEmailTarget } )
        request(theSrv)
        .post('/graphql')
        .send({query: `mutation{
                removeAFriendshipInitiation(userid: "${userTesting.get('User 3').id}"){
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
            expect(res.body.errors).toBe(undefined)

            expect(res.body.data.removeAFriendshipInitiation.useridAtProcess)
                .toBe( userTesting.get('User 3').id )
            expect(res.body.data.removeAFriendshipInitiation.resultText)
                .toBe( 'Friendship initiation cancelled!' )

            ProfileModel.findOne({_id: userTesting.get('User 1').id}, (error, doc)=>{
                expect(error).toBe(null)
                expect(doc.myInvitations.includes(userTesting.get('User 3').obj)).toBeFalsy()

                ProfileModel.findOne({ _id: userTesting.get('User 3').id}, (e, d)=>{
                    expect(e).toBe(null)
                    expect(d.myFriendRequests.includes(userTesting.get('User 1').obj)).toBeFalsy()
                    done()
                })
            })
        })
    })

    it('3 Remove friendship request', (done)=>{
        const userEmailTarget = userTesting.get('User 1').email;
        const userIdTarget = userTesting.get('User 1').id;
        const authToken = authorizTokenEncoder({ subj: userIdTarget, email: userEmailTarget } )
        request(theSrv)
        .post('/graphql')
        .send({query: ` 
            mutation{
                discardThisFriendshipRequest(userid: "${userTesting.get('User 5').id}"){
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
            expect(res.body.errors).toBe(undefined)

            expect(res.body.data.discardThisFriendshipRequest.useridAtProcess)
                .toBe(userTesting.get('User 5').id)
            expect(res.body.data.discardThisFriendshipRequest.resultText).toBe(
                'Friendship request discarded!'
            )

            ProfileModel.findOne({_id: userTesting.get('User 1').id }, (error, doc)=>{
                expect(error).toBe(null)
                expect(doc).not.toBe(null)
                expect(doc.myFriendRequests.includes(userTesting.get('User 5').obj)).toBeFalsy()

                ProfileModel.findOne({ _id: userTesting.get('User 5').id}, (e, d)=>{
                    expect(e).toBe(null)
                    expect(d).not.toBe(null)
                    expect(d.myInvitations.includes(userTesting.get('User 1').obj)).toBeFalsy()
                    done()
                })
            })
        })
    })

    it('4 Approve friendship request', (done)=>{
        const userEmailTarget = userTesting.get('User 1').email;
        const userIdTarget = userTesting.get('User 1').id;
        const authToken = authorizTokenEncoder({ subj: userIdTarget, email: userEmailTarget } )
        request(theSrv)
        .post('/graphql')
        .send({query: ` 
            mutation{
                approveThisFriendshipRequest(userid: "${userTesting.get('User 4').id}"){
                    userid, username, email
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
            expect(res.body.errors).toBe(undefined)

            expect(res.body.data.approveThisFriendshipRequest.userid)
                .toBe( userTesting.get('User 4').id )
            expect(res.body.data.approveThisFriendshipRequest.email)
                .toBe( userTesting.get('User 4').email )
            ProfileModel.findOne({_id: userTesting.get('User 1').id}, (error, doc)=>{
                expect(error).toBe(null)
                expect(doc).not.toBe(null)
                expect(doc.myFriendRequests.includes(userTesting.get('User 4').obj)).toBeFalsy()
                expect(doc.friends.includes(userTesting.get('User 4').obj)).toBeTruthy()

                ProfileModel.findOne({ _id: userTesting.get('User 4').id}, (e, d)=>{
                    expect(e).toBe(null)
                    expect(d).not.toBe(null)
                    expect(d.myInvitations.includes(userTesting.get('User 1').obj)).toBeFalsy()
                    expect(d.friends.includes(userTesting.get('User 1').obj)).toBeTruthy()
                    done()
                })
            })
        })
    })

    it('5 Remove a friendship', (done)=>{
        const userEmailTarget = userTesting.get('User 1').email;
        const userIdTarget = userTesting.get('User 1').id;
        const authToken = authorizTokenEncoder({ subj: userIdTarget, email: userEmailTarget } )
        request(theSrv)
        .post('/graphql')
        .send({query: ` 
            mutation{
                removeThisFriend(userid: "${userTesting.get('User 2').id}"){
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
            expect(res.body.errors).toBe(undefined)

            expect(res.body.data.removeThisFriend.useridAtProcess).toBe(
                userTesting.get('User 2').id
            )
            expect(res.body.data.removeThisFriend.resultText).toBe(
                'Friendship removed!'
            )
            ProfileModel.findOne({_id: userTesting.get('User 1').id}, (error, doc)=>{
                expect(error).toBe(null)
                expect(doc).not.toBe(null)
                expect(doc.friends.includes(userTesting.get('User 2').obj)).toBeFalsy()

                ProfileModel.findOne({ _id: userTesting.get('User 2').id}, (e, d)=>{
                    expect(e).toBe(null)
                    expect(d).not.toBe(null)
                    expect(d.friends.includes(userTesting.get('User 1').obj)).toBeFalsy()
                    done()
                })
            })
        })
    })
})
