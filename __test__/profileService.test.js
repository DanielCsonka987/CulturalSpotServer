
//const serverApp = require('../server').theServer
//const openServer = require('../server').startServer
//const stopServer = require('../server').stopServer

jest.useFakeTimers()

beforeAll((done)=>{
    //openServer.then(()=>{ done()  })
})
afterAll(async ()=>{
    //await stopServer
})

describe('Registration attempts',()=>{
    it('Stg', ()=>{
        /*
        request(serverApp)
        .post('http://localhost:4040/')
        .send({
            mutation: `{
                registration:(
                    retistrationInput: {
                        email: "exmaple@hotmail.com"
                        username: "aUser Here"
                        password: "password",
                        passwordconf: 'password'
                    }
                ){
                    id
                    token
                    registeredAt
                    username
                }
            }`
        })
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res)=>{
            expect(err).toBe(null)
            expect(res.body).toBeInstanceOf(Object);
        })
        */
    })
})

describe('Login attempts', ()=>{

})

describe('Reset forgotten password attempts', ()=>{

})

describe('Change username attepmts', ()=>{

})

describe('Deleta account attempts', ()=>{

})
