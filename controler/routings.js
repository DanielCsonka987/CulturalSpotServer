const router = require('express').Router()

const { resetTokenResoluteFromLink, resetTokenValidate
     } = require('../utils/tokenManager')
const { isThisUserIDMayBeFaulty  } = require('../utils/inputRevise')
//const { encryptPwd } = require('../utils/bCryptManager')
//const { EMAIL_TEST_ACCOUNT } = require('../config/emailConfig')
const { RESETPWD_REST_GET_ROUTE } = require('../config/appConfig').ROUTING

const ProfileModel = require('../models/ProfileModel')
const { emailingServices } = require('../extensions/emailerClientSetup')

router.get("/", (req, res)=>{
    res.send("<h1>GET request accepted - frontpage is sent!</h1>")  
})

//Reset password step 2
router.get(`${RESETPWD_REST_GET_ROUTE}:specToken`, [
    resetTokenEvaluation,  (req, res)=>{
        if(req.permissionToContinue){
            res.header('resetting', req.params.specToken)
            res.send('<h3>Permission granted - here is the form!</h3>')
        }else{
            //res.redirect('/403')
            res.send('<h3>Permission denied</h3><p>Token expired!</p>')
        }
    }
])

/*
router.post('/resetpassword/:specToken', [
    resetTokenEvaluation,
    (req, res, next)=>{
        if(req.permissionToContinue){
            const correction = passwordRenewInputRevise(req.body.password, 
                req.body.passwordConf
            ) 
            if(correction){
                req.permissionToChange = true
            }
        }
        next()
    },
    async (req, res, next)=>{
        if(req.permissionToContinue && req.permissionToChange){
            const encryptRes = await encryptPwd(req.body.password)
            if(!encryptRes.error){
                try{
                    req.theClientObj.pwdHash = encryptRes.hash
                    req.theClientObj.resetPwdMarker = ''
                    await req.theClientObj.save()

                    req.changingDone = true
                }catch(err){
                    //no need for that here, now
                }
            }
        }
        delete req.theClientObj
        next()
    },
    (req, res)=>{
        if(req.permissionToContinue){
            if(req.permissionToChange){
                if(req.changingDone){
                    res.send('<h3>Your password changed!</h3><p>You can login with that!</p>')
                }else{
                    res.send('<h3>Password change error!</h3><p>Please try again!</p>')
                }
            }else{
                res.send('<h3>Passwords are incorrect!</h3><p>Please revise them!</p>')
            }
        }else{
            res.send('<h3>Permission denied</h3><p>Token expired!</p>')
        }
    }
])
*/
async function resetTokenEvaluation(req, res, next){
    const tokenRevised = resetTokenResoluteFromLink(req.params.specToken)
    if(tokenRevised.tokenMissing){
        next(new Error('No authroization to use the endpoint!'))
    }
    try{
        if(isThisUserIDMayBeFaulty(tokenRevised.takenUserid)){
            next( new Error('No proper user identification!'))
        }
        const clientUser = await  ProfileModel.findById(tokenRevised.takenUserid)

        if(!clientUser.resetPwdMarker) { next( new Error('No permission to reset the password!')) }
        const tokenChargo = await resetTokenValidate(
            tokenRevised, clientUser.resetPwdMarker, clientUser.pwdHash
        )
        if(tokenChargo.error){ next( new Error('Verification error!') ) }
        if(tokenChargo.isExpired){ next() }
        if(tokenChargo.passResetPermission){
            req.permissionToContinue = true
            req.theClientObj = clientUser
        }
        next()
    }catch(err){
        next(err)
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
    res.status(500).send('<h3>Some error at router</h3><p>' + err.message + '</p>')
})
module.exports = router