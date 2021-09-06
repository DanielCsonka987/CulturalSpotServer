const { startSession } = require('mongoose')

const MyDataSource = require('./generalDataSource')
const MessageModel = require('../models/MessageModel')

const { isThisProperDocID, isThisProperForDocParts, isThisAnArray }
    = require('./dataSourceHelpers')

/**
 * 
 * 
 * sources
 * https://mongoosejs.com/docs/transactions.html
 * https://velog.io/@rosewwross/Using-Transaction-in-Mongoose
 */

class MessagesDataSource extends MyDataSource{
    constructor(cacheConfig){
        super(MessageModel, cacheConfig)
    }


    async updateTheCacheWithArray(docArray, cacheConfig){
        if(isThisAnArray(docArray)){
            for(const doc of docArray){
                super.updateTheCache(doc, cacheConfig)
            }
        }else{
            throw new Error('No array passed to update cache')
        }
    }

    async getChattingWithPreciseDate(chatkey, dating, amount = 15){
        try{

            let countBack = amount
            const results = []

            const seekedDoc = await this.dbModel.findOne({ 
                chatid: chatkey, sentAt: dating 
            })
            results.push(seekedDoc)
            countBack--;

            let prevID = seekedDoc.prevMsg
            while(countBack > 0){
                const tempDoc = await super.get(prevID)
                results.push(tempDoc)
                countBack--;
                prevID = tempDoc.prevMsg
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

            const docToInsert = await this.dbModel.findOne({
                chatid: newPropValues.chatid, nextMsg: null  }).session(sessionObj)
            if(docToInsert){
                docToInsert.$session()
                docToInsert.nextMsg = docToCreate._id,
                await docToInsert.save()
                
                docToCreate.$session()
                docToCreate.prevMsg = docToInsert._id
                await docToCreate.save()
                
                await sessionObj.commitTransaction()
                sessionObj.endSession()
                this.updateTheCacheWithArray([ docToCreate, docToInsert ], cacheConfig)

                return docToCreate
            }else{
                new Error('No target to insert new message link!')
            }
        }catch(err){
            await sessionObj.abortTransaction()
            sessionObj.endSession()
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