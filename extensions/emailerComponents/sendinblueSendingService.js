const SibApiV3Sdk = require('sib-api-v3-sdk');

const { EMAIL_ORIGIN_ACCOUNT } = require("../../config/emailConfig")

const { getTheComponentSourcePath, getTheFetchedReplacedContent 
    } = require('./emailContentLoader')
const { emailTypeIDParser } = require('./linkProvider')

class SendinBlueSending{
    constructor(emailType, emailerTransporter, pathsArr, filesObj,
        emailSubject, neededLinksArr ){

        this.emailTypeNumber = emailType

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
        /*
        const txtContObj = await getTheFetchedReplacedContent(
            this.linksArray, pathToFetch, 
            this.contentFilesObj.txt
        )
        progressReportForDB.messageContent.push(txtContObj.report)
        */
        const htmlContObj = await getTheFetchedReplacedContent(
            this.linksArray, pathToFetch, 
            this.contentFilesObj.html
        )
        progressReportForDB.messageContent.push(htmlContObj.report)

        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = this.emailSubject;
        sendSmtpEmail.htmlContent = htmlContObj.content;
        sendSmtpEmail.sender = {"name": "CulturalSpot","email": EMAIL_ORIGIN_ACCOUNT};
        sendSmtpEmail.to = [{"name": addresseeName, "email": emailAddress}];

        try{
            const transporter = new SibApiV3Sdk.TransactionalEmailsApi();
            const data = await transporter.sendTransacEmail(sendSmtpEmail)
            //console.log('API called successfully. Returned data: ' + JSON.stringify(data));

            progressReportForDB.sendingResult = 'sent'
        }catch(err){
            progressReportForDB.sendingResult = 'failed ' 
                + `${err.response.error.text} `
        }
        return progressReportForDB
    }
}

module.exports = SendinBlueSending