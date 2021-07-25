module.exports = (reqObj, localDomainObj)=>{
    if(!localDomainObj.url){
        localDomainObj.url = reqObj.protocol + reqObj.get('host');
        Object.freeze(localDomainObj)
    }
    return localDomainObj.url
}