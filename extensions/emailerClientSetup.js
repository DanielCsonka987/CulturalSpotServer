const nodemailer = require('nodemailer')

const { EMAIL_CONNECTION_FORTEST, EMAIL_CONNECTION_PRODUCTION,  
    } = require('../config/emailConfig')
const { RESETPWD_REST_GET_ROUTE } = require('../config/appConfig').ROUTING
    
let theTransporter = null;
const { EmailingService, emailType, LinkProvider 
    } = require('./emailerComponents/emailerService')

module.exports.emailerClienSetup =  async (isItForTest)=>{
    if(!isItForTest || process.env.MODE_ENV === 'production'){
        theTransporter = await nodemailer.createTransport(EMAIL_CONNECTION_PRODUCTION)
    }else{
        theTransporter = await nodemailer.createTransport(EMAIL_CONNECTION_FORTEST)
    }
    await theTransporter.verify((error, success)=>{
        if(error){  return error; }
        if(success){ console.log('Emailer connected!') }
    })
}


module.exports.emailerClienShutdown = async()=>{
    theTransporter.close()
}



module.exports.emailingServices = {

    registrationEmailSending: (domainAddr)=>{
        return new EmailingService(
            emailType.REGISTRATION, theTransporter,
            { toRoot: ['..', '..'] , toContent: ['public','emailTextingSrc'] }, //correlate ot this module!
            { html: 'registration.html',  txt: 'registration.txt' },
            'Your CulturalSpot registration',
            [   
                new LinkProvider(
                    domainAddr, '', 'CulturalSpot', 
                     '<!--PlaceOfTheInsert-->')
            ]
        )
    },
    passwordResettingEmailSending: (domainAddr, URLPayload)=>{
        return   new EmailingService(
            emailType.PWDRESETING, theTransporter,
            { toRoot: ['..', '..'] , toContent: ['public','emailTextingSrc'] },
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
    accountRemovalEmailSending: (domainAddr)=>{
        return  new EmailingService(
            emailType.ACCOUNTDELETE, theTransporter,
            { toRoot: ['..', '..'] , toContent: ['public','emailTextingSrc'] },
            { html: 'deleteAccount.html', txt: 'deleteAccount.txt'},
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
