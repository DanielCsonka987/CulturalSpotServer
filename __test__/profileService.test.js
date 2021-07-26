
const request = require('supertest')

const ProfileModel = require('../models/ProfileModel')
const { tokenEncoder } = require('../utils/tokenManager')
const { startTestingServer, exitTestingServer } = require('../server')

let theSrv = null;
beforeAll( async ()=>{
    theSrv =  await startTestingServer(true)
})
afterAll(async ()=>{
    await exitTestingServer()
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
            console.log(res.text)
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
            return done()
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
                return done()
            })
            return done()
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

                ProfileModel.deleteOne({ _id: theNewId }, (errObj, resObj)=>{
                    expect(errObj).toBe(null)
                    return done()
                })
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
                        id, processResult, resultText
                    }
                }`
            })
            .set('Authorazition', 'Bearer ' + tokenToAuth)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end((err, res)=>{
                expect(err).toBe(null)
                expect(typeof res.body.data).toBe('object')

                expect(res.body.data.changePassword.id).toEqual(theUserId)
                expect(res.body.data.changePassword.processResult).toBe(true)
                expect(res.body.data.changePassword.resultText).toBe('Your password changed!')
    
                ProfileModel.findOne({_id: res.body.data.changePassword.id}, async (error, doc)=>{
                    expect(error).toBe(null)
                    expect(doc.pwdHash).not.toEqual(theOldHashPwd)
    
                    doc.pwdHash = theOldHashPwd
                    await doc.save()
                    done()
                })
            })

        })
    })
})

