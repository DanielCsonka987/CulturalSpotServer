module.exports = (reqObj, localDomainObj)=>{
    if(!localDomainObj.url){
        localDomainObj = { 
            prot: reqObj.protocol, 
            middle: '://',
            dom: reqObj.get('host'),
            apolloUrl: reqObj.protocol + '://' + reqObj.get('host')
        };
        Object.freeze(localDomainObj)
    }
    return localDomainObj
}