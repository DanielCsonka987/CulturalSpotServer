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

describe('Testing WsExtension 1', ()=>{

    it('Server general processing - registring the user', (done)=>{
        const token = authorizTokenEncoder({subj: '0123456789abcdef01234567', email: 'example@emailer.com'})
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
    

    it('Server messeging to client', (done)=>{
        const token = authorizTokenEncoder({ subj: '0123456789abcdef0123456a', email: 'example@emailer.com'})
        const wsclient = new WebSocket(`ws://localhost:3030/${token}`);
        wsclient.on('message', (msg)=>{

            if(msg.length === 23){
                expect(msg).toBe('Connection established!')
            }else{

                const pollRes = JSON.parse(msg)
                expect(typeof pollRes).toBe('object')
                
                expect(typeof pollRes.event).toBe('string')
                expect(pollRes.event).toBe('comment')
                expect(typeof pollRes.eventMethod).toBe('string')
                expect(pollRes.eventMethod).toBe('contentChanged')

                expect(typeof pollRes.connectedTo).toBe('string')
                expect(pollRes.connectedTo).toBe('0123')
                expect(typeof pollRes.payload).toBe('object')
                expect(typeof pollRes.payload.commentid).toBe('string')
                expect(pollRes.payload.commentid).toBe('abcdef')
                expect(typeof pollRes.payload.content).toBe('string')
                expect(pollRes.payload.content).toBe('Stg')

                expect(typeof pollRes.payload.comments).toBe('object')
                expect(pollRes.payload.comments).toHaveLength(0)
                expect(typeof pollRes.payload.sentiments).toBe('object')
                expect(pollRes.payload.sentiments).toHaveLength(0)
            }   
        })


        setTimeout(()=>{
            expect(activeRepo.getUserAmount()).toBe(2)
            expect(activeRepo.getThisUser('0123456789abcdef0123456a')).not.toBe(null)

            activeRepo.sendNotification('0123456789abcdef0123456a', 
                '0123', { commentid: 'abcdef', content: 'Stg', comments: [], sentiments: [] }, 
                notifyTypes.COMMENT.CONTENT_CHANGED
            )
            setTimeout(()=>{
                done()  //time for proper msg evaluation at client
            }, 100)
        }, 1500)
    })

    it('Server notifier dislogging', ()=>{

        expect(activeRepo.getUserAmount()).toBe(2)
        activeRepo.unSubscribeUser('0123456789abcdef0123456a')
        expect(activeRepo.getUserAmount()).toBe(1)

    })
    
})
