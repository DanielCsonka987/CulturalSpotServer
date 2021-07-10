const mongoose = require('mongoose')
const { AuthenticationError, UserInputError, ApolloError  } = require('apollo-server')

const { tokenEncoder } = require('../../utils/tokenManager')
const { encryptPwd, matchTextHashPwd } = require('../../utils/bCryptManager')
const { loginRevise, registerRevise } = require('../../utils/inputRevise')
const ProfileModel = require('../../models/ProfileModel')


module.exports = {
    Mutation: {
        async login(_, args){
            const { error, field, issue, email, pwdText} = loginRevise(
                args.email, args.password)
            if(error){
                return new UserInputError('Login validation error!', { field, issue })
            }

            const user = await ProfileModel.findOne({ email })
            if(!user){
                return new AuthenticationError('Wrong username or password!')
            }
            const { match, error2 } = await matchTextHashPwd(pwdText, user.pwdHash)
            if(error2){
                return new UserInputError('Login error!', { error2 })
            }
            if(!match){
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
            const { error, field, issue, email, pwdText, username } = registerRevise(
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
                return new AuthenticationError('Registration encryption error!', encrypt.error )
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
        }
    }
}