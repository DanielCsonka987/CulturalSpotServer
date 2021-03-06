
const ObjectIdType = require('mongoose').Types.ObjectId
const DocType = require('mongoose').Document

module.exports = {
    isThisUndefined(target){
        return (typeof target === 'undefined')
    },
    isThisAnEmptyArray(target){
        return (target.length === 0)

    },
    isThisAnArray(target){
        return (typeof target === 'object' && typeof target.length === 'number' &&
            typeof target.length !== 'null') || Array.isArray(target)
    },
    isThisProperDocID(target){
        if(target instanceof ObjectIdType){
            return true
        }
        if(typeof target === 'string' && target.length === 24 && target.match(/[0-9a-f]{24}/g)){
            return true
        }
        return false;
    },
    isThisProperDocObj(target){
        return target instanceof DocType
    },
    isThisProperForDocParts(target){
        if(target instanceof Object && !Array.isArray(target)){
            return Object.keys(target).length > 0 
        }
        return false

    },
    isItRealEmail(target){
        if(typeof target !== 'string'){
            return false
        }
        return (target.trim().search(/@/) > -1)? true : false
    }
}

