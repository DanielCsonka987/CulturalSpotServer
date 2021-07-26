const nodemailer = require('nodemailer')
const path = require('path')
const fs = require('fs')

const { EMAIL_CONNECTION_FORTEST, 
    EMAIL_CONNECTION_PRODUCTION, 
    EMAIL_ORIGIN_ACCOUNT } = require('../config/emailConfig')

let theTransporter = null;
const textingFolderName = 'emailTextingSrc'
const insertTextMarker = '/*PlaceOfTheInsert*/'
const insertHtmlMarker = '<!-- PlaceOfTheInsert -->'

module.exports.setupTrsp = new Promise(async (resolve, reject)=>{
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

module.exports.shutdown = new Promise((resolve, reject)=>{
    theTransporter.close()
    theTransporter.verify((error, success)=>{
        if(error){  resolve(error); }
        resolve(success);
    })
})

const emailTypes = {
    REGISTRATION: 0,
    PWDRESETING: 1,
    ACCOUNTDELETE: 2
}
module.exports.emailType = Object.freeze(emailTypes)

module.exports.emailTypeStringify = (defValue)=>{
    for (const [key, value] of Object.entries(emailTypes)) {
        if(value === defValue){
            return key.toString();
        }
    }
    return 'UNKNOWN'
}


module.exports.execMailSending = (emailToAddress, emailChonesType, inputs)=>{
    return new Promise((resolve, reject)=>{
        theTransporter.verify(async (error, success)=>{
            if(error) { reject({ progress: 'errorSMTPConnect', integrity: 'none' }) }
            assembleEmailContent(emailChonesType, inputs)
            .then(async (emailContentToSend)=>{
                const mailingRes = await theTransporter.sendMail({
                    from: EMAIL_ORIGIN_ACCOUNT,
                    to: emailToAddress,
                    subject: emailContentToSend.subj,
                    text: emailContentToSend.txt,
                    html: emailContentToSend.ml
                })
                if(mailingRes.messageId){
                    resolve({ 
                        progress: 'done',  resultId: mailingRes.messageId, 
                        integrity: emailContentToSend.integrity.join(';')
                    })
                }
                reject({
                    progress: 'errorAtSending',
                    integrity: emailContentToSend.integrity.join(';')
                })
            })
            .catch(err=>{
                if(err.integrity){  //only at no subject or all content missing
                    reject({ progress: 'errorAtAssemble', integrity: err.integrity.join(';')  })
                }
                reject ({ progress: 'errorOfUnknown', err})
            })
        })
    })
} 

function assembleEmailContent(emailChonesType, inputs){
    return new Promise(async (resolve, reject)=>{
        const result = {  subj: '',   txt: '',  ml: '',
            integrity: [], readyToSend: false
        }
        let fileToLoad = '';

        switch(emailChonesType){
            case(0):
                result.subj = 'Your CulturalSpot registration';
                result.integrity.push('subjReg')
                fileToLoad = 'registration'
                break;
            case(1):
                result.subj = 'NO_REPLY! CulturalSpot password resetting';
                result.integrity.push('subjPwdReset')
                fileToLoad = 'resetPassword'
                break;
            case(2):
                result.subj = 'Your CulturalSpot account is deleted';
                result.integrity.push('subjDel')
                fileToLoad = 'deleteAccount'
                break;
            default:
                result.integrity.push('subjDefineError')    //no file defined, failed!
                reject(result)
        }

        let anchorUrl, anchorTxt = ''
        if(inputs && Object.keys(inputs).includes('anchUrl')){
            anchorUrl = inputs.anchUrl;
            anchorTxt = inputs.anchTxt
        }

        try{
            const theTxt = await getContentFromFile(fileToLoad + '.txt')
            if(anchorUrl){
                result.txt = theTxt.replace(insertTextMarker, anchorUrl.toString())
            }else{
                result.txt = theTxt
            }
            result.integrity.push('txtLoaded')
        }catch(err){
            result.integrity.push('txtError')
        }
        
        try{
            const theMl = await getContentFromFile( fileToLoad + '.html' )
            if(anchorUrl){
                const tagElement = `<a href="${anchorUrl}">${anchorTxt}</a>`;
                result.ml = theMl.replace(insertHtmlMarker, tagElement)
            }else{
                result.ml = theMl
            }
            result.integrity.push('mlLoaded')
        }catch(err){
            result.integrity.push('mlError')
        }
    
        if(!result.ml && !result.txt){ // if no a type of content, integrity shows -> ready: true
            reject(result)
        }

        resolve(result)
    })

}

async function getContentFromFile(filename){
    return new Promise((resolve, reject)=>{
        fs.readFile( path.join( __dirname, textingFolderName, filename),
            'utf8', (err, text)=>{
            if(err){
                console.log(`File reading error \n- ${filename} - \n` + err)
                reject('');
            }
            resolve(text);
        })
    }) 
}


module.exports.testingAssembleEmail =  assembleEmailContent