module.exports = (fullUrl)=>{

    const httpPat = '(^http:\/\/)|(^https:\/\/)'

    if(fullUrl.search(httpPat) === -1){
        return { success: false, url: '' }
    }
    const domainExtensionStart = fullUrl.search(/(\..{2,3}$)|(\..{2,3}\/)|(\..{2,3}:[0-9]{4})/);
    if(domainExtensionStart === -1){
        return { success: false, url: '' }
    }

    const domainExtensionLength = fullUrl.match(/(\..{2,3}$)|(\..{2,3}\/)|(\..{2,3}:[0-9]{4})/)[0].length;
    const domainEnd = domainExtensionStart + domainExtensionLength
    if(domainEnd < 0){
        return { success: false, url: '' }
    }

    const  domainURL = fullUrl.slice(0, domainEnd)
    if(domainURL.endsWith('/')){
        return { success: true, url: domainURL  }
    }else{
        return { success: true, url: domainURL + '/' }
    }
}