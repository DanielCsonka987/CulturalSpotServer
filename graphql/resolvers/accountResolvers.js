const { AuthenticationError, UserInputError, ApolloError  
    } = require('apollo-server-express')

//helper utils, standalone like, models
const { authorizTokenEncoder, createResetTokenToLink, createLoginRefreshToken 
    } = require('../../utils/tokenManager')
const { encryptPwd, matchTextHashPwd } = require('../../utils/bCryptManager')
const { loginInputRevise, registerInputRevise, 
    changePwdInputRevise, deleteAccInputRevise,
    updateAccDetInputRevise, resetPwdInputRevise, passwordRenewInputRevise
 } = require('../../utils/inputRevise')

// someHelper function in resolving - not standalone, apollo connected!
const { 
    authorizEvaluation, tokenRefreshmentEvaluation, resetTokenEvaluation
} = require('./resolveHelpers')

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
    Query: {

        async refreshAuth(_, args, { dataSources, refreshRes }){
            //authorization probabyl expired, no normal Evaluation here!!!

            tokenRefreshmentEvaluation(refreshRes)

            const clientUser = await dataSources.profiles.get(refreshRes.id)
            if(!clientUser){
                return new ApolloError('No user found', { general: 'No target of Token id' })
            }
            if(clientUser.refreshToken !== refreshRes.takenText){
                return new UserInputError('No token match', 
                    { general: 'Token valid, but it is not the persisted one' }
                )
            }

            return {
                id: clientUser._id.toString(),
                newToken: authorizTokenEncoder({subj: clientUser._id.toString(), email: clientUser.email}),
                tokenExpire: 900
            }
        },
        async requireClientContent(_, __, { dataSources, authorizRes }){
            authorizEvaluation(authorizRes)

            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            return clientUser.getUserPrivateData
            /*{
                id: clientUser._id,
                email: clientUser.email,
                username: clientUser.username,
                registeredAt: clientUser.registeredAt.toISOString(),
                lastLoggedAt: clientUser.lastLoggedAt.toISOString(),

                friends: clientUser.friends,   //array of userids
                posts: clientUser.myPosts,  //array of postids
                chats: clientUser.myChats
            }*/
        }
    },
    Mutation: {
        async login(_, args, { dataSources }){
            const { error, field, issue, email, pwdText} = loginInputRevise(
                args.email, args.password)
            if(error){
                return new UserInputError('Login validation error!', { field, issue })
            }

            const userToLogin = await dataSources.profiles.get(email)
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
            const refreshTokenStr = createLoginRefreshToken({id: userToLogin._id.toString()})
            userToLogin.lastLoggedAt = new Date()
            userToLogin.resetPwdMarker = '';
            userToLogin.refreshToken = refreshTokenStr;
            try{
                dataSources.profiles.saving(userToLogin);
            }catch(err){
                return new ApolloError('Login timestamp persisting failed!')
            }
            return userToLogin.getUserLoginDatas(
                authorizTokenEncoder({subj: userToLogin._id.toString(), email: userToLogin.email}),
                refreshTokenStr, 900, lastLoggedTime)
            /*
            return {
                id: userToLogin._id,
                email: userToLogin.email,
                username: userToLogin.username,
                token: authorizTokenEncoder({subj: userToLogin._id.toString(), email: userToLogin.email}),
                tokenExpire: 3600,
                refreshToken: refreshTokenStr,
                registeredAt: userToLogin.registeredAt.toISOString(),
                lastLoggedAt: lastLoggedTime.toISOString(),

                friends: userToLogin.friends,   //array of userids
                posts: userToLogin.myPosts,  //array of postids
                chats: userToLogin.myChats
            }*/
        },

        async registration(_, args, { dataSources, domainURL, emailingServices }){
            const { error, field, issue, email, pwdText, username } = registerInputRevise(
                args.email, args.password, args.passwordconf, args.username
            )
            if(error){
                return new UserInputError('Registration validation error!', { field, issue })
            }

            const resUser = await dataSources.profiles.get(email)
            if(resUser){
                return new UserInputError('This email is already occupied!')
            }

            const encrypt = await encryptPwd(pwdText)
            if(encrypt.error){
                return new ApolloError('Registration encryption error!', encrypt.error )
            }
            
            let newUser = ''
            const actTime = new Date()
            try{
                newUser = await dataSources.profiles.create({
                    email: email,
                    username: username,
                    pwdHash: encrypt.hash,
                    registeredAt: actTime,
                    lastLoggedAt: actTime,
                    resetPwdMarker: '',
                    refreshToken: '',
        
                    friends: [],
                    initiatedCon: [],
                    undecidedCon: []
                })
            }catch(err){
                return ApolloError('Registration is not completed!', { err })
            }
            const refreshToken = createLoginRefreshToken({id: newUser._id.toString()})
            newUser.refreshToken = refreshToken;
            try{
                await dataSources.profiles.saving(newUser)
            }catch(err){
                return ApolloError('Login is not completed!', { err })
            }

            await emailingServices.registrationEmailSending(domainURL.apolloUrl,
                newUser.username, newUser.email)

            return newUser.getUserLoginDatas(
                authorizTokenEncoder({subj: newUser._id.toString(), email: newUser.email}),
                refreshToken, 900)
                /*
            return {
                id: newUser._id,
                token: authorizTokenEncoder({ subj: newUser._id.toString(), email: newUser.email }),
                tokenExpire: 3600,
                email: newUser.email,
                username: newUser.username,
                registeredAt: newUser.registeredAt.toISOString(),
                lastLoggedAt: newUser.lastLoggedAt.toISOString(),
                refreshToken: refreshToken,

                friends: [],
                allPosts: [],
                allChats: []
            }*/
        },
/* 
 * Resetting forgotten password first step -> email creation with link
 * Href = doman + userid + resetToken
 * resetToken with secretkey of hashPWD and timemark, content of {mark: timemark}
 * BUT - Jest makes 57*** PORT NUMBER TO THE APP -> Link to click in email wrong port has !!
*/
        async resetPasswordStep1(_, args, { dataSources, domainURL, emailingServices }){
            const { error, field, issue, email } = resetPwdInputRevise( args.email )

            if(error){
                return new UserInputError('Validation error!', { field, issue })
            }

            const userToReset = await dataSources.profiles.get(email)
            if(!userToReset){
                return new UserInputError('No such email in system!')
            }

            const datingMarker = new Date().getTime().toString()
            userToReset.resetPwdMarker = datingMarker
            try{
                await dataSources.profiles.saving(userToReset)
            }catch(err){
                return new ApolloError('Password reset registring error occured!', err)
            }

            const specIdTokenToPath = createResetTokenToLink(datingMarker, userToReset.pwdHash, 
                userToReset._id
            )

            await emailingServices.passwordResettingEmailSending(domainURL.apolloUrl, 
                    userToReset.username, userToReset.email, specIdTokenToPath)
            return {
                resultText: 'Password reset email is sent!',
                id: 'none',
                email: email,
                username: 'none'

            }
        },
        async resetPasswordStep3(_, args, { pwdResetRes, dataSources }){
            const resetPermission = await resetTokenEvaluation(
                pwdResetRes, dataSources
            )
            
            if(!passwordRenewInputRevise(args.newpassword, args.newconf)){
                return new UserInputError('Password and conformation don\'t matches!')
            }

            //process execution
            const newPwdHashing = await encryptPwd(args.newpassword);
            if(newPwdHashing.error){
                return new ApolloError('Server error occured', { general: 'Pwd encryption error!' })
            }
            let email = ''
            try{
                const client = await dataSources.profiles.get(resetPermission.userid)
                client.pwdHash = newPwdHashing.hash
                client.resetPwdMarker = ""
                email = client.email
                await dataSources.profiles.saving(client)
            }catch(err){
                return new ApolloError('Server error occured ', err)
            }

            return {
                resultText: 'Password resetting done!',
                id: 'none',
                email: email,
                username: 'none'

            }
        },
        async changePassword(_, args, { authorizRes, dataSources }){
            const { error, field, issue, pwdTextOld, pwdTextNew } = changePwdInputRevise(
                args.oldpassword, args.newpassword, args.newconf
            )
            if(error){
                return new UserInputError('Password changing', { field, issue })
            }
            authorizEvaluation(authorizRes)

            //old password revsision
            const userToChangePwd = await dataSources.profiles.get(authorizRes.subj)
            if(!userToChangePwd){
                return new ApolloError('No user found', { general: 'No target of Token id' })
            }
            await passwordsMatching(userToChangePwd, pwdTextOld)

            //process execution
            const newPwdHashing = await encryptPwd(pwdTextNew);
            if(newPwdHashing.error){
                return new ApolloError('Server error occured', { general: 'Pwd encryption error!' })
            }
            userToChangePwd.pwdHash = newPwdHashing.hash;
            try{
                await dataSources.profiles.saving(userToChangePwd);
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

        async changeAccountDatas(_, args, { authorizRes, dataSources }){
            const { error, field, issue, username} = updateAccDetInputRevise(
                args.username
            )
            if(error){
                return new UserInputError('Account details changing', { field, issue })
            }

            authorizEvaluation(authorizRes)
            const userToUpdate = await dataSources.profiles.get(authorizRes.subj)
            if(!userToUpdate){
                return new ApolloError('No user found', { general: 'No target of Token id' })
            }

            userToUpdate.username = username
            try{
                await dataSources.profiles.saving(userToUpdate)
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

        async deleteAccount(_, args, { authorizRes, dataSources, domainURL, emailingServices }){
            const { error, field, issue, pwdTextOld } = deleteAccInputRevise(
                args.password,
                args.passwordconf
            )
            if(error){
                return new UserInputError('Delete account passwords', { field, issue })
            }

            authorizEvaluation(authorizRes)
            const userToDelete = await dataSources.profiles.get(authorizRes.subj)
            if(!userToDelete){
                return new ApolloError('No user found', { general: 'No target of Token id' })
            }

            await passwordsMatching(userToDelete, pwdTextOld)
            const tempDatas = { email: userToDelete.email, username: userToDelete.username }
            try{
                await dataSources.profiles.deleting(authorizRes.subj)
            }catch(err){               
                return new ApolloError('Server error occured', err)
            }

            await emailingServices.accountRemovalEmailSending(domainURL.apolloUrl, 
                tempDatas.username, tempDatas.email)
            return {
                resultText: 'Account deleted!',
                id: authorizRes.subj,
                email: tempDatas.email,
                username: tempDatas.username

            }
        },

        async logout(_, __, { authorizRes, dataSources }){

            authorizEvaluation(authorizRes)

            const clientToLogout = await dataSources.profiles.get(authorizRes.subj)
            if(!clientToLogout){
                return new ApolloError('No user found', { general: 'No target of Token id' })
            }
            clientToLogout.refreshToken = ''
            await dataSources.profiles.saving(clientToLogout)

            return {
                resultText: 'You have been logged out!',
                id: clientToLogout._id.toString(),
                email: clientToLogout.email,
                username: clientToLogout.username
            }
        }

    }
}