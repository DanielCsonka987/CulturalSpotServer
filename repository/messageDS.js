const { startSession } = require('mongoose')

const MyDataSource = require('./generalDataSource')
const MessageModel = require('../models/MessageModel')

const { isThisProperDocID, isThisProperForDocParts, isThisAnArray }
    = require('./dsHelpers')

/**
 * DataSource implementation for manage the messages of chattings
 * Messages have DoubleLinked connections as graph and have MongoID as well
 * all alteration use transaction - updating the previous-next links is essential part
 * the chatting informations are managed elsewhere
 * 
 * sources
 * https://mongoosejs.com/docs/transactions.html
 * https://velog.io/@rosewwross/Using-Transaction-in-Mongoose
 */

class MessagesDataSource extends MyDataSource{
    constructor(cacheConfig){
        super(MessageModel, cacheConfig)
    }

    async getChattingWithPreciseDate(chatkey, dating, amount = 15){
        try{
            let countBack = amount
            const results = []
            let seekedDoc = null
            if(dating){
                seekedDoc = await this.dbModel.findOne({ 
                    chatid: chatkey, sentAt: dating 
                })
            }else{
                seekedDoc = await this.dbModel.findOne({ 
                    chatid: chatkey, nextMsg: null
                })
            }

            if(!seekedDoc){
                return results
            }
            results.push(seekedDoc)
            countBack--;

            if(!seekedDoc.prevMsg){
                return results
            }
            let prevID = seekedDoc.prevMsg
            while(countBack > 0){
                const tempDoc = await super.get(prevID)
                results.push(tempDoc)
                countBack--;
                prevID = tempDoc.prevMsg
                if(!prevID){
                    break
                }
            }

            return results
        }catch(err){
            this.didEncounterError(err)
        }
    }


    async create(newPropValues, cacheConfig){
        if(!isThisProperForDocParts(newPropValues)){
            this.didEncounterError( new Error('Not proper doc parts were passed!') )
        }

        const sessionObj = await startSession()
        try{
            sessionObj.startTransaction()
            
            newPropValues.nextMsg = null
            newPropValues.sentiments = []
            const docToCreate = await this.dbModel.create(newPropValues)
            docToCreate.$session()

            const docToInsert = await this.dbModel.findOne({
                _id: { $ne: docToCreate._id  },
                chatid: newPropValues.chatid,
                nextMsg: null  
            }).session(sessionObj)
            if(docToInsert){
                docToInsert.$session()
                docToInsert.nextMsg = docToCreate._id,
                await docToInsert.save()
                
                docToCreate.prevMsg = docToInsert._id
            }else{
                docToCreate.prevMsg = null
            }
            await docToCreate.save()
            await sessionObj.commitTransaction()
            sessionObj.endSession()

            if(docToInsert){ super.updateTheCache(docToInsert, cacheConfig) }
            super.updateTheCache(docToCreate, cacheConfig)

            return docToCreate
        }catch(err){
            await sessionObj.abortTransaction()
            sessionObj.endSession()
            this.didEncounterError(err)
        }
    }

    async deleteAllChattings(chatkey, cacheConfig){
        if(!isThisProperDocID(chatkey) ){
            this.didEncounterError( new Error('Not proper DocId was passed!') )
        }
        try{
            let lastMsg = await this.dbModel.findOneAndDelete({ 
                chatid: chatkey, nextMsg: null
            })
            while(lastMsg.prevMsg){
                const idToDel = lastMsg.prevMsg
                lastMsg = await this.dbModel.findByIdAndDelete(idToDel)
                this.cache.delete(this.cacheKey(idToDel))
            }
        }catch(err){
            this.didEncounterError(err)
        }
    }

    async deleting(msgkey, cacheConfig){
        if(!isThisProperDocID(msgkey) ){
            this.didEncounterError( new Error('Not proper DocId was passed!') )
        }

        const sessionObj = await startSession()
        try{
            sessionObj.startTransaction()

            const docToDelete = await this.dbModel.findById(msgkey).session(sessionObj)
            let prevDoc = null
            let nextDoc = null
            if(docToDelete.prevMsg){
                prevDoc = await this.dbModel.findById(docToDelete.prevMsg)
                    .session(sessionObj)
                prevDoc.$session()
            }
            if(docToDelete.nextMsg){
                nextDoc = await this.dbModel.findById(docToDelete.nextMsg)
                    .session(sessionObj)
                nextDoc.$session()
            }

            if(prevDoc){
                prevDoc.nextMsg = nextDoc? nextDoc._id : null
                await prevDoc.save()
                super.updateTheCache(prevDoc, cacheConfig)
            }
            if(nextDoc){
                nextDoc.prevMsg = prevDoc? prevDoc._id : null
                await nextDoc.save()
                super.updateTheCache(nextDoc, cacheConfig)
            }
            await this.dbModel.deleteOne({ _id: docToDelete._id }).session(sessionObj)

            await sessionObj.commitTransaction();
            sessionObj.endSession()
            this.cache.delete(this.cacheKey(docToDelete._id))
            
        }catch(err){
            await sessionObj.abortTransaction()
            sessionObj.endSession()
            this.didEncounterError(err)
        }
    }
}

module.exports = MessagesDataSource