class LinkProvider{
    constructor(linkText, destinationPlace){
        this.linkText = linkText
        this.destinationPlace = destinationPlace
        this.linkHref = null
    }
    setLinkUrl(link){
        this.linkHref = link
    }
    getTheDestinationMarkerText(){
        return this.destinationPlace
    }
    getTheProperLink(type){
        return type === 'HTML'?
        `<a href="${this.linkHref}">${this.linkText}</a>` : this.linkHref
    }
}

module.exports.LinkProvider = LinkProvider

const emailTypes = {
    REGISTRATION: 0,
    PWDRESETING: 1,
    ACCOUNTDELETE: 2,
    TESTING: 3
}
module.exports.emailType = Object.freeze(emailTypes)

function emailTypeStringify(defValue){
    for (const [key, value] of Object.entries(emailTypes)) {
        if(value === defValue){
            return key.toString();
        }
    }
    return 'UNKNOWN'
}

module.exports.emailTypeIDParser = emailTypeStringify