

const notifyTypes = {
    FRIEND: {
        INVITATION_CREATED: [ 0, 'invitationCreated'],
        INVITATION_CANCELLED: [ 0, 'invitationCancelled'],
        CONNECTION_DISCARDED: [ 0, 'connectionDiscarded'],
        REQUEST_CREATED: [ 0, 'requestCreated'],
        REQUEST_DISCARDED: [ 0, 'requestDiscarded'],
    },
    POST: {
        CONTENT_CHANGED: [ 1, 'contentChanged'],
        DEDICATED_POST: [ 1, 'dedicatedPost'],
        COMMENTED: [ 1, 'commented'],
        UNCOMMENTED: [ 1, 'unCommented'],
        OPINION_ADDED: [ 1, 'opinionedAdded'],
        OPINION_REMOVED: [ 1, 'opinionRemoved']
    }, 
    COMMENT: {
        CONTENT_CHANGED: [ 2, 'contentChanged'],
        COMMENTED: [ 2, 'commented'],
        UNCOMMENTED: [ 2, 'unCommented'],
        OPINION_ADDED: [ 2, 'opinionedAdded'],
        OPINION_REMOVED: [ 2, 'opinionRemoved']
    },
    CHAT:{
        NEW_MESSAGE: [ 3, 'newMessage'],
        MESSAGE_EDITED: [ 3, 'messageEdited' ],
        MESSAGE_REMOVED: [ 3, 'messageRemoved' ],
        OPINION_ADDED: [ 3, 'opinionedAdded'],
        OPINION_REMOVED: [ 3, 'opinionRemoved']
    }
}
module.exports.notifyTypes = Object.freeze(notifyTypes)

const notifySuperTypes = {
    0: 'friend',
    1: 'post',
    2: 'comment',
    3: 'chat'
}

/**
 * 
 * sources:
 * https://github.com/websockets/ws/blob/ea6c054e975a715b83a8ca20e5af1bbcf80f90e5/examples/express-session-parse/index.js
 */
class UserNotifierUnit {
    constructor(id, wsUnit, ownerCollection){
        this.userID = id
        this.wSocket = wsUnit
        this.isAlive = true
        this.parentCollection = ownerCollection 
        
        //30s client ping gap -> 60s removal in case connection loss
        this.PING_PONG_TIMEGAP = 30000
        this.taskBuffer = new Array()

        this.connectionChecking = setInterval(()=>{
            if(!this.isAlive){ this.terminateConnection() }

            this.isAlive = false
            this.wSocket.ping()

        }, this.PING_PONG_TIMEGAP)

        this.wSocket.on('pong', ()=>{
            this.isAlive = true
        })
        this.wSocket.on('error', ()=>{
            this.terminateConnection()
        })

        //in case of reopening, buffer sending
        this.wSocket.on('open', ()=>{
            if(this.taskBuffer.size > 0){
                this.taskBuffer.forEach(item=>{
                    this.wSocket.send(item)
                })
            }
        })
    }

    /**
     * Make a notification to an addresse, which changed and how
     * @param {*} targetID objectID, that is targeted by this message - the front 
     * app of the addressee need to update some content on that
     * @param {*} msgObj possible new object, the new content of the change
     * @param {*} msgType defines which type of change done
     */    
    makeNotification(targetID, msgObj, msgType){

        const msg = JSON.stringify({
            event: notifySuperTypes[msgType[0]],
            eventType: msgType[1],
            connectedTo: targetID,
            payload: msgObj
        })
        if(this.isAlive){
            this.wSocket.send(msg)
        }else{
            this.taskBuffer.push(msg)
        }
    }


    /**
     * Initiate connection stop - external usage
     */
    stopConnection(){
        clearTimeout(this.connectionChecking)
        this.wSocket.terminate()
    }

    /**
     * Initiate connection stop - internal usage
     */
    terminateConnection(){
        clearTimeout(this.connectionChecking)
        this.parentCollection.delete(
            this.userID
        )
        this.wSocket.terminate()
    }
}

module.exports.userNotifierUnit = UserNotifierUnit