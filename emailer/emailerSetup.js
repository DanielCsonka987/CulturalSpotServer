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

module.exports.setupTrsp = ()=>{
    if(process.env.NODE_ENV === 'production'){
        theTransporter = nodemailer.createTransport(EMAIL_CONNECTION_PRODUCTION)
    }else{
        theTransporter = nodemailer.createTransport(EMAIL_CONNECTION_FORTEST)
    }
}

async function verifyTrsp(){
    await theTransporter.verify((error, success)=>{
        if(error){
            console.log('Emailer has lost the connection!')
            false;
        }
        return true;
    })
}

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


module.exports.execMailSending = async (emailToAddress, emailChonesType, inputs)=>{
    if(await verifyTrsp){
        try{
            emailContentToSend = await assembleEmailContent(emailChonesType, inputs)
            const mailingRes = await theTransporter.sendMail({
                from: EMAIL_ORIGIN_ACCOUNT,
                to: emailToAddress,
                subject: emailContentToSend.subj,
                text: emailContentToSend.txt,
                html: emailContentToSend.ml
            })
            return { 
                progress: mailingRes.messageId? 'done': 'errorAtSending', 
                resultId: mailingRes.messageId, 
                quality: emailContentToSend.integrity.join(';')
            }
        }catch(err){
            if(err.integrity){  //only at no subject or all content missing
                return { progress: 'errorAtAssemble', quality: err.integrity.join(';')  };
            }
            return { progress: 'errorOfUnknown', quality: 'none'}
        }
    }
    return { progress: 'errorSMTPConnect', quality: 'none' };
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
                result.integrity.push('subjDefineError')    //no file defined, ready: failed!
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
                result.txt = theTxt.replace(insertTextMarker, anchorUrl)
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