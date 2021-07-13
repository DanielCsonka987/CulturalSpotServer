const { AuthenticationError, UserInputError, ApolloError  } = require('apollo-server')

const { tokenEncoder, tokenInputRevise, tokenVerify } = require('../../utils/tokenManager')
const { encryptPwd, matchTextHashPwd } = require('../../utils/bCryptManager')
const { loginInputRevise, registerInputRevise, 
    changePwdInputRevise, deleteAccInputRevise } = require('../../utils/inputRevise')
const ProfileModel = require('../../models/ProfileModel')

async function tokenEvaluation(context){

    const tokenReport = tokenInputRevise(context.req)
    if(tokenReport.missing){
        return new AuthenticationError('Login to use the service!', { general: 'Missing token!' })
    }
    const tokenDetails = await tokenVerify(tokenReport.takenText);
    if(tokenDetails.error){
        return new ApolloError('Server error occured!', tokenDetails.error)
    }
    if(tokenDetails.expired){
        return new AuthenticationError('Login to use the service!', { general: 'Expired token!' })
    }
    return tokenDetails;
}

async function passwordMatchingAttempt(userModel, pwdTextOld){
    if(!userModel){
        return new ApolloError('Server error occured!', { general: 'No user found in DB by Token id' })
    }
    const pwdReport = await matchTextHashPwd(pwdTextOld, userModel.pwdHash)
    if(pwdReport.error){
        return new ApolloError('Server error occured!', pwdReport.error)
    }
    if(!pwdReport.match){
        return new AuthenticationError('Wrong password!', { general: 'Password input faild in hash matching!' })
    }
    return
}

module.exports = {
    Mutation: {
        async login(_, args){
            const { error, field, issue, email, pwdText} = loginInputRevise(
                args.loginInput.email, args.loginInput.password)
            if(error){
                return new UserInputError('Login validation error!', { field, issue })
            }

            const user = await ProfileModel.findOne({ email })
            if(!user){
                return new AuthenticationError('Wrong username or password!', { general: 'No account found!'})
            }
            const pwdReport = await matchTextHashPwd(pwdText, user.pwdHash)
            if(pwdReport.error){
                return new UserInputError('Login error!', pwdReport.error )
            }
            if(!pwdReport.match){
                return new AuthenticationError('Wrong username or password!')
            }

            return {
                id: user._id,
                token: tokenEncoder({id: user.id, email: user.email}),
                email: user.email,
                username: user.username,
                registeredAt: user.registeredAt
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
            
            const newUser = new ProfileModel({
                email: email,
                username: username,
                pwdHash: encrypt.hash,
                registeredAt: new Date().toISOString()
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
                registeredAt: newUser.registeredAt
            }
        },

        async resetPassword(_, args){
            return {
                resultText: 'Password reseted!',
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
            const userToChangePwd = await ProfileModel.findOne({ _id: tokenExtract.userid })
            if(!userToChangePwd){
                return new ApolloError('Server error occured!', { general: 'No user found in DB by Token id' })
            }
            const pwdReport = await matchTextHashPwd(pwdTextOld, userToChangePwd.pwdHash)
            if(pwdReport.error){
                return new ApolloError('Server error occured!', pwdReport.error)
            }
            if(!pwdReport.match){
                return new AuthenticationError('Wrong password!', { general: 'Password input faild in hash matching!' })
            }

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
                processResult: true
            }
        },

        async changeAccountDatas(_, args){
            return {
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
                return new UserInputError('Password changing', { field, issue })
            }

            const tokenExtract = await tokenEvaluation(context)

            //old password revsision
            const userToDelete = await ProfileModel.findOne({ _id: tokenExtract.userid })
            await passwordMatchingAttempt(userToDelete, pwdTextOld)

            await ProfileModel.deleteOne({ _id: tokenExtract.userid}, (err)=>{
                if(err){
                    return new ApolloError('Server error occured', { general: 'Account removal error!' })
                }
            })

            return {
                resultText: 'Account deleted!',
                processResult: true
            }
        }
    }
}