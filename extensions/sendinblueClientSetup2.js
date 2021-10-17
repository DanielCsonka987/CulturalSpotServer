var SibApiV3Sdk = require('sib-api-v3-sdk');


function configEmailerClient(){
    var defaultClient = SibApiV3Sdk.ApiClient.instance;
    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = ""
}


function configAndStringifyEmail(subject, html, toName, toAddress){
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = {"name":"John Doe","email":"webfrontinapp@freemail.hu"};
    sendSmtpEmail.to = [{"email": toAddress,"name": toName}];
    return sendSmtpEmail
}


function sendingEmail(){
    try{
        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    }catch(err){
        console.error(err.text);
        
    }
}