const MyDataSource = require('./generalDataSource')
const CommentModel = require('../models/CommentModel')

const { isThisAnArray, isThisAnEmptyArray } = require('./dsHelpers')

class CommentDataSource extends MyDataSource{
    constructor(cacheConfig){
        super(CommentModel, cacheConfig)
    }


    async recursiveRemovalOfThese(keyObj){
        try{
            if(!isThisAnArray(keyObj)){
                const commentAtPeak = await super.get(keyObj)   // peak/starter comment
                await this.recursiveRemovalOfThese(commentAtPeak.comments);
                await super.deleting(commentAtPeak._id)
            }else{
                for(const commStamp of keyObj){
                    const commentToDel = await super.get(commStamp.commentid)
                    if(!isThisAnEmptyArray(commentToDel.comments)){
                       await this.recursiveRemovalOfThese(commentToDel.comments)
                    }
                    await super.deleting(commentToDel._id); // terminal comment
                }
            }

        }catch(err){
            this.didEncounterError(err)
        }

    }
}


module.exports = CommentDataSource