const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema({
    owner: mongoose.Schema.Types.ObjectId,
    startedAt: Date,
    title: String,
    partners: [ mongoose.Schema.Types.ObjectId ]
})

ChatSchema.methods.isThisOwnerInChat = function(userIDObj){
    return this.owner.equals(userIDObj)
}
ChatSchema.methods.isThisMemberInChat = function(userIDObj){
    return this.owner.equals(userIDObj) ||
        this.partners.includes(userIDObj)
}

ChatSchema.methods.getWhosMembersNeedToNotify = function(actUserIDObj){
    if(this.owner.equals(actUserIDObj)){
        return this.partners
    }
    const users = this.partners.filter(prtn=>{
        return !prtn.equals(actUserIDObj)
    })
    users.push(this.owner)
    return users
}

ChatSchema.virtual('getChatBasicDatas').get(function(){
    return {
        chatid: this._id,
        title: this.title,
        startedAt: this.startedAt
    }
})
ChatSchema.methods.getChatRoomDatas = function(msgObj){
    return {
        chatid: this._id,
        partners: this.partners,
        owner: this.owner,
        title: this.title,
        startedAt: this.startedAt,
        messages: msgObj
    }
}
module.exports = mongoose.model('chattings', ChatSchema)