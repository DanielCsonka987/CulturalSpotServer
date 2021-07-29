const { ApolloError } = require('apollo-server-express')


const ProfileModel = require('../../models/ProfileModel')
const { authorazEvaluation } = require('./someHelper')

module.exports = {

    Query: {

        async listOfMyFriends(_, __, context){
            await authorazEvaluation(context)

            const userAtQuery = await ProfileModel.findOne({id: context.authorazRes.subj})
            if(!userAtQuery){
                return new ApolloError('No user found', { general: 'No target of Token id' })
            }
            console.log(userAtQuery)
        },
        listOfFriendsOf: (_, args, context)=>{
            args.friendid
        }

    },
    Mutation: {
        makeAFriend: (_, args, context)=>{
            args.friendid
        },
        removeAFriend: (_, args, context)=>{
            args.friendid
        }
    }
}