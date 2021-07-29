const { ApolloError } = require('apollo-server-express')

const ProfileModel = require('../../models/ProfileModel')
const { authorazEvaluation } = require('./someHelper')
const { useridInputRevise } = require('../../utils/inputRevise')

module.exports = {

    Query: {

        async listOfMyFriends(_, __, context){
            await authorazEvaluation(context)

            const userAtQuery = await ProfileModel.findOne({_id: context.authorazRes.subj})
            if(!userAtQuery){
                return new ApolloError('No user found', { general: 'No target of Token id' })
            }
            console.log(userAtQuery)

            const friendsOfUser = await ProfileModel.find({ _id: userAtQuery.friends })

            console.log(friendsOfUser)
            return friendsOfUser
        },

        async listOfFriendOfThisUser(_, args, context){
            await authorazEvaluation(context)

            const { error, issue, field, userid} = useridInputRevise(args.friendid)
            if(error){
                return new UserInputError('Friendlist of a friends requesting', { field, issue })
            }
            
            const userAtQuery = await ProfileModel.findOne({_id: userid})
            if(!userAtQuery){
                return new ApolloError('No user found', { general: 'No target of input userid' })
            }
            console.log(userAtQuery)

            const friendsOfUser = await ProfileModel.find({ _id: userAtQuery.friends })

            console.log(friendsOfUser)

            return friendsOfUser
        }

    },
    Mutation: {
        async makeAFriend(_, args, context){
            await authorazEvaluation(context)

            const { error, issue, field, userid} = useridInputRevise(args.friendid)
            if(error){
                return new UserInputError('', { field, issue })
            }
        },
        async removeAFriend(_, args, context){
            await authorazEvaluation(context)

            const { error, issue, field, userid} = useridInputRevise(args.friendid)
            if(error){
                return new UserInputError('', { field, issue })
            }

        },
        async approveThisFriendRequest(_, args, context){

        },
        async removeThisFriendRequest(_, args, context){
            
        }
    }
}