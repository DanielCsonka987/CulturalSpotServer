const WebSocket = require('ws')
const { createServer } = require('http')

const PORT_WS = process.env.PORT2 || 3030;

const { webSocketAuthenticationRevise, authorizTokenVerify 
    } = require('../utils/tokenManager')


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
 * https://github.com/JonnyFox/websocket-node-express/blob/master/server/src/server.ts
 */

module.exports.wsExtensionStart = (residentNotifierService, testPurpose)=>{

    server.on('upgrade', async (request, socket, head)=>{
        const tokenObj = webSocketAuthenticationRevise(request)
        if(!tokenObj.tokenMissing){
            const tokenRes = await authorizTokenVerify(tokenObj)
            if(!tokenRes.isExpired || !tokenRes.error || tokenRes.accesPermission){
                //console.log('Token verified, sessionID: ' + tokenRes.subj)
                wss.handleUpgrade(request, socket, head, function done(ws) {
                    request.sessionID = tokenRes.subj
                    wss.emit('connection', ws, request);
                });
            }
        }
    })
    wss.on('connection', (ws, request)=>{
        residentNotifierService.subscribeUser(
            request.sessionID, ws
        )
    })
    wss.on('open', function open(ws, request) {
        ws.send('Connection established!');
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