
const { userNotifierUnit } = require('./userNotifierUnit')

class UserNotifierRepository{
    constructor(){
        this.userMap = new Map()
    }
    
    /**
     * Initiate a notification to a user
     * @param {*} userIDStr user as addressee of warning
     * @param {*} targetID objectID that changed
     * @param {*} msgObj updated obj, if needed
     * @param {*} msgType message objective
     */
    sendNotification(userIDStr, targetID, msgObj, msgType){

        const usr = this.userMap.get(userIDStr)
        if(usr){
            usr.makeNotification(targetID, msgObj, msgType)
        }
    }

    /**
     * Set the new user in notification service
     * @param {*} userIDStr userID as identifier
     * @param {*} socket websocket connection
     */
    subscribeUser(userIDStr, socket){
        if(typeof userIDStr !== 'string'){
            return
        }
        this.userMap.set(
            userIDStr, 
            new userNotifierUnit(userIDStr, socket, this.userMap)
        )
    }

    /**
     * 
     * @param {*} userIDStr 
     */
    unSubscribeUser(userIDStr){
        if(typeof userIDStr !== 'string'){
            return
        }
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