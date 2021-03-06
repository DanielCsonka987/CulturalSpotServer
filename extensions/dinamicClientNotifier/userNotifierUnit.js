

const notifyTypes = {
    FRIEND: {
        INVITATION_CREATED: [ 0, 'createdInvitation', 'add'],
        INVITATION_CANCELLED: [ 0, 'cancelledInvitation', 'remove'],
        REQUEST_APPROVED: [ 0, 'approvedRequest', 'add'],
        REQUEST_DISCARDED: [ 0, 'discardedRequest', 'remove'],
        CONNECTION_DISCARDED: [ 0, 'removedFriendship', 'remove'],
    },
    POST: {
        NEW_POST: [1, 'postMade', 'add'],
        CONTENT_CHANGED: [ 1, 'contentChanged', 'update'],
        POST_REMOVED: [ 1, 'postRemoved', 'remove'],
        COMMENT_CREATED: [ 1, 'commentCreated', 'add'],
        COMMENT_UPDATED: [ 1, 'commentUpdated', 'update' ],
        COMMENT_DELETED: [ 1, 'commentDeleted', 'remove'],
        OPINION_ADDED: [ 1, 'opinionedAdded', 'add'],
        OPINION_UPDATED: [ 1, 'opinionedUpdated', 'update'],
        OPINION_REMOVED: [ 1, 'opinionRemoved', 'remove']
    }, 
    COMMENT: {
        COMMENT_CREATED: [ 2, 'commentCreated', 'add'],
        COMMENT_UPDATED: [ 2, 'commentUpdated', 'update' ],
        COMMENT_DELETED: [ 2, 'commentDeleted', 'remove'],
        OPINION_ADDED: [ 2, 'opinionedAdded', 'add'],
        OPINION_UPDATED: [ 2, 'opinionedUpdated', 'update'],
        OPINION_REMOVED: [ 2, 'opinionRemoved', 'remove']
    },
    
    CHAT:{
        CHATROOM_CREATED: [3, 'createdChatRoom', 'add'],
        CHATROOM_CLIENT_ADDED: [3, 'partnerAddedToChatRoom', 'add'],
        CHATROOM_CLIENT_REMOVED: [3, 'partnerRemovedFromChatroom', 'remove'],
        CHATROOM_UPDATED: [3, 'updatedChatRoom', 'update' ], 
        CHATROOM_REMOVED: [3, 'deletedChatRoom', 'remove'],

        NEW_MESSAGE: [ 3, 'sentMessage', 'add'],
        MESSAGE_EDITED: [ 3, 'messageEdited', 'update' ],
        MESSAGE_REMOVED: [ 3, 'messageRemoved', 'remove' ],
        OPINION_ADDED: [ 3, 'opinionedAdded', 'add'],
        OPINION_UPDATED: [ 3, 'opinionedUpdated', 'update'],
        OPINION_REMOVED: [ 3, 'opinionRemoved', 'remove' ]
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
            eventMethod: msgType[1],
            properAction: msgType[2],
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