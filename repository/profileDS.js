const ProfileModel = require('../models/ProfileModel')
const MyDataSource = require('./generalDataSource')

const { isThisUndefined, isItRealEmail, isThisProperDocID } = require('./datasourceHelpers')
const DataLoader = require('dataloader')

class ProfileDataSource extends MyDataSource{
    /**
     * Apollo Server DataSource to Profile colelction
     * @param {*} cacheConfig possible outer caching definition ttlInSeconds 
     * as cache time duration
     */
    constructor(cacheConfig){
        super(ProfileModel, cacheConfig)

        this.loaderWithEmail = new DataLoader(keys=>{
            return Promise.all( 
                keys.map( key=>{ return this.dbModel.findOne({ email: key }) }) 
            )
        })
    }

    /**
     * Load in a document from pointed collection of database, depending on type, 
     * uses a key to do this
     * @param {*} key mongoose document property - ObjectId or email value to search 
     * @param {*} cacheConfig optinal, cache ttlInSeconds as cache time duration
     * @returns mongoose document object
     */
    async get(key, { ttlInSeconds } = {}){
        if(isThisUndefined(key)){
            return '';
        }
        if(isThisProperDocID(key)){
            const caching = ttlInSeconds? { ttlInSeconds } : ''
            return super.get(key, caching)
        }
        if(!isItRealEmail(key)){
            this.didEncounterError( new Error('Not reasonable keyword is passed! ' + key))
        }

        const cachedDoc = await this.cache.get(this.cacheKey(key))
        if (cachedDoc) {
            return JSON.parse(cachedDoc)
        }
        
        const doc = await this.loaderWithEmail.load(key)
        if (ttlInSeconds || this.globalTTLinSec) {
            const ttlValue = ttlInSeconds || this.globalTTLinSec
            this.cache.set(
                this.cacheKey(key), JSON.stringify(doc), { ttl: ttlValue }
            )
            this.cache.set(
                this.cacheKey(doc._id), JSON.stringify(doc), { ttl: ttlValue }
            )
        }
        
        return doc
    }
}

module.exports = ProfileDataSource
