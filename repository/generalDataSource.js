/*
 This is built for the purpose of createing Apollo Server one-request DataSource

 Priority is data-fetching, caching -> persistent data paralel the cache update.
 Database manager library is Mongoose here - manage one database, but several 
 collections.
 Prerequisit - definitions of the Mongoose Schemas and Models, that need to be passed
 into the DataSource object!

 Used sources:
https://www.apollographql.com/blog/backend/data-sources/a-deep-dive-on-apollo-data-sources/
https://oliha.dev/articles/using-dataloader-in-graphql/
https://www.npmjs.com/package/dataloader
https://mongoosejs.com/docs/guides.html
 */

const { DataSource } = require('apollo-datasource')
const { InMemoryLRUCache } = require('apollo-server-caching')
const DataLoader = require('dataloader')

const { isThisAnArray, isThisProperDocID, isThisProperDocObj, areTheseProperDocParts }
    = require('./datasourceHelpers')

class CSDataSource extends DataSource{
    constructor(DbModel, { ttlInSeconds } = {}){
        super()
        this.dbModel = DbModel
        this.globalTTLinSec = ttlInSeconds
        this.loader = new DataLoader(keys=>{ 
            return Promise.all( 
                keys.map( key =>{ return this.dbModel.findById(key) })
            )
        })
    }

    initialize({ context, cache}){
        this.context = context;
        this.cache = cache || new InMemoryLRUCache()
    }

    didEncounterError(error){ 
        throw error
    }

    cacheKey(key, typeDef){
        const keystr = (typeof key === 'object')? key.toString() : key;
        const typestr = typeDef? typeDef + '-' : '';
        return `CS-${this.dbModel.modelName}-${typestr}${keystr}`
    }
    /**
     * Load in a document from pointed collection of database
     * @param {*} id mongoose ObjectId as pointer of document
     * @param {*} cacheConfig optinal, cache ttlInSeconds as cache time duration
     * @returns mongoose document object
     */
    async get(id, { ttlInSeconds } = {} ){
        if(!isThisProperDocID(id)){
            this.didEncounterError( new Error('Not DocId was passed!') )
        }
        const cachedDoc = await this.cache.get(this.cacheKey(id))
        if (cachedDoc) {
            return JSON.parse(cachedDoc)
        }
        
        const doc = await this.loader.load(id)
        
        if (ttlInSeconds || this.globalTTLinSec) {
            const ttlValue = ttlInSeconds || this.globalTTLinSec
            this.cache.set(this.cacheKey(id), JSON.stringify(doc), { ttl: ttlValue })
        }
        
        return doc
    }
    /**
     * Loads in bunch of documents from pointed collection of database
     * @param {*} ids array of ObjectId-s or single ObjectId as pointer of documents
     * @param {*} cacheConfig optinal, cache ttlInSeconds as cache time duration
     * @returns array of promise objects that results mongoose document objects
     */
     async getAllOfThese(ids, cacheConfig ){
        if(isThisAnArray(ids) ){
            let results = []
            for(const id of ids){
                results.push( await this.get(id, cacheConfig) )
            }
            return results
        }
        return await this.get(ids, cacheConfig)
    }

    /**
     * Creating a doc that fits to the schema of tha collection
     * @param {*} newPropValues object of document properties and values to persist
     * @param {*} cacheConfig optinal, cache ttlInSeconds as cache time duration
     * @returns newly created mongoose document object
     */
    async create(newPropValues, { ttlInSeconds } = {}){
        if(!areTheseProperDocParts(newPropValues)){
            this.didEncounterError( new Error('Not proper doc parts were passed!') )
        }
        try {
            const docToCreate = new this.dbModel(newPropValues)
            await docToCreate.save()

            if (ttlInSeconds || this.globalTTLinSec) {
                const ttlValue = ttlInSeconds || this.globalTTLinSec
                this.cache.set(
                    this.cacheKey(docToCreate._id), 
                    JSON.stringify(docToCreate), { ttl: ttlValue }
                )
            }

            return docToCreate
          } catch (error) {
            this.didEncounterError(error)
          }
    }
    /**
     * Executes saving at pointed and altered mongoose document
     * @param {*} id mongoose ObjectId as pointer of document
     * @param {*} cacheConfig optinal, cache ttlInSeconds as cache time duration
     */
    async saving(docObj, { ttlInSeconds } = {} ){
        if(!isThisProperDocObj(docObj) ){
            this.didEncounterError( new Error('Not proper DocObj was passed!') )
        }
        try{
            await docObj.save()
            this.cache.delete(this.cacheKey(docObj._id))
            if (ttlInSeconds || this.globalTTLinSec) {
                const ttlValue = ttlInSeconds || this.globalTTLinSec
                this.cache.set(
                    this.cacheKey(docObj._id), JSON.stringify(docObj), { ttl: ttlValue }
                )
            }
        }catch(err){
            this.didEncounterError(err)
        }
    }

    /**
     * Executes deletion of the pointed document
     * @param {*} id the target ObjectId or stringId to remove
     */
    async deleting(id){
        if(!isThisProperDocID(id) ){
            this.didEncounterError( new Error('Not proper DocId was passed!') )
        }
        try{
            const report = await this.dbModel.deleteOne({ _id: id})
            if(report.deletedCount !== 1){
                this.didEncounterError(
                    new Error(`Deletion failed at ${this.dbModel.modelName} ${id}`)
                )
            }
            this.cache.delete(this.cacheKey(id))
        }catch(err){
            this.didEncounterError(err)
        }

    }
}



module.exports = CSDataSource