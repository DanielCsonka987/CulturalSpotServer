const { AuthenticationError, UserInputError, ApolloError  } = require('apollo-server')


const { tokenEncoder, tokenInputRevise, tokenVerify } = require('../../utils/tokenManager')
const { encryptPwd, matchTextHashPwd } = require('../../utils/bCryptManager')
const { loginInputRevise, registerInputRevise, 
    changePwdInputRevise, deleteAccInputRevise,
    updateAccDetInputRevise, resetPwdInputRevise } = require('../../utils/inputRevise')
const ProfileModel = require('../../models/ProfileModel')

async function tokenEvaluation(context){

    const tokenReport = tokenInputRevise(context.req)
    if(tokenReport.missing){
        throw new AuthenticationError('Login to use the service!', { general: 'Missing token!' })
    }
    const tokenDetails = await tokenVerify(tokenReport.takenText);
    if(tokenDetails.error){
        throw new ApolloError('Server error occured!', tokenDetails.error)
    }
    if(tokenDetails.expired){
        throw new AuthenticationError('Login to use the service!', { general: 'Expired token!' })
    }
    return tokenDetails;
}

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

module.exports = {
    Mutation: {
        async login(_, args){
            const { error, field, issue, email, pwdText} = loginInputRevise(
                args.loginInput.email, args.loginInput.password)
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

            return {
                id: userToLogin._id,
                token: tokenEncoder({id: userToLogin.id, email: userToLogin.email}),
                email: userToLogin.email,
                username: userToLogin.username,
                registeredAt: userToLogin.registeredAt,
                lastLoggedAt: lastLoggedTime
            }
        },

        async registration(_, args){
            const { error, field, issue, email, pwdText, username } = registerInputRevise(
                args.registrationInput.email, 
                args.registrationInput.password, 
                args.registrationInput.passwordconf, 
                args.registrationInput.username
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
                token: tokenEncoder({ id: newUser._id, email: newUser.email }),
                email: newUser.email,
                username: newUser.username,
                registeredAt: newUser.registeredAt,
                lastLoggedAt: userToLogin.lastLoggedAt
            }
        },

        async resetPassword(_, args){
            const { error, field, issue, email } = resetPwdInputRevise( args.username )

            if(error){
                return new UserInputError('Validation error!', { field, issue })
            }

            const userToReset = Profile.findOne({ email })
            if(!userToReset){
                return new UserInputError('No such email in system!')
            }

            const datingMarker = new Date().getTime()
            userToReset.resetPwdMarker = datingMarker
            try{
                userToReset.save()
            }catch(err){
                return new ApolloError('Password reset registring error occured!', err)
            }
            const secretKeyToEncode = userToReset.pwdHash + datingMarker;
            const specToken = tokenEncoder({ marker: datingMarker  }, secretKeyToEncode)
            const specEmailUrl = userToReset._id + '.' + specToken; //REST GET type

            //Sending email with peoper static, guid text and link - that leads client side with
            //the token in the request header
            //-> handle the unknown email target errors
            //-> handle email sending errors

            return {
                id: '',
                resultText: 'Password reset email is sent!',
                processResult: true
            }
        },

        async changePassword(_, args, context){
            const { error, field, issue, pwdTextOld, pwdTextNew } = changePwdInputRevise(
                args.changePwdInput.oldpassword,
                args.changePwdInput.newpassword,
                args.changePwdInput.passwordconf
            )
            if(error){
                return new UserInputError('Password changing', { field, issue })
            }

            const tokenExtract = await tokenEvaluation(context)

            //old password revsision
            const userToChangePwd = await ProfileModel.findOne({ _id: tokenExtract.id })
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
                id: tokenExtract.id,
                resultText: 'Your password changed!',
                processResult: true
            }
        },

        async changeAccountDatas(_, args, context){
            const { error, field, issue, username} = updateAccDetInputRevise(
                args.username
            )
            if(error){
                return new UserInputError('Account details changing', { field, issue })
            }

            const tokenExtract = await tokenEvaluation(context)
            const userToUpdate = await ProfileModel.findOne({ _id: tokenExtract.id})
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
                id: tokenExtract.id,
                resultText: 'Account datas changed!',
                processResult: true
            }
        },

        async deleteAccount(_, args, context){
            const { error, field, issue, pwdTextOld } = deleteAccInputRevise(
                args.delAccountInput.password,
                args.delAccountInput.passwordconf
            )
            if(error){
                return new UserInputError('Delete account passwords', { field, issue })
            }

            const tokenExtract = await tokenEvaluation(context)
            const userToDelete = await ProfileModel.findOne({ _id: tokenExtract.id })

            await passwordsMatching(userToDelete, pwdTextOld)

            await ProfileModel.deleteOne({ _id: tokenExtract.id}, (err)=>{
                if(err){
                    return new ApolloError('Server error occured', err)
                }
            })

            return {
                id: tokenExtract.id,
                resultText: 'Account deleted!',
                processResult: true
            }
        }
    }
}