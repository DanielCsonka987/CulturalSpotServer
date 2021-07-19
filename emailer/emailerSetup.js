const nodemailer = require('nodemailer')
const path = require('path')
const fs = require('fs')

const EmailReportModel = require('../models/EmailReportModel')
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

function emailTypeStringify(defValue){
    for (const [key, value] of Object.entries(emailTypes)) {
        if(value === defValue){
            return key.toString();
        }
    }
    return 'UNKNOWN'
}

module.exports.emailType = Object.freeze(emailTypes)

module.exports.execMailSending = async (emailToAddress, emailChonesType, inputs)=>{
    if(await verifyTrsp){
        emailContentToSend = await assembleEmailContent(emailChonesType, inputs)

        if(emailContentToSend.readyToSend){
            const mailingRes = await theTransporter.sendMail({
                from: EMAIL_ORIGIN_ACCOUNT,
                to: emailToAddress,
                subject: emailContentToSend.subj,
                text: emailContentToSend.txt,
                html: emailContentToSend.ml
            })
            if(mailingRes.messageId){
                await saveEmailReportToDB(emailToAddress, emailChonesType, 
                    emailContentToSend.integrity, mailingRes.messageId)
            }else{
                await saveEmailReportToDB(emailToAddress, emailChonesType, 
                    emailContentToSend.integrity, 'errorToSending')
            }
            return mailingRes
        }
        await saveEmailReportToDB(emailToAddress, emailChonesType, 
            emailContentToSend.integrity, 'errorAtAssemble')
        return false;
    }
    await saveEmailReportToDB(emailToAddress, emailChonesType, ['none'], 'errorAtConnect')
    return false;
} 

async function assembleEmailContent(emailChonesType, inputs){
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
            return result;
    }

    let procInput = ''
    if(inputs && Object.keys(inputs).includes('anch')){
        procInput = inputs.anch
    }

    const theTxt = await getContentFromFile(fileToLoad + '.txt',  
        procInput? 'anchor' : 'none', procInput
    )
    if(theTxt.integ && theTxt.content !== ''){
        result.txt = theTxt.content
        result.integrity.push('txtLoaded')
    }else{
        result.integrity.push('txtError')
    }

    const theMl = await getContentFromFile( fileToLoad + '.html', 
        procInput? 'anchor' : 'none', procInput
    )
    if(theMl.integ && theMl.content !== ''){
        result.ml = theMl.content
        result.integrity.push('mlLoaded')
    }else{
        result.integrity.push('mlError')
    }

    if(!result.ml && !result.txt){ // if no a type of content, integrity shows -> ready: true
        result.readyToSend = false;  
    }else{
        result.readyToSend = true;  
    }
    return result

}

async function saveEmailReportToDB(emailToAddres, emailChonesType, realContentObj,
    smtpIdOrErrorMsg){

    const newRecord = new EmailReportModel({
        msgdate: new Date().toISOString(),
        msgto: emailToAddres,
        msgtype: emailTypeStringify(emailChonesType),
        msgcontent: Object.values(realContentObj).join(';'),
        msgresult: smtpIdOrErrorMsg
    })
    try{
        await newRecord.save()
    }catch(err){
        console.log('Email-sending registration error: ' + err)
    }
}

async function getContentFromFile(filename, insertType, inputTxt){
    return new Promise((resolve, reject)=>{
        fs.readFile( path.join( __dirname, textingFolderName, filename),
            'utf8', (err, text)=>{
            if(err){
                console.log(`File reading error \n- ${filename} - \n` + err)
                reject({ integ: false, cont: ''});
            }
            if(insertType === 'none'){
                resolve({ integ: true, content: text })
            }
            try{
                const theContentIs = filename.includes('.html')? 'ml' : 'txt'
                if(insertType === 'anchor' && theContentIs === 'txt'){
                    resolve({ integ: true, content: text.replace(insertTextMarker, inputTxt) })
                }
                if(insertType === 'anchor' && theContentIs === 'ml'){
                    const tagElement = `<a href="${inputTxt}">${inputTxt}</a>`;
                    resolve({ integ: true, content: text.replace(insertHtmlMarker, tagElement) })
                }

            }catch(err){
                console.log(`File inserting error \n- ${filename} - \n` + err)
            }
            reject({ integ: false, content: '' });
        })
    }) 
}


module.exports.testingAssembleEmail =  assembleEmailContent
module.exports.testingTypeStrigify = emailTypeStringify