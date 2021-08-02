const { AuthenticationError, UserInputError, ApolloError  } = require('apollo-server-express')

//helper utils, standalone like, models
const { tokenEncoder, createTokenToLink, createTokenToHeader } = require('../../utils/tokenManager')
const { encryptPwd, matchTextHashPwd } = require('../../utils/bCryptManager')
const { loginInputRevise, registerInputRevise, 
    changePwdInputRevise, deleteAccInputRevise,
    updateAccDetInputRevise, resetPwdInputRevise } = require('../../utils/inputRevise')

const { execMailSending, emailType, emailTypeStringify } = require('../../emailer/emailerSetup')
const ProfileModel = require('../../models/ProfileModel')
const EmailReportModel = require('../../models/EmailReportModel')
const PostModel = require('../../models/PostModel')

// someHelper function in resolving - not standalone, apollo connected!
const { authorizEvaluation } = require('./someHelper')

async function passwordsMatching(user, pwdText){
    if(!user){
        throw new AuthenticationError('Wrong password!', { general: 'No account found!'})
    }
    const pwdReport = await matchTextHashPwd(pwdText, user.pwdHash)
    if(pwdReport.error){
        throw new UserInputError('Login error!', pwdReport.error )
    }
    if(!pwdReport.match){
        throw new AuthenticationError('Wrong password!', { general: 'No match with account!' })
    }
}

async function saveEmailReportToDB(emailToAddres, emailTypeTxt, emailQuality,
    smtpIdOrErrorMsg){

    const newRecord = new EmailReportModel({
        msgdate: new Date().toISOString(),
        msgto: emailToAddres,
        msgtype: emailTypeTxt,
        msgcontent: emailQuality,
        msgresult: smtpIdOrErrorMsg
    })
    try{
        await newRecord.save()
    }catch(err){
        console.log('Email-sending registration error: ' + err)
    }
}



module.exports = {
    Mutation: {
        async login(_, args){
            const { error, field, issue, email, pwdText} = loginInputRevise(
                args.email, args.password)
            if(error){
                return new UserInputError('Login validation error!', { field, issue })
            }

            const userToLogin = await ProfileModel.findOne({ email })
            if(!userToLogin){
                return new AuthenticationError('Wrong email or password!', { general: 'No account found!'})
            }
            const pwdReport = await matchTextHashPwd(pwdText, userToLogin.pwdHash)
            if(pwdReport.error){
                return new UserInputError('Login error!', pwdReport.error )
            }
            if(!pwdReport.match){
                return new AuthenticationError('Wrong email or password!', { general: 'Wrong password!' })
            }

            //temporary saving out then update logged timestamp
            const lastLoggedTime = userToLogin.lastLoggedAt
            userToLogin.lastLoggedAt = new Date().toISOString()
            userToLogin.resetPwdToken = '';
            try{
                userToLogin.save();
            }catch(err){
                return new ApolloError('Login timestamp persisting failed!')
            }

            const postsOfUser = PostModel.find({ owner: lastLoggedTime._id })
            
            return {
                id: userToLogin._id,
                token: tokenEncoder({subj: userToLogin.id, email: userToLogin.email}),
                tokenExpire: 3600,
                email: userToLogin.email,
                username: userToLogin.username,
                registeredAt: userToLogin.registeredAt,
                lastLoggedAt: lastLoggedTime,

                friends: userToLogin.friends,
                posts: postsOfUser
            }
        },

        async registration(_, args){
            const { error, field, issue, email, pwdText, username } = registerInputRevise(
                args.email, args.password, args.passwordconf, args.username
            )
            if(error){
                return new UserInputError('Registration validation error!', { field, issue })
            }

            const resUser = await ProfileModel.findOne({ email })
            if(resUser){
                return new UserInputError('This email is already occupied!')
            }

            const encrypt = await encryptPwd(pwdText)
            if(encrypt.error){
                return new ApolloError('Registration encryption error!', encrypt.error )
            }
            
            const actTimeISO = new Date().toISOString()
            const newUser = new ProfileModel({
                email: email,
                username: username,
                pwdHash: encrypt.hash,
                registeredAt: actTimeISO,
                lastLoggedAt: actTimeISO
            })
            try{
                await newUser.save()
            }catch(err){
                return ApolloError('Registration is not completed!', { err })
            }
            
            return {
                id: newUser._id,
                token: tokenEncoder({ subj: newUser._id, email: newUser.email }),
                tokenExpire: 3600,
                email: newUser.email,
                username: newUser.username,
                registeredAt: newUser.registeredAt,
                lastLoggedAt: newUser.lastLoggedAt,

                friends: [],
                posts: []
            }
        },

        async resetPassword(_, args, context){
            const { error, field, issue, email } = resetPwdInputRevise( args.email )

            if(error){
                return new UserInputError('Validation error!', { field, issue })
            }

            const userToReset = await ProfileModel.findOne({ email: email })
            if(!userToReset){
                return new UserInputError('No such email in system!')
            }

            const datingMarker = new Date().getTime()
            userToReset.resetPwdToken = datingMarker.toString()
            try{
                await userToReset.save()
            }catch(err){
                return new ApolloError('Password reset registring error occured!', err)
            }

            const complexIdToken = createTokenToLink(datingMarker, userToReset.pwdHash, 
                userToReset._id
            )
            //something removes the :// from protocol definition
            const domainUrlAndPath = context.domainURL.prot + '://' 
                + context.domainURL.dom + '/apath/' + complexIdToken //REST GET type
            const EMAIL_TYPE_TXT = emailTypeStringify(emailType.PWDRESETING)

            execMailSending(email, emailType.PWDRESETING, {
                anchUrl: domainUrlAndPath,
                anchTxt: 'Click here!'
            }).then(async (sendingProc)=>{
                await saveEmailReportToDB(email, EMAIL_TYPE_TXT, sendingProc.integrity,
                    sendingProc.resultId)
                })
            .catch(async (err)=>{
                if(sendingProc.progress === 'errorAtAssemble' || sendingProc.progress === 'errorAtSending'){
                    await saveEmailReportToDB(email, EMAIL_TYPE_TXT, sendingProc.integrity, 
                        sendingProc.progress)
                    return new ApolloError('Password reset email error occured!', { general: 'email stucked' })
                }else{
                    await saveEmailReportToDB(email, EMAIL_TYPE_TXT, 'none', 'errorenousResolvation')
                    return new ApolloError('Password reset email error occured!', err.err)
                }
            })
            return {
                resultText: 'Password reset email is sent!',
                id: 'none',
                email: email,
                username: 'none'

            }
        },

        async changePassword(_, args, {authorizRes}){
            const { error, field, issue, pwdTextOld, pwdTextNew } = changePwdInputRevise(
                args.oldpassword, args.newpassword, args.newconf
            )
            if(error){
                return new UserInputError('Password changing', { field, issue })
            }
            authorizEvaluation(authorizRes)

            //old password revsision
            const userToChangePwd = await ProfileModel.findOne({ _id: authorizRes.subj })
            await passwordsMatching(userToChangePwd, pwdTextOld)

            //process execution
            const newPwdHashing = await encryptPwd(pwdTextNew);
            if(newPwdHashing.error){
                return new ApolloError('Server error occured', { general: 'Pwd encryption error!' })
            }
            userToChangePwd.pwdHash = newPwdHashing.hash;
            try{
                await userToChangePwd.save();
            }catch(err){
                return new ApolloError('Server error occured', { general: 'Pwd persistence error!' })
            }
            return {
                resultText: 'Your password changed!',
                id: authorizRes.subj,
                email: userToChangePwd.email,
                username: userToChangePwd.username
            }
        },

        async changeAccountDatas(_, args, {authorizRes}){
            const { error, field, issue, username} = updateAccDetInputRevise(
                args.username
            )
            if(error){
                return new UserInputError('Account details changing', { field, issue })
            }

            authorizEvaluation(authorizRes)
            const userToUpdate = await ProfileModel.findOne({ _id: authorizRes.subj})
            if(!userToUpdate){
                return new ApolloError('No user found', { general: 'No target of Token id' })
            }
            userToUpdate.username = username
            try{
                await userToUpdate.save()
            }catch(err){
                return new ApolloError('Server error occured', err)
            }
            return {
                resultText: 'Account datas changed!',
                id: authorizRes.subj,
                email: userToUpdate.email,
                username: userToUpdate.username
                
            }
        },

        async deleteAccount(_, args, {authorizRes}){
            const { error, field, issue, pwdTextOld } = deleteAccInputRevise(
                args.password,
                args.passwordconf
            )
            if(error){
                return new UserInputError('Delete account passwords', { field, issue })
            }

            authorizEvaluation(authorizRes)
            const userToDelete = await ProfileModel.findOne({ _id: authorizRes.subj })

            await passwordsMatching(userToDelete, pwdTextOld)
            const tempDatas = { email: userToDelete.email, username: userToDelete.username }
            await ProfileModel.deleteOne({ _id: authorizRes.subj}, (err)=>{
                if(err){
                    return new ApolloError('Server error occured', err)
                }
            })

            return {
                resultText: 'Account deleted!',
                id: authorizRes.subj,
                email: tempDatas.email,
                username: tempDatas.username

            }
        }
    }
}