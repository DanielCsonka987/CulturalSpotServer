const WebSocket = require('ws')

const { wsExtensionStart, wsExtensionStop } = require('../wsServer')
const { authorizTokenEncoder } = require('../../utils/tokenManager')

//ws = new WebSocket(‘ws://localhost’, null, { headers: { Authorization: token }})
const usersRepo = require('../dinamicClientNotifier/userNotifierRepo')
const { notifyTypes } = require('../dinamicClientNotifier/userNotifierUnit')

const activeRepo = new usersRepo
beforeAll(()=>{

    wsExtensionStart(activeRepo, false)

})

afterAll((done)=>{

    wsExtensionStop()
    done()

})


describe('Testing WsExtension 2 - Long term repository-unit testing',()=>{
    it('Ping server->pong client test - userUnit remains in Repository', (done)=>{

        const token = authorizTokenEncoder({subj: '0123456789abcdef0123456b', email: 'example@emailer.com'})
        const wsclient = new WebSocket(`ws://localhost:3030/${token}`);
        wsclient.on('message', (msg)=>{
            expect(msg).toBe('Connection established!')
        })
        wsclient.on('ping', (msg)=>{
            wsclient.pong('Here')
        })

        setTimeout(()=>{
            expect(activeRepo.getUserAmount()).toBe(1)
            const res = activeRepo.getThisUser('0123456789abcdef0123456b').isAlive
            expect(typeof res).toBe('boolean')
            expect(res).toBeTruthy()
            done()
        },32000)

    }, 35000)

    it('Ping server only - userUnit not remains in Repository', (done)=>{

        const token = authorizTokenEncoder({subj: '0123456789abcdef0123456c', email: 'example@emailer.com'})
        const wsclient = new WebSocket(`ws://localhost:3030/${token}`);
        wsclient.on('message', (msg)=>{
            expect(msg).toBe('Connection established!')
        })

        setTimeout(()=>{
            wsclient.close()    //no chance for pong msg, but still in server system
            expect(activeRepo.getUserAmount()).toBe(2)

            setTimeout(()=>{
                const res1 = activeRepo.getThisUser('0123456789abcdef0123456c')
                expect(res1.isAlive).toBeFalsy()    //targeted to remove

                setTimeout(()=>{
                    const res2 = activeRepo.getThisUser('0123456789abcdef0123456c')
                    expect(typeof res).toBe('undefined')
                    expect(activeRepo.getUserAmount()).toBe(1)
                    done()
                }, 30000)
            }, 12000)
        },20000)

    }, 65000)
})