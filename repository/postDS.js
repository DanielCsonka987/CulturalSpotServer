const MyDataSource = require('./generalDataSource')
const DataLoader = require('dataloader')

const PostModel = require('../models/PostModel')
const { isThisAnArray, isThisProperDocID } = require('./datasourceHelpers')

class PostDataSource extends MyDataSource{
    constructor(cacheConfig){
        super(PostModel, cacheConfig)

        this.cacheWithOwner = new DataLoader(keys=>{
            return Promise.all(keys.map(
                key=>{ return this.dbModel.find({owner: key}) })
            )
        })
    }


    /**
     * Loads in a specific post by PostId or loads in some posts according its owner
     * 'post' would be usefull in any case
     * 'owner' exmpl. at login
     * @param {*} key mongoose ObjectId or StringId of a doc or docs
     * @param {*} typeDefine seeking method config = 'post' / 'owner'
     * @param {*} cacheConfig optinal, config of caching duration
     * @returns Single ('post') doc or multiple ('owner') docs in array
     */
    async get(key, typeDefine, { ttlInSeconds } = {}){
        if(typeDefine === 'post'){
            const cacheing = ttlInSeconds? { ttlInSeconds } : ''
            return super.get(key, cacheing)
        }
        if(typeDefine === 'owner'){
            if(!isThisProperDocID(key)){
                this.didEncounterError( new Error('Not proper DocID were passed as owner') )
            }
            const cachedocs = await this.cache.get( this.cacheKey(key, 'an_owner'))
            if(cachedocs){
                return cachedocs
            }
            try{
                const fetchResults = await this.cacheWithOwner.load(key)
                if(!fetchResults){
                    return []
                }
                const ttlValue = ttlInSeconds || this.globalTTLinSec
                for(const doc of fetchResults){
                    this.cache.set( this.cacheKey(doc._id),
                        JSON.stringify(doc), { ttl: ttlValue }
                    )
                }
                this.cache.set( this.cacheKey(key, 'an_owner'),
                    JSON.stringify(fetchResults), { ttl: ttlValue }
                )
                return fetchResults
            }catch(err){            
                this.didEncounterError(err)
            }
        }
    }

    /**
     * Loads in some docs according to keys - postId/ownerId
     * 'post' exmpl. bunch of posts seeking, connected to a user (selection)
     * 'owner' exmpl. posts of firends seeking (postwall opening)
     * @param {*} keys array of ObjecId or StringId
     * @param {*} typeDefine definition of way to fetch
     * @param {*} cacheConfig optinal, config of caching duration
     * @returns array of Mongoose Documents that were hit by the seeking
     */
    async getAllOfThese(keys, typeDefine, cacheConfig){
        if(!isThisAnArray(keys) ){
            return this.get(keys, typeDefine, cacheConfig)
        }
        if(typeDefine === 'post'){
            let results = []
            for(const id of keys){
                results.push( await super.get(id, cacheConfig) )
            }
            return results
        }
        if(typeDefine === 'owner'){
            const results = []
            for(const key of keys){
                results.push( await this.get(key, typeDefine, cacheConfig) )
            }
            return results
        }
    }

    /**
     * Deletes a bunch of post by its ObjectId or StringId
     * @param {*} keys array of post id-s
     */
    async deletingAllOfThese(keys){
        if(isThisAnArray(keys)){
            const needToDelete = keys.map(key=>{
                if(isThisProperDocID(key)){ return key }
            })
            for(const delKey of needToDelete){
                super.deleting(delKey)
            }
        }
        super.deleting(keys)
    }
}

module.exports = PostDataSource