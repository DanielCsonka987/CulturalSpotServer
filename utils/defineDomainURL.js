module.exports = (reqObj, localDomainObj)=>{
    if(!localDomainObj.apolloUrl){
        localDomainObj.prot = reqObj.protocol
        localDomainObj.coupler = '://'
        localDomainObj.dom = reqObj.get('host')
        localDomainObj.apolloUrl = reqObj.protocol + reqObj.get('host')
        Object.freeze(localDomainObj)
    }
    return localDomainObj
}