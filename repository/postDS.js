const MyDataSource = require('./generalDataSource')
const DataLoader = require('dataloader')

const PostModel = require('../models/PostModel')
const { isThisAnArray, isThisProperDocID } = require('./dataSourceHelpers')

class PostDataSource extends MyDataSource{
    constructor(cacheConfig){
        super(PostModel, cacheConfig)
        this.loaderWithDedication = new DataLoader(keys=>{
            return Promise.all(keys.map(
                key=>{ return this.dbModel.find({ dedicatedTo: key }) }
            ))
        })
    }

    async getByDedication(key, { ttlInSeconds } = {}){
        if(!isThisProperDocID(key)){
            this.didEncounterError( new Error('Not proper DocID were passed as dedication') )
        }
        try{
            const fetchResults = await this.loaderWithDedication.load(key)
            if(!fetchResults){
                return []
            }
            const ttlValue = ttlInSeconds || this.globalTTLinSec
            for(const doc of fetchResults){
                this.cache.set( this.cacheKey(doc._id),
                    JSON.stringify(doc), { ttl: ttlValue }
                )
            }
            return fetchResults
        }catch(err){            
            this.didEncounterError(err)
        }
    }

    
    
    /**
     * Loads in some docs according to keys - postId
     * @param {*} keys arrays in single array of ObjecId or StringId
     * @param {*} cacheConfig optinal, config of caching duration
     * @returns array of Mongoose Documents that were hit by the seeking
     *//*
    async getAllPostsFromGroups(keys, cacheConfig){
        if(!isThisAnArray(keys) ){
            return this.get(keys, typeDefine, cacheConfig)
        }
        let results = []
        for(const friendPosts of keys){
            for(const id of friendPosts){
                results.push( await super.get(id, cacheConfig) )
            }
        }
        return results
    }
    */


    /**
     * Deletes a bunch of post by its ObjectId or StringId
     * @param {*} keys array of post id-s
     */
    async deletingAllOfThese(keys){
        if(isThisAnArray(keys)){
            for(const id of keys){
                await super.deleting(id)
            }
        }else{
            await super.deleting(keys)
        }
    }
}

module.exports = PostDataSource