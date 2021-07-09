const mongoose = require('mongoose')
const { UserInputError } = require('apollo-server')

const { tokenEncoder } = require('../../utils/tokenManager')
const { encryptPwd, matchTextHashPwd } = require('../../utils/bCryptManager')
const { loginRevise } = require('../../utils/inputRevise')
const ProfileModel = require('../../models/ProfileModel')


module.exports = {
    Mutation: {
        async login(_, args, context){
            const { error, field, issue,  email, pwdText} = loginRevise(args.email, args.password)
            if(error){
                return new UserInputError('Login validation error!', { field, issue })
            }

            const user = await ProfileModel.findOne({ email })
            if(!user){
                return new UserInputError('Wrong username or password!')
            }
            const { match, error2 } = await matchTextHashPwd(pwdText, user.pwdHash)
            if(error2){
                return new UserInputError('Login error!', { error2 })
            }
            if(!match){
                return new UserInputError('Wrong username or password!')
            }

            user.token = tokenEncoder({id: user.id, email: user.email})
            return user
        },
        async registration(_, args){

            return {
                id: '123',
                email: 'stg@gmail.com',
                username: 'Me here',
                token: '123456abc',
                registeredAt: 'sometime'

            }
        }
    }
}