
/**
 * 
 * sources:
 * https://github.com/websockets/ws/blob/ea6c054e975a715b83a8ca20e5af1bbcf80f90e5/examples/express-session-parse/index.js
 */
class UserNotifier {
    constructor(id, wsUnit, ownerCollection){
        this.userID = id
        this.wSocket = wsUnit
        this.isAlive = true
        this.parentCollection = ownerCollection 
        
        this.connectionChecking = setInterval(()=>{
            if(!this.isAlive){ this.terminateConnection() }

            this.isAlive = false
            this.wSocket.ping()
        }, 30000)

        this.wSocket.on('pong', ()=>{
            this.isAlive = true
        })
        this.wSocket.on('error', ()=>{
            this.terminateConnection()
        })

    }

    /**
     * Make a notification to an addresse, which changed and how
     * @param {*} targetID objectID, that is targeted by this message - the front 
     * app of the addressee need to update some content on that
     * @param {*} msgObj possible new object, the new content of the change
     * @param {*} superType defines which type of change done
     * FRIEND, POST, COMMENT, CHAT
     * @param {*} subType message objective
     * FRIEND
     * - invitationCreted = an friend-invitation created toward the addressee
     * - invitationCancelled = a friend-incitation cancelled toward the addressee
     * - connectionCancelled = an existiing freindship ended
     * - requestCreated = the addressee's invitation is accepted
     * - requestDiscarded = the addresse's invitation is removed
     * POST
     * - dedicatedPost
     * POST + COMMENT
     * - contentChanged
     * - commented
     * - unCommented
     * - opinioned
     * - unOpinioned
     * CHAT
     * - newToGroup
     * - newToYou
     * - removedOne
     */    
    makeNotification(targetID, msgObj, superType, subType){
        this.wSocket.send(JSON.stringify({
            text: 'You have a friend-connected change!',
            connectedFriend: targetid,
            eventType
        }))
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

module.exports = UserNotifier