const { EMAIL_ORIGIN_ACCOUNT } = require("../../config/emailConfig")

const { getTheComponentSourcePath, getTheFetchedReplacedContent 
    } = require('./emailContentLoader')
const { emailTypeIDParser } = require('./linkProvider')

class EtherealSending{
    constructor(emailType, emailerTransporter, pathsArr, filesObj,
        emailSubject, neededLinksArr ){

        this.emailTypeNumber = emailType
        this.transporter = emailerTransporter

        this.contentSumPath = pathsArr
        this.contentFilesObj = filesObj

        this.emailSubject = emailSubject
        this.linksArray = neededLinksArr    //LinkProvider types in array
    }

    setUrlOfLinks(urlArr){
        for(let i = 0; i< this.linksArray.length; i++){
            this.linksArray[i].setLinkUrl(urlArr[i])
        }
    }

    async executeEmailSending(addresseeName, emailAddress){
        const progressReportForDB = {
            emailTo: emailAddress,
            messageType: emailTypeIDParser(this.emailTypeNumber),
            messageContent: [],     
            sendingResult: ''       //sent/failed
        }

        const pathToFetch = getTheComponentSourcePath(this.contentSumPath)
        const txtContObj = await getTheFetchedReplacedContent(
            this.linksArray, pathToFetch, 
            this.contentFilesObj.txt
        )
        progressReportForDB.messageContent.push(txtContObj.report)

        const htmlContObj = await getTheFetchedReplacedContent(
            this.linksArray, pathToFetch, 
            this.contentFilesObj.html
        )
        progressReportForDB.messageContent.push(htmlContObj.report)

        try{
            const mailingRes = await this.transporter.sendMail({
                from: EMAIL_ORIGIN_ACCOUNT, 
                to: emailAddress,
    
                subject: this.emailSubject,
                text: txtContObj.content,
                html: htmlContObj.content
            })
            progressReportForDB.sendingResult = 'sent'
        }catch(err){
            progressReportForDB.sendingResult = 'failed'
        }   

        return progressReportForDB
    }
}


module.exports = EtherealSending
