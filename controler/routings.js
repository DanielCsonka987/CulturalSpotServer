const router = require('express').Router()

const { resoluteTokenFromLink, verifyTokenFromLink } = require('../utils/tokenManager')
const { passwordRenewInputRevise } = require('../utils/inputRevise')
const { encryptPwd } = require('../utils/bCryptManager')

const ProfileModel = require('../models/ProfileModel')

router.get("/", (req, res)=>{ res.send("<h1>GET request accepted - frontpage is sent!</h1>")  })

router.get('/resetpassword/:specToken', [
    async (req, res, next)=>{
        const tokenRevised = resoluteTokenFromLink(req.params.specToken)
        if(tokenRevised.tokenMissing){
            next(new Error('No authroization to use the endpoint!'))
        }
        try{
            const clientUser = await  ProfileModel.findById(tokenRevised.takenUserid)

            if(!clientUser.resetPwdMarker) { next( new Error('No permission to reset the password!')) }
            const tokenChargo = await verifyTokenFromLink(
                tokenRevised, clientUser.resetPwdMarker, clientUser.pwdHash
            )
            if(tokenChargo.error){ next( new Error('Verification error!') ) }
            if(tokenChargo.isExpired){ next() }
            if(tokenChargo.passResetPermission){
                req.permissionToContinue = true
            }
            next()
        }catch(err){
            next(err)
        }
    }, 
    (req, res)=>{
        if(req.permissionToContinue){
            res.send('<h3>Permission granted, here is the form</h3>')
        }else{
            res.send('<h3>Permission denied</h3><p>Token expired!</p>')
        }
    }
])




router.post('/resetpassword/:specToken', [
    async (req, res, next)=>{
        const tokenRevised = resoluteTokenFromLink(req.params.specToken)

        if(tokenRevised.tokenMissing){
            next(new Error('No authroization to use the endpoint!'))
        }
        try{
            const clientUser = await  ProfileModel.findById(tokenRevised.takenUserid)

            if(!clientUser.resetPwdMarker) { next( new Error('No permission to reset the password!')) }
            const tokenChargo = await verifyTokenFromLink(
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
    },
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



router.get('/feedbacks/', (req, res)=>{
    res.send("<h1>GET request to WebSocket</h1>")  
})


router.use((err, req, res, next)=>{
    res.status(500).send('<h3>Some error at router</h3><p>' + err.message + '</p>')
})
module.exports = router