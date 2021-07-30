const { ApolloError, UserInputError } = require('apollo-server-express')
const mongooseId = require('mongosse').Types.ObjectId;

const ProfileModel = require('../../models/ProfileModel')
const { authorizEvaluation, countTheAmountOfFriends, defineUserConnections } = require('./someHelper')
const { useridInputRevise } = require('../../utils/inputRevise')

module.exports = {

    Query: {
        async listOfMyFriends(_, __, { authorizRes }){
            await authorizEvaluation(authorizRes)

            const myAccount = await ProfileModel.findOne({_id: authorizRes.subj})
            if(!myAccount){
                return new ApolloError('No user found', { general: 'No target of Token id' })
            }
            const usersFriendsAccounts = await ProfileModel.find({ _id: myAccount.friends })

            return  usersFriendsAccounts.map(frnd=>{
                return { 
                    id: frnd._id,
                    username: frnd.username,
                    email: frnd.email
                }
            })
        },
        async listOfUndecidedFriendships(_, __, { authorizRes }){
            await authorizEvaluation(authorizRes)

            const myAccount = await ProfileModel.findOne({_id: authorizRes.subj})
            if(!myAccount){
                return new ApolloError('No user found', { general: 'No target of Token id' })
            }
            const usersUndecidedFriends = await ProfileModel.find({ _id: myAccount.undecidedCon })

            return  usersUndecidedFriends.map(async frnd=>{
                return { 
                    id: frnd._id,
                    username: frnd.username,
                    relation: 'UNCERTAIN',
                    mutualFriendCount: await countTheAmountOfFriends(frnd._id, myAccount)
                }
            })
        },
        async listOfInitiatedFriendships(_, __, { authorizRes}){
            await authorizEvaluation(authorizRes)

            const myAccount = await ProfileModel.findOne({_id: authorizRes.subj})
            if(!myAccount){
                return new ApolloError('No user found', { general: 'No target of Token id' })
            }

            const usersInitiatedFriendships = await ProfileModel.find({ _id: myAccount.initiatedCon })

            return  usersInitiatedFriendships.map(async frnd=>{
                return { 
                    id: frnd._id,
                    username: frnd.username,
                    relation: 'UNCERTAIN',
                    mutualFriendCount: await countTheAmountOfFriends(frnd._id, myAccount)
                }
            })
        },
        async showThisUserInDetail(_, args, { authorizRes }){
            await authorizEvaluation( authorizRes )

            const { error, issue, field, userid} = useridInputRevise(args.userid)
            if(error){
                return new UserInputError('No proper userid for show a user catalog!', { field, issue })
            }
            const accountAtQuery = await ProfileModel.findOne({_id: userid})
            if(!accountAtQuery){
                return new UserInputError('No user found', { general: 'No target of input userid' })
            }
            const theFriendList = await ProfileModel.find({ _id: accountAtQuery.friends })
            const clientUser = await ProfileModel.findOne({ _id: authorizRes.subj })
            return {
                id: userid,
                email: accountAtQuery.email,
                username: accountAtQuery.username,
                registeredAt: accountAtQuery.registeredAt,
                relation: defineUserConnections(accountAtQuery, clientUser),
                mutualFriendCount: await countTheAmountOfFriends(accountAtQuery._id, clientUser),
                friends: theFriendList
            } 
        }

    },
    Mutation: {
        async initiateAFriendship(_, args, { authorizRes }){
            await authorizEvaluation(authorizRes)

            const { error, issue, field, userid} = useridInputRevise(args.friendid)
            if(error){
                return new UserInputError('No proper userid for initiate friendship!', { field, issue })
            }
            const targetUser = await ProfileModel.findOne({ _id: userid })
            if(!targetUser){
                return new UserInputError('No user found', { general: 'No target of input userid' })
            }
            const clientUser = await ProfileModel.findOne({ _id: authorizRes.subj })
            try{
                clientUser.initiatedCon.push(new mongooseId(userid))
                await clientUser.save()
                targetUser.undecidecCon.push(clientUser._id)
                await targetUser.save()
            }catch(err){
                throw new ApolloError('Persistence error occured', err)
            }
            return {
                id: userid,
                username: targetUser.username,
                relation: 'UNCERTAIN',
                mutualFriendCount: await countTheAmountOfFriends(targetUser._id, clientUser),
            }
        },



        async removeAFriendshipInitiation(_, args, { authorizRes }){
            await authorizEvaluation(authorizRes)

            const { error, issue, field, userid} = useridInputRevise(args.friendid)
            if(error){
                return new UserInputError('', { field, issue })
            }

        },
        async approveThisFriendshipRequest(_, args, { authorizRes }){
            await authorizEvaluation(authorizRes)

        },
        async removeThisFriendshipRequest(_, args, { authorizRes }){
            await authorizEvaluation(authorizRes)
            
        },
        async removeThisFriend(_, args, { authorizRes }){
            await authorizEvaluation(authorizRes)

        }
    }
}