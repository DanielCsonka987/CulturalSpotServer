const MyDataSource = require('./generalDataSource')
const CommentModel = require('../models/CommentModel')

const { isThisAnArray, isThisAnEmptyArray } = require('./dataSourceHelpers')

class CommentDataSource extends MyDataSource{
    constructor(cacheConfig){
        super(CommentModel, cacheConfig)
    }


    async recursiveRemovalOfThese(arrayKeys){
        if(!isThisAnArray(arrayKeys)){
            return this.didEncounterError( new Error('No array were passed!') )
        }

        if(isThisAnEmptyArray(arrayKeys)){
            return  //no need to go further here
        }
        try{
            for(const commID of arrayKeys){
                const commentToDel = await super.get(commID)
                if(!isThisAnEmptyArray(commentToDel.comments)){
                   await this.recursiveRemovalOfThese(commentToDel.comments)
                }
                await super.deleting(commentToDel._id);
            }
        }catch(err){
            this.didEncounterError(err)
        }

    }
}


module.exports = CommentDataSource