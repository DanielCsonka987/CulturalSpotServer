const MyDataSource = require('./generalDataSource')
const CommentModel = require('../models/CommentModel')

const { isThisUndefined, isThisProperDocID } = require('./datasourceHelpers')

class CommentDataSource extends MyDataSource{
    constructor(cacheConfig){
        super(CommentModel, cacheConfig)
    }

}


module.exports = CommentDataSource