module.exports = (reqObj, localDomainObj)=>{
    if(!localDomainObj.url){
        localDomainObj.url = { prot: reqObj.protocol, dom: reqObj.get('host') };
        Object.freeze(localDomainObj)
    }
    return localDomainObj.url
}