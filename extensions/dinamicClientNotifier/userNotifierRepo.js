
const userNotifUnit = require('./userNotifierUnit')

class UserNotifierRepository{
    constructor(){
        this.userMap = new Map()
    }
    
    /**
     * Initiate a notification to a user
     * @param {*} userIDStr user as addressee of warning
     * @param {*} targetID objectID that changed
     * @param {*} msgObj updated obj, if needed
     * @param {*} superType global type of change
     * FRIEND, POST COMMENT, CHAT
     * @param {*} subType message objective
     */
    makeNotification(userIDStr, targetID, msgObj, superType, subType){

        this.userMap.get(userIDStr).makeNotification(
            targetID, msgObj, superType, subType
        )

    }
    
    /**
     * Set the new user in notification service
     * @param {*} userIDStr userID as identifier
     * @param {*} socket websocket connection
     */
    subscribeUser(userIDStr, socket){
        this.userMap.set(
            userIDStr, 
            new userNotifUnit(userIDStr, socket, this.userMap)
        )
    }

    /**
     * 
     * @param {*} userIDStr 
     */
    unSubscribeUser(userIDStr){
        this.userMap.get(userIDStr).stopConnection()
        this.userMap.delete(userIDStr)
    }

    /**
     * Testing puropse - supervise amount change
     * @returns number of actual users in service
     */
    getUserAmount(){
        return this.userMap.size
    }

    getThisUser(userIDStr){
        return this.userMap.get(userIDStr)
    }
}

module.exports = UserNotifierRepository