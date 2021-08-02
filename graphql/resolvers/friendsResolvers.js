const { ApolloError, UserInputError } = require('apollo-server-express')

const ProfileModel = require('../../models/ProfileModel')
const { authorizEvaluation, countTheAmountOfFriends, defineUserConnections, getTheUsernameFromId } = require('./someHelper')
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
                    relation: 'INITIATED',
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
                relation: defineUserConnections(accountAtQuery._id, clientUser),
                mutualFriendCount: await countTheAmountOfFriends(accountAtQuery._id, clientUser),
                friends: theFriendList
            } 
        },
        async showMeWhoCouldBeMyFriend(_, __, { authorizRes }){
            await authorizEvaluation( authorizRes )
            const clientUser = await ProfileModel.findOne({ _id: authorizRes.subj })

            const possibleFriendOutput = []
            for( const undecCon of clientUser.undecidedCon){
                possibleFriendOutput.push({ 
                    id: undecCon._id,
                    username: await getTheUsernameFromId(undecCon._id),
                    relation: 'UNCERTAIN',
                    mutualFriendCount: await countTheAmountOfFriends(undecCon, clientUser)
                })
            }
            for(const frnd of clientUser.friends ){

                const frndAcc = await ProfileModel.findOne({ _id: frnd._id })
                const allInterestingFriendidOfThiFriend = frndAcc.friends.filter(
                    item=>{ return !item.equals(clientUser._id) }
                )
                for(const frndOfFrnd_id of allInterestingFriendidOfThiFriend){
                    possibleFriendOutput.push({
                        id: frndOfFrnd_id.toString(),
                        username: await getTheUsernameFromId(frndOfFrnd_id),
                        relation: defineUserConnections(frndOfFrnd_id, clientUser),
                        mutualFriendCount: await countTheAmountOfFriends(frndOfFrnd_id, clientUser)
                    })
                }

            }
            return possibleFriendOutput
        }
    },
    Mutation: {
        async createAFriendshipInvitation(_, args, { authorizRes }){
            await authorizEvaluation(authorizRes)

            const { error, issue, field, userid} = useridInputRevise(args.friendid)
            if(error){
                return new UserInputError('No proper userid for initiate friendship!', { field, issue })
            }
            if(userid === authorizRes.subj){
                return new UserInputError('This userid belogns to your account, not permitted!')
            }

            const targetUser = await ProfileModel.findOne({ _id: userid })
            if(!targetUser){
                return new UserInputError('No user found', { general: 'No target of input userid' })
            }
            const clientUser = await ProfileModel.findOne({ _id: authorizRes.subj })

            if(clientUser.initiatedCon.includes(targetUser._id)){
                return new UserInputError('This userid is marked as initiated connection!')
            }
            try{
                clientUser.initiatedCon.push(targetUser._id)
                await clientUser.save()
                targetUser.undecidedCon.push(clientUser._id)
                await targetUser.save()
            }catch(err){
                throw new ApolloError('Persistence error occured', err)
            }
            return {
                id: userid,
                username: targetUser.username,
                relation: 'UNCERTAIN',
                mutualFriendCount: await countTheAmountOfFriends(targetUser._id, clientUser)
            }
        },
        async removeAFriendshipInitiation(_, args, { authorizRes }){
            await authorizEvaluation(authorizRes)

            const { error, issue, field, userid} = useridInputRevise(args.friendid)
            if(error){
                return new UserInputError('No proper userid for remove a friendship invitation!', { field, issue })
            }
            if(userid === authorizRes.subj){
                return new UserInputError('This userid belogns to your account, not permitted!')
            }

            const targetUser = await ProfileModel.findOne({ _id: userid })
            if(!targetUser){
                return new UserInputError('No user found', { general: 'No target of input userid' })
            }
            const clientUser = await ProfileModel.findOne({ _id: authorizRes.subj })

            if(!clientUser.initiatedCon.includes(targetUser._id)){
                return new UserInputError('This userid is NOT marked as initiated connection!')
            }
            try{
                clientUser.initiatedCon = clientUser.initiatedCon.filter(
                    item=>{ return !item.equals(targetUser._id) }
                )
                await clientUser.save()
                targetUser.undecidedCon = targetUser.undecidedCon.filter(
                    item=>{ return !item.equals(clientUser._id) }
                )
                await targetUser.save()
            }catch(err){
                throw new ApolloError('Persistence error occured', err)
            }

            return {
                useridAtProcess: userid,
                resultText: 'Firendship initiation cancelled!'
            }
        },
        async approveThisFriendshipRequest(_, args, { authorizRes }){
            await authorizEvaluation(authorizRes)

            const { error, issue, field, userid} = useridInputRevise(args.friendid)
            if(error){
                return new UserInputError('No proper userid for accept a friendship invitation!', { field, issue })
            }
            if(userid === authorizRes.subj){
                return new UserInputError('This userid belogns to your account, not permitted!')
            }

            const targetUser = await ProfileModel.findOne({ _id: userid })
            if(!targetUser){
                return new UserInputError('No user found', { general: 'No target of input userid' })
            }

            const clientUser = await ProfileModel.findOne({ _id: authorizRes.subj })
            if(clientUser.friends.includes(targetUser._id)){
                return new UserInputError('This userid is already marked as your friend!')
            }
            if(!clientUser.undecidedCon.includes(targetUser._id)){
                return new UserInputError('This userid is NOT marked as undecided connection!')
            }
            try{
                clientUser.undecidedCon = clientUser.undecidedCon.filter(
                    item=>{ return !item.equals(targetUser._id) }
                )
                clientUser.friends.push(targetUser._id)
                await clientUser.save()

                targetUser.initiatedCon = targetUser.initiatedCon.filter(
                    item=>{ return !item.equals(clientUser._id) }
                )
                targetUser.friends.push(clientUser._id)
                await targetUser.save()
            }catch(err){
                throw new ApolloError('Persistence error occured', err)
            }
            return{
                id: userid,
                username: targetUser.username,
                email: targetUser.email
            }

        },
        async removeThisFriendshipRequest(_, args, { authorizRes }){
            await authorizEvaluation(authorizRes)
            const { error, issue, field, userid} = useridInputRevise(args.friendid)
            if(error){
                return new UserInputError('No proper userid for refuse a friendship invitation!', { field, issue })
            }
            if(userid === authorizRes.subj){
                return new UserInputError('This userid belogns to your account, not permitted!')
            }

            const targetUser = await ProfileModel.findOne({ _id: userid })
            if(!targetUser){
                return new UserInputError('No user found', { general: 'No target of input userid' })
            }
            const clientUser = await ProfileModel.findOne({ _id: authorizRes.subj })

            if(!clientUser.undecidedCon.includes(targetUser._id)){
                return new UserInputError('This userid is NOT marked as undecided connection!')
            }
            try{
                clientUser.undecidedCon = clientUser.undecidedCon.filter(
                    item=> { return !item._id.equals(targetUser._id)}
                )
                await clientUser.save()

                targetUser.initiatedCon = targetUser.initiatedCon.filter(
                    item=>{ return !item._id.equals(clientUser._id) }
                )
                await targetUser.save()
            }catch(err){
                throw new ApolloError('Persistence error occured', err)
            }
            return{
                useridAtProcess: userid,
                resultText: 'Firendship request cancelled!'
            }
        },
        async removeThisFriend(_, args, { authorizRes }){
            await authorizEvaluation(authorizRes)

            const { error, issue, field, userid} = useridInputRevise(args.friendid)
            if(error){
                return new UserInputError('No proper userid for remove a friendship!', { field, issue })
            }
            if(userid === authorizRes.subj){
                return new UserInputError('This userid belogns to your account, not permitted!')
            }

            const targetUser = await ProfileModel.findOne({ _id: userid })
            if(!targetUser){
                return new UserInputError('No user found', { general: 'No target of input userid' })
            }
            const clientUser = await ProfileModel.findOne({ _id: authorizRes.subj })

            if(!clientUser.friends.includes(targetUser._id)){
                return new UserInputError('This userid is NOT marked as a friend!')
            }
            try{
                clientUser.friends = clientUser.friends.filter(
                    item=>{ return !item._id.equals(targetUser._id) }
                )
                await clientUser.save()

                targetUser.friends = targetUser.friends.filter(
                    item =>{ return !item._id.equals(clientUser._id) }
                )
                await targetUser.save()
            }catch(err){
                throw new ApolloError('Persistence error occured', err)
            }
            return{
                useridAtProcess: userid,
                resultText: 'Firendship removed!'
            }
        }
    }
}