const { createTestClient } = require('apollo-server-testing')
const { gql } = require('apollo-server-express');

const openServer = require('../server').startTestingServer
//const stopServer = require('../server').stopServer

/*
describe('Some header not required test attempts', ()=>{
    let theServer = null
    beforeAll(async ()=>{
        theServer = await openServer()
    })

    it('Testing query activate', async ()=>{
        const { query } = createTestClient(theServer)
        const THE_QUERY = `
        {
            testquery
        }
        `
        const response = await query({ query: THE_QUERY })
        expect(response.data.testquery).toBe('Server is running fine!')

    })
    
    it('Registration attempt', async ()=>{
        const { mutate } = createTestClient(theServer)

        const THE_REG = gql`
        {
            registration(
                
                    email: "valid@email.com"
                    username: "ThisHere"
                    password: "password"
                    passwordconf: "password"
                
            ){
                id
                username
                token
                tokenExpire
                registeredAt
            }
            
        }
        `

        const response = await mutate( {mutation: THE_REG })
        console.log(response.errors[0])
        expect(response.data.registration.usename).toBe('ThisHere')
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
        *//*
    })

    it('Testing query Password reset attempt', async ()=>{
        const { mutate } = createTestClient(theServer)
        const THE_RESET = gql`
        {
            resetPassword(email: "mehere@hotmail.com"){
                processResult
                resultText
            }
        }
        `
        const response = await mutate({ mutation: THE_RESET })
        console.log(response.errors[0])
        //expect(response.data.testquery).toBe('Server is running fine!')

    })

})
*/

describe('Change username attepmts', ()=>{

})

describe('Deleta account attempts', ()=>{

})
