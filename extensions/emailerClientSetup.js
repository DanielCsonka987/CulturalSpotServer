const nodemailer = require('nodemailer');
const SibApiV3Sdk = require('sib-api-v3-sdk');

const EmailReportModel = require('../models/EmailReportModel')
const { LinkProvider } = require('./emailerComponents/linkProvider')
const etherealSend = require('./emailerComponents/etherealSendingService')
const sendinblueSend = require('./emailerComponents/sendinblueSendingService')

const { EMAIL_CONNECTION_ETHEREAL, EMAIL_CONNECTION_SENDINBLUE_APIKEY,  
    } = require('../config/emailConfig')
const { RESETPWD_REST_GET_ROUTE } = require('../config/appConfig').ROUTING
    
let theTransporter = null;
let emailerAPIMode = null
const theSendingServices = []

const PATH_OF_SERFVICES_UP_TO_ROOT = ['..', '..'] 
const PATH_OF_CONTENT_FOLDER_FROM_ROOT = [ 'public','emailTextingSrc' ]

const PATH_SUM = [ ...PATH_OF_SERFVICES_UP_TO_ROOT, ...PATH_OF_CONTENT_FOLDER_FROM_ROOT ]
const EMAIL_CONTNET_FILE_NAMES = {
    REGISTRATION: { html: 'registration.html',  txt: 'registration.txt' },
    PWD_RESET: { html: 'resetPassword.html', txt: 'resetPassword.txt' },
    ACCOUNT_DELETION: { html: 'deleteAccount.html', txt: 'deleteAccount.txt' },
    PRODUCTION_TESTING: { html: 'emailerTesting.html', txt: 'emailerTesting.txt'  }
}
const EMAIL_CONTENT_LINK_MARKER_AND_URL_FOR_REPLACE = {
    SITE_LINK: new LinkProvider('CulturalSpot',  '<!--PlaceOfTheInsert1-->'),
    PWD_RESET_ADDRESS: new LinkProvider( 'ClickMe', '<!--PlaceOfTheInsert2-->' ), 
}

function getSenderFactory(apiObjectToInstantiate, purposeType){
    if(purposeType === 'register'){
        return new apiObjectToInstantiate(
            'REGISTRATION', theTransporter, PATH_SUM, 
            EMAIL_CONTNET_FILE_NAMES.REGISTRATION,
            'CulturalSpot registration', 
            [ EMAIL_CONTENT_LINK_MARKER_AND_URL_FOR_REPLACE.SITE_LINK ]
        )
    }
    if(purposeType === 'pwdChange'){
        return new apiObjectToInstantiate(
            'PWDRESETING', theTransporter, PATH_SUM, 
            EMAIL_CONTNET_FILE_NAMES.PWD_RESET,
            'CulturalSpot password resetting', 
            [ EMAIL_CONTENT_LINK_MARKER_AND_URL_FOR_REPLACE.SITE_LINK, 
                EMAIL_CONTENT_LINK_MARKER_AND_URL_FOR_REPLACE.PWD_RESET_ADDRESS ]
        )
    }
    if(purposeType === 'delAcc'){
        return new apiObjectToInstantiate(
            'ACCOUNTDELETE', theTransporter, PATH_SUM, 
            EMAIL_CONTNET_FILE_NAMES.ACCOUNT_DELETION,
            'No relply! CulturalSpot account deletion', 
            [ EMAIL_CONTENT_LINK_MARKER_AND_URL_FOR_REPLACE.SITE_LINK ]
        )
    }
    if(purposeType === 'test'){
        return new apiObjectToInstantiate(
            'TESTING', theTransporter, PATH_SUM, 
            EMAIL_CONTNET_FILE_NAMES.PRODUCTION_TESTING,
            'No relply! CulturalSpot testing message', 
            [ EMAIL_CONTENT_LINK_MARKER_AND_URL_FOR_REPLACE.SITE_LINK ]
        )
    }
    console.log('Developing error - no service purpose to define sender')
    return null
}


module.exports.emailerClienSetup =  async (IS_ETHEREAL_NEEDED)=>{

    if(!IS_ETHEREAL_NEEDED || process.env.MODE_ENV === 'production'){
        theTransporter = SibApiV3Sdk.ApiClient.instance;
        const apiKey = theTransporter.authentications['api-key'];
        apiKey.apiKey = EMAIL_CONNECTION_SENDINBLUE_APIKEY

        theSendingServices['register'] = getSenderFactory(sendinblueSend, 'register')
        theSendingServices['pwdChange'] = getSenderFactory(sendinblueSend, 'pwdChange')
        theSendingServices['delAcc'] = getSenderFactory(sendinblueSend, 'delAcc')
        theSendingServices['test'] = getSenderFactory(sendinblueSend, 'test')
        console.log('SendinBlue emailer connected!')

    }else{
        theTransporter = await nodemailer.createTransport(EMAIL_CONNECTION_ETHEREAL)
        await theTransporter.verify((error, success)=>{
            if(error){  console.log(error.message); }
            if(success){
                theSendingServices['register'] = getSenderFactory(etherealSend, 'register')
                theSendingServices['pwdChange'] = getSenderFactory(etherealSend, 'pwdChange')
                theSendingServices['delAcc'] = getSenderFactory(etherealSend, 'delAcc')
                theSendingServices['test'] = getSenderFactory(etherealSend, 'test')
                console.log('Ethereal emailer connected!')
            }
        })
    }
}


module.exports.emailerClienShutdown = async()=>{
    theTransporter.close()
}



const registerInDBTheSending = async (progress)=>{
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
        console.log('Email-sending logging error: ' + err)
    }
}

module.exports.emailingServices = {
    registrationEmailSending: async (domainAddr, addrName, emailAddr)=>{
        theSendingServices['register'].setUrlOfLinks([domainAddr])
        const progress = await theSendingServices['register'].executeEmailSending(
            addrName, emailAddr )
        await registerInDBTheSending(progress)
    },
    passwordResettingEmailSending: async (domainAddr, addrName, emailAddr, URLPayload)=>{
        theSendingServices['pwdChange'].setUrlOfLinks([
            domainAddr, domainAddr + RESETPWD_REST_GET_ROUTE + URLPayload
        ])
        const progress = await theSendingServices['pwdChange'].executeEmailSending(
            addrName, emailAddr )
        await registerInDBTheSending(progress)
    },
    accountRemovalEmailSending: async (domainAddr, addrName, emailAddr)=>{
        theSendingServices['delAcc'].setUrlOfLinks([domainAddr])
        const progress = await theSendingServices['delAcc'].executeEmailSending(
            addrName, emailAddr )
        await registerInDBTheSending(progress)
    },
    siteEmailerTesting: async (domainAddr, addrName, emailAddr)=>{
        theSendingServices['test'].setUrlOfLinks([domainAddr])
        const progress = await theSendingServices['test'].executeEmailSending(
            addrName, emailAddr )
        await registerInDBTheSending(progress)
    }
}
