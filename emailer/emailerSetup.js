const nodemailer = require('nodemailer')
const path = require('path')
const fs = require('fs')

const { EMAIL_CONNECTION, EMAIL_ORIGIN_ACCOUNT } = require('../config/emailConfig')

let theTransporter = null;
const textingFolderName = 'emailTextingSrc'
const insertTextMarker = '/*PlaceOfTheInsert*/'
const insertHtmlMarker = '<!-- PlaceOfTheInsert -->'

module.exports.setupTrsp = ()=>{
    theTransporter = nodemailer.createTransport(EMAIL_CONNECTION)
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
    REGISTERATION: 0,
    PWDRESETING: 1,
    ACCOUNTDELETE: 2
}

module.exports.emailType = Object.freeze(emailTypes)

module.exports.execMailSending = async (emailToAddress, emailContType, inputs)=>{
    if(await verifyTrsp){
        emailContentToSend = await assembleEmailContent(emailContType, inputs)
        return theTransporter.sendMail({
            from: EMAIL_ORIGIN_ACCOUNT,
            to: emailToAddress,
            subject: emailContentToSend.subj,
            text: emailContentToSend.txt,
            html: emailContentToSend.ml
            
        })
    }
    return false;
} 

async function assembleEmailContent(emailContType, inputs){
    const result = {
        subj: '',
        txt: '',
        ml: ''
    }
    let fileToLoad = '';
    let anchorNeeded = inputs.anch? true:false;
    switch(emailContType){
        case(0):
            result.subj = 'Your CulturalSpot registration';
            fileToLoad = 'registration'
            break;
        case(1):
            result.subj = 'NO_REPLY! CulturalSpot password resetting';
            fileToLoad = 'resetPassword'
            break;
        case(2):
            result.subj = 'Your CulturalSpot account is deleted';
            fileToLoad = 'deleteAccount'
            break;
    }
    if(anchorNeeded){
        const tagElement = `<a href="${inputs.anch}">${inputs.anch}</a>`;
        result.txt = await getComplexTextContent(fileToLoad + '.txt', inputs.anch)
        result.ml = await getComplexHTMLContent(fileToLoad + '.html', tagElement)
        return result
    }
    result.txt = await getSimpleTextContent(fileToLoad + '.txt');
    result.ml = await getSimpleHTMLContent(fileToLoad + '.html');
    return result

}

async function getSimpleTextContent(filename){
    return await loadContentFromFile(filename)
}

async function getComplexTextContent(filename, inputTxt){
    const textToManage = await loadContentFromFile(filename)
    return textToManage.replace(insertTextMarker, inputTxt)
}

async function getSimpleHTMLContent(filename){
    return await loadContentFromFile(filename)
}

async function getComplexHTMLContent(filename, inputElement){
    const textToManage = await loadContentFromFile(filename)
    return textToManage.replace(insertHtmlMarker, inputElement)
}

function loadContentFromFile(filename){
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