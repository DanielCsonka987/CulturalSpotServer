const router = require('express').Router()
const path = require('path')
const fs = require('fs')

const { resetTokenResoluteFromLink, resetTokenValidate
     } = require('../utils/tokenManager')
const { isThisUserIDMayBeFaulty  } = require('../utils/inputRevise')
//const { encryptPwd } = require('../utils/bCryptManager')
//const { EMAIL_TEST_ACCOUNT } = require('../config/emailConfig')
const { RESETPWD_REST_GET_ROUTE } = require('../config/appConfig').ROUTING

const ProfileModel = require('../models/ProfileModel')
const { emailingServices } = require('../extensions/emailerClientSetup')

//Reset password step 2
router.get(`${RESETPWD_REST_GET_ROUTE}:specToken`,[
    resetTokenEvaluation,
    (req, res)=>{
        if(req.srvError){
            const msg = req.srvError.split(' ').join('_') 
                + '_Please_repeat_the_resetting_process_from_the_begining!'
            res.cookie('srverror', msg, { 
                maxAge: 10000, 
                path: RESETPWD_REST_GET_ROUTE + req.params.specToken
            } ) 
        }
        res.sendFile(path.join(__dirname, '..', 'public', 'frontapp', 'index.html'))

    }]
)

router.get("/*", (req, res)=>{
    res.sendFile(path.join(__dirname, '..', 'public', 'frontapp', 'index.html'))

    //res.send("<h1>GET request accepted - frontpage is sent!</h1>")  
})

async function resetTokenEvaluation(req, res, next){
    try{
        const tokenRevised = resetTokenResoluteFromLink(req.params.specToken)
        if(tokenRevised.tokenMissing){
            req.srvError = 'No authroization to use this service!'; next();
        }
        if(isThisUserIDMayBeFaulty(tokenRevised.takenUserid)){
            req.srvError =  'The system connot find the pointed account!'; 
            next();
        }else{
            const clientUser = await  ProfileModel.findById(tokenRevised.takenUserid)
            if(clientUser === null){
                req.srvError =  'The system connot find the pointed email!'; next();
            }
            if(!clientUser.resetPwdMarker ){
                req.srvError = 'No permission to reset this account password!'; next();
            }
    
            const tokenChargo = await resetTokenValidate(
                tokenRevised, clientUser.resetPwdMarker, clientUser.pwdHash
            )
    
            if(tokenChargo.error){ 
                req.srvError = 'Identifing you is failed!'; next();
            }
            if(tokenChargo.isExpired){ 
                req.srvError = 'Password resetting request is already expired!'; next();
            }
            if(tokenChargo.passResetPermission){
                req.permissionToContinue = true
            }
            next()
        }
        
    }catch(err){
        throw err
        //res.set({ 'content-type': 'text/html; charset=utf-8' })
        /*
        fs.readFile(path.join(__dirname, '..', 'public', 'frontapp', 'index.html'), 'utf8', (err, data)=>{
            res.status(200).send(data)
        })
        res.send(err.message)
        res.end()
        */
    }
}


//only at deployment it is used!!
router.get('/emailtesting', async (req, res)=>{

    const domainName = req.protocol + '://'+ req.get('host')
    await emailingServices.siteEmailerTesting(domainName, 'Developer/Operator', 
        EMAIL_TEST_ACCOUNT  );
    res.status(201)
    res.send('<h3>Test email is sent, check out the result at mailbox!</h3>')
})

router.use((err, req, res, next)=>{
    /*
    const msg = err.split(' ').join('_')
    res.cookie('srverror', msg)
    fs.readFile(path.join(__dirname, '..', 'public', 'frontapp', 'index.html'), 'utf8', (err, data)=>{
        res.status(200).send(data)
    })*/
    //res.sendFile(path.join(__dirname, '..', 'public', 'frontapp', 'index.html'))
    res.status(500).send('<h3>Some error at server router!</h3><p>' + err.message + '</p>')
    //res.end()
})
module.exports = router