const nodemailer = require('nodemailer')

const { EMAIL_CONNECTION_FORTEST, EMAIL_CONNECTION_PRODUCTION,  
    } = require('../config/emailConfig')
const { RESETPWD_REST_GET_ROUTE } = require('../config/appConfig').ROUTING
    
let theTransporter = null;
const { EmailerService, emailType, LinkProvider 
    } = require('./emailerComponents/emailerService')

module.exports.emailerClienSetup = new Promise(async (resolve, reject)=>{
    if(process.env.NODE_ENV === 'production'){
        theTransporter = nodemailer.createTransport(EMAIL_CONNECTION_PRODUCTION)
    }else{
        theTransporter = nodemailer.createTransport(EMAIL_CONNECTION_FORTEST)
    }
    theTransporter.verify((error, success)=>{
        if(error){  reject(error); }
        resolve(success);
    })
})

module.exports.emailerClienShutdown = new Promise((resolve, reject)=>{
    theTransporter.close()
    theTransporter.verify((error, success)=>{
        if(error){  resolve(error); }
        resolve(success);
    })
})

module.exports.emailingServices={

    registrationEmailSending: (domainAddr)=>{
        return new EmailerService(
            emailType.REGISTRATION, theTransporter,
            ['..', '..'], ['public','emailTextingSrc'],
            ['registration.html', 'registration.txt'],
            'Your CulturalSpot registration',
            [   
                new LinkProvider(
                    domainAddr, '', 'CulturalSpot', 
                     '<!--PlaceOfTheInsert-->')
            ]
        )
    },
    passwordResettingEmailSending = (domainAddr, URLPayload)=>{
        return   new EmailerService(
            emailType.PWDRESETING, theTransporter,
            ['..', '..'], ['public','emailTextingSrc'],
            { html: 'resetPassword.html', txt: 'resetPassword.txt'},
            'NO_REPLY! CulturalSpot password resetting',
            [   
                new LinkProvider(
                    domainAddr, RESETPWD_REST_GET_ROUTE + URLPayload,
                    'ClickMe', '<!--PlaceOfTheInsert1-->'
                ), 
                new LinkProvider(
                    domainAddr, '', 'CulturalSpot',
                     '<!--PlaceOfTheInsert2-->'
                )
            ]
        )
    },
    accountRemovalEmailSending = ()=>{
        return  new EmailerService(
            emailType.ACCOUNTDELETE, theTransporter,
            ['..', '..'], ['public','emailTextingSrc'],
            ['deleteAccount.html', 'deleteAccount.txt'],
            'Your CulturalSpot account is deleted',
            [   
                new LinkProvider(
                    domainAddr, '', 'CulturalSpot', 
                     '<!--PlaceOfTheInsert-->'
                )
            ]
        )
    } 
}
