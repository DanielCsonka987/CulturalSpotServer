const MyDataSource = require('./generalDataSource')

const ChattingModel = require('../models/ChattingModel')

class ChattingsDataSource extends MyDataSource{
    constructor(cacheConfig){
        super(ChattingModel, cacheConfig)
    }

}

module.exports = ChattingsDataSource