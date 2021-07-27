
const request = require('supertest')

const ProfileModel = require('../models/ProfileModel')
const EmailReportModel = require('../models/EmailReportModel')
const { createTokenToHeader } = require('./helperToTesting')
const { tokenEncoder } = require('../utils/tokenManager')
const { startTestingServer, exitTestingServer } = require('../server')

let theSrv = null;
beforeAll( async ()=>{
    theSrv =  await startTestingServer(true)
    await ProfileModel.deleteMany(
        {email: ['user@gmail.com', 'example@emailhost.com'] } , async (err, report)=>{
        
        await ProfileModel.create({
            email: 'user@gmail.com',
            username: 'Me Here',
            pwdHash: '$2b$12$hG6DWeSU99Y07IcQY.FqKuOAocajSUtHyr7yU4NTO7nsKZdJXZlJS',  //testPwd
            registeredAt: '2011-10-05T14:48:00.000Z',
            lastLoggedAt: '2021-07-27T11:46:46.718Z'
        }, (error, report)=>{
            expect(error).toBe(null)
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
            "query": `mutation{ login(email:"mehere@hotmail.com", password: "testPwd") { id, token, tokenExpire, registeredAt } }`
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
                    email:"example@emailhost.com", username: "Somebody Here",
                    password: "testText", passwordconf: "testText" )
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
            expect(res.body.data.registration.username).toBe('Somebody Here')

            const theNewId = res.body.data.registration.id
            ProfileModel.findOne({ _id: theNewId }, (error, result)=>{
                expect(error).toBe(null)
                expect(result.username).toBe('Somebody Here')
                done()
            })
        })
    })
    it('Change pwd attempt', (done)=>{
        const userEmailTarget = 'user@gmail.com';
        let theUserId = '';
        let theOldHashPwd = ''; 
        ProfileModel.findOne({email: userEmailTarget}, (err, doc)=>{
            expect(err).toBe(null)
            theUserId = doc._id.toString();
            theOldHashPwd = doc.pwdHash;

            let tokenToAuth = tokenEncoder({ subj: theUserId, email: userEmailTarget })
    
            request(theSrv)
            .post("/graphql")
            .send({
                query: `mutation{
                    changePassword(oldpassword: "testPwd", 
                    newpassword: "againPwd", newconf: "againPwd")
                    {
                        id, username, email, resultText
                    }
                }`
            })
            .set('Authorazition', createTokenToHeader(tokenToAuth))
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

                    doc.pwdHash = theOldHashPwd;
                    await doc.save()
                    done()
                })
            })

        })
    })

    it('Change user detail attempt', (done)=>{
        const userEmailTarget = 'user@gmail.com';
        const newUsername = 'John Doe'
        let theUserId = '';
        let theOldName = ''; 
        ProfileModel.findOne({email: userEmailTarget}, (err, doc)=>{
            expect(err).toBe(null)
            theUserId = doc._id.toString();
            theOldName = doc.username

            let tokenToAuth = tokenEncoder({ subj: theUserId, email: userEmailTarget })

            request(theSrv)
            .post('/graphql')
            .send({query: `mutation{
                changeAccountDatas(username: "${newUsername}"){
                    id, username, email, resultText
                }
            }`})
            .set('Authorazition', createTokenToHeader(tokenToAuth))
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
        const userEmailTarget = 'user@gmail.com';
        let theUserId = '';
        ProfileModel.findOne({email: userEmailTarget}, (err, doc)=>{
            expect(err).toBe(null)
            theUserId = doc._id.toString();

            let tokenToAuth = tokenEncoder({ subj: theUserId, email: userEmailTarget })

            request(theSrv)
            .post('/graphql')
            .send({query: `mutation{
                deleteAccount(password: "testPwd", passwordconf: "testPwd"){
                    id, username, email, resultText
                }
            }`})
            .set('Authorazition', createTokenToHeader(tokenToAuth))
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
                    done()
                })  
            })
        })
    })
    it('ResetPassword attempt', (done)=>{
        const userEmailTarget = 'example@emailhost.com';
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
                            expect(docObj.resetPwdToken).not.toBe(undefined)
                            done()
                        })
    
                    })  
                }, 1000)
            })
        })
        
    })


})

