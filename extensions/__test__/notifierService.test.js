const WebSocket = require('ws')

const { wsExtensionStart, wsExtensionStop } = require('../wsServer')
const { createTokenHeader } = require('./testHelpers')
//ws = new WebSocket(‘ws://localhost’, null, { headers: { Authorization: token }})
const usersRepo = require('../dinamicClientNotifier/userNotifierRepo')

const activeRepo = new usersRepo
beforeAll(()=>{

    wsExtensionStart(activeRepo)

})

afterAll((done)=>{

    wsExtensionStop()
    done()

})

describe('Testing WsExtension', ()=>{

    it('Server general processing 1 - proper input', (done)=>{
        const token = createTokenHeader( '0123456789abcdef01234567', 'example@emailer.com')
        const wsclient = new WebSocket(`ws://localhost:3030/${token}`);
        wsclient.on('message', (msg)=>{
            expect(msg).toBe('Connection established!')
        })
        setTimeout(()=>{

            expect(activeRepo.getUserAmount()).toBe(1)
            expect(activeRepo.getThisUser('0123456789abcdef01234567')).not.toBe(null)
            done()
        }, 1500)
    })
    
})