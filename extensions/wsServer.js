const WebSocket = require('ws')
const { createServer } = require('http')

const PORT_WS = process.env.PORT2 || 3030;

const { wsAuthenticationRevise } = require('../utils/inputRevise')
const { webSocketAuthenticationRevise, authorizTokenVerify } = require('../utils/tokenManager')
const ProfileModel = require('../models/ProfileModel')

const wss = new WebSocket.Server({ noServer: true });
const server = createServer()
/**
 * WebSocked connection at Node-Express server
 * with the main purpose of notifying each users, if
 * they got any change at the content, that they are connected with
 * 
 * used sources: 
 * https://www.npmjs.com/package/ws
 * https://github.com/websockets/ws/blob/HEAD/doc/ws.md
 * https://stackoverflow.com/questions/4361173/http-headers-in-websockets-client-api
 */

module.exports.wsExtensionStart = (residentNotifierService, testPurpose)=>{

    server.on('upgrade', async (request, socket, head)=>{

        const tokenObj = webSocketAuthenticationRevise(request)
        if(!tokenObj.tokenMissing){
            const tokenRes = await authorizTokenVerify(tokenObj)
            if(!tokenRes.isExpired || !tokenRes.error || tokenRes.accesPermission){
                console.log('Token verified, sessionID: ' + tokenRes.subj)

                wss.handleUpgrade(request, socket, head, function done(ws) {
                    residentNotifierService.subscribeUser(
                        tokenRes.subj, socket
                    )
                    wss.emit('connection', ws, request);
                });
            }

        }
        /*
        console.log(request.url)
        const 
        console.log('Token verified, sessionID: ' + tokenRes.subj)

        wss.handleUpgrade(request, socket, head, function done(ws) {
            userMap.set(request.sessionID, new userNotif(ws,request.sessionID, userMap))

            wss.emit('connection', ws, request);
        });
*/
    })
    wss.on('connection', function connection(ws, request) {
        ws.send('Connection established!');
        ws.on('close', (code, reason)=>{

        })
    });

    wss.on('error', (code)=>{
        console.log(code)
    })
    if(!testPurpose){
        server.listen(PORT_WS, ()=>{
            console.log('WebSocket running on port ' + server.address().port)
        })
    }
}
  
module.exports.wsExtensionStop = ()=>{
    server.close()
}