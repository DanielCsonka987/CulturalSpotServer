const path = require('path')
const fs = require('fs')

const EmailReportModel = require('../../models/EmailReportModel')
const { EMAIL_ORIGIN_ACCOUNT } = require("../../config/emailConfig")

class LinkProvider{
    constructor(domain, linkHref, linkText, destinationPlace){
        this.siteDoman = domain
        this.linkText = linkText
        this.linkHref = linkHref
        this.destinationPlace = destinationPlace
    }
    getTheDestinationMarkerText(){
        return this.destinationPlace
    }
    getTheProperLink(type){
        return type === 'HTML'?
        `<a href="${this.siteDoman + this.linkHref}">${this.linkText}</a>` 
        : this.siteDoman + this.linkHref
    }
}

module.exports.LinkProvider = LinkProvider

const emailTypes = {
    REGISTRATION: 0,
    PWDRESETING: 1,
    ACCOUNTDELETE: 2
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

class EmailingService{
    constructor(emailType, emailerTransporter, pathsObj, filesObj,
        emailSubject, neededLinksArr
        ){
        this.emailTypeNumber = emailType
        this.transporter = emailerTransporter

        this.rootPath = pathsObj.toRoot
        this.contentPath = pathsObj.toContent

        this.connectedFilesArray = filesObj
        this.emailSubject = emailSubject
        this.linksArray = neededLinksArr    //LinkProvider types in array
    }

    async executeEmailSending(emailAddress){

        const progressReportForDB = {
            emailTo: emailAddress,
            messageType: emailTypeStringify(this.emailTypeNumber),
            messageContent: [],     
            sendingResult: ''       //sent/failed
        }
        

        let contentText = ''
        let contentHTML = ''
        const pathToFetch = this.getTheComponentPath()
        try{
            contentText = this.getTheFormattedContent(
                await this.getTheContentFromFile(pathToFetch, this.connectedFilesArray.txt),
                'Text'
            )
            progressReportForDB.messageContent.push('textPacked')
        }catch(err){
            progressReportForDB.messageContent.push('textMissing')
        }

        try{
            contentHTML = this.getTheFormattedContent(
                await this.getTheContentFromFile(pathToFetch, this.connectedFilesArray.html),
                'HTML'
            )
            progressReportForDB.messageContent.push('htmlPacked')
        }catch(err){
            progressReportForDB.messageContent.push('htmlMissing')
        }

        try{
            const mailingRes = await this.transporter.sendMail({
                from: EMAIL_ORIGIN_ACCOUNT, 
                to: emailAddress,
    
                subject: this.emailSubject,
                text: contentText,
                html: contentHTML
            })
            progressReportForDB.sendingResult = 'sent'
        }catch(err){
            progressReportForDB.sendingResult = 'failed'
        }   

        await this.registerInDBTheSending(progressReportForDB)
    }

    getTheFormattedContent(theText, type){
        if(!theText){
            return ''
        }
        let resultText = theText
        for(const link of this.linksArray){
            const temp = resultText.replace(
                link.getTheDestinationMarkerText(),
                link.getTheProperLink(type)
            )
            resultText = temp
        }
        return resultText
    }

    getTheComponentPath(){
        let localPath = path.join(__dirname)
        for(const item of this.rootPath){
            localPath = path.join(localPath, item)
        }
        for(const item of this.contentPath){
            localPath = path.join(localPath, item)
        }
        return localPath
    }

    getTheContentFromFile(localPath, filename){
        return new Promise((resolve, reject)=>{
            const fullpath = path.join(localPath, filename)
            fs.readFile(fullpath, 'utf8', (err, text)=>{
                if(err){
                    console.log(err)
                    reject('');
                }
                resolve(text)
            })
        })
    }

    async registerInDBTheSending(progress){
        const newRecord = new EmailReportModel({
            msgdate: new Date(),
            msgto: progress.emailTo,
            msgtype: progress.messageType,
            msgcontent: progress.messageContent.join('-'),
            msgresult: progress.sendingResult
        })
        try{
            await newRecord.save()
        }catch(err){
            console.log('Email-sending registration error: ' + err)
        }
    }
}


module.exports.EmailingService = EmailingService
