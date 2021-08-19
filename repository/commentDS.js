const MyDataSource = require('./generalDataSource')
const CommentModel = require('../models/CommentModel')

const { isThisAnArray, isThisAnEmptyArray, isThisProperDocID } = require('./datasourceHelpers')

class CommentDataSource extends MyDataSource{
    constructor(cacheConfig){
        super(CommentModel, cacheConfig)
    }


    async recursiveRemovalOfThese(arrayKeys){
        if(!isThisAnArray(arrayKeys)){
            return
        }
        if(!isThisAnEmptyArray(arrayKeys)){
            return
        }
        
        try{
            for(const commID of arrayKeys){
                const commentToDel = await super.get(commID)
                if(!isThisAnEmptyArray(commentToDel.comments)){
                   await this.recursiveRemovalOfThese(commentToDel.comments)
                }
                await super.deleting(contentToDel._id);
            }
        }catch(err){
            this.didEncounterError(err)
        }

    }
}


module.exports = CommentDataSource