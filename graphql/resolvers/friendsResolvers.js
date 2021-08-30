const { ApolloError, UserInputError } = require('apollo-server-express')

const { authorizEvaluation, countTheAmountOfFriends, 
    defineUserConnections, getTheUsernameFromId } = require('./resolveHelpers')
const { useridInputRevise } = require('../../utils/inputRevise')

const { notifyTypes } = require('../../extensions/dinamicClientNotifier/userNotifierUnit')

module.exports = {

    Query: {
        async listOfMyFriends(_, __, { authorizRes, dataSources }){
            authorizEvaluation(authorizRes)

            const myAccount = await dataSources.profiles.get(authorizRes.subj)
            if(!myAccount){
                return new ApolloError('No user found', { general: 'No target of Token id' })
            }
            const usersFriendsAccounts = await dataSources.profiles.getAllOfThese(myAccount.friends)

            return  usersFriendsAccounts.map(frnd=>{
                return { 
                    id: frnd._id,
                    username: frnd.username,
                    email: frnd.email
                }
            })
        },
        async listOfUndecidedFriendships(_, __, { authorizRes, dataSources }){
            authorizEvaluation(authorizRes)

            const myAccount = await dataSources.profiles.get(authorizRes.subj)
            if(!myAccount){
                return new ApolloError('No user found', { general: 'No target of Token id' })
            }
            const usersUndecidedFriends = await dataSources.profiles.getAllOfThese(
                myAccount.myFriendRequests
            )
            return  usersUndecidedFriends.map(async frnd=>{
                return { 
                    id: frnd._id,
                    username: frnd.username,
                    relation: 'UNCERTAIN',
                    mutualFriendCount: await countTheAmountOfFriends(
                        frnd._id, myAccount, dataSources
                    )
                }
            })
        },
        async listOfInitiatedFriendships(_, __, { authorizRes, dataSources }){
            authorizEvaluation(authorizRes)

            const myAccount = await dataSources.profiles.get(authorizRes.subj)
            if(!myAccount){
                return new ApolloError('No user found', { general: 'No target of Token id' })
            }

            const usersInitiatedFriendships = await dataSources.profiles.getAllOfThese(
                myAccount.myInvitations 
            )
            return  usersInitiatedFriendships.map(async frnd=>{
                return { 
                    id: frnd._id,
                    username: frnd.username,
                    relation: 'INITIATED',
                    mutualFriendCount: await countTheAmountOfFriends(
                        frnd._id, myAccount, dataSources
                    )
                }
            })
        },
        async showThisUserInDetail(_, args, { authorizRes, dataSources }){
            authorizEvaluation( authorizRes )
            const { error, issue, field, userid} = useridInputRevise(args.friendid)
            if(error){
                return new UserInputError('No proper userid for show a user catalog!', { field, issue })
            }
            const accountAtQuery = await dataSources.profiles.get(userid)
            if(!accountAtQuery){
                return new UserInputError('No user found', { general: 'No target of input userid' })
            }
            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            return {
                id: userid,
                email: accountAtQuery.email,
                username: accountAtQuery.username,
                registeredAt: accountAtQuery.registeredAt,
                relation: defineUserConnections(
                    accountAtQuery._id, clientUser, dataSources
                ),
                mutualFriendCount: await countTheAmountOfFriends(
                    accountAtQuery._id, clientUser, dataSources
                ),
                friends: accountAtQuery.friends 
            } 
        },
        async showMeWhoCouldBeMyFriend(_, __, { authorizRes, dataSources }){
            authorizEvaluation( authorizRes )
            const clientUser = await dataSources.profiles.get(authorizRes.subj)

            const possibleFriendOutput = []
            for( const undecCon of clientUser.myFriendRequests){
                possibleFriendOutput.push({ 
                    id: undecCon._id,
                    username: await getTheUsernameFromId(
                        undecCon._id, dataSources
                    ),
                    relation: 'UNCERTAIN',
                    mutualFriendCount: await countTheAmountOfFriends(
                        undecCon, clientUser, dataSources
                    )
                })
            }
            for(const frnd of clientUser.friends ){

                const frndAcc = await dataSources.profiles.get(frnd._id)
                const allInterestingFriendidOfThiFriend = frndAcc.friends.filter(
                    item=>{ return !item.equals(clientUser._id) }
                )
                for(const frndOfFrnd_id of allInterestingFriendidOfThiFriend){
                    possibleFriendOutput.push({
                        id: frndOfFrnd_id.toString(),
                        username: await getTheUsernameFromId(
                            frndOfFrnd_id, dataSources
                        ),
                        relation: defineUserConnections(frndOfFrnd_id, clientUser),
                        mutualFriendCount: await countTheAmountOfFriends(
                            frndOfFrnd_id, clientUser, dataSources
                        )
                    })
                }

            }
            return possibleFriendOutput
        }
    },
    Mutation: {
        async createAFriendshipInvitation(_, args, { authorizRes, dataSources, wsNotifier }){
            authorizEvaluation(authorizRes)

            const { error, issue, field, userid} = useridInputRevise(args.friendid)
            if(error){
                return new UserInputError('No proper userid for initiate friendship!', { field, issue })
            }
            if(userid === authorizRes.subj){
                return new UserInputError('This userid belogns to your account, not permitted!')
            }

            const targetUser = await dataSources.profiles.get(userid)
            if(!targetUser){
                return new UserInputError('No user found', { general: 'No target of input userid' })
            }
            const clientUser = await dataSources.profiles.get(authorizRes.subj)

            if(clientUser.myInvitations.includes(targetUser._id)){
                return new UserInputError('This userid is marked as initiated connection!')
            }
            try{
                clientUser.myInvitations.push(targetUser._id)
                await dataSources.profiles.saving(clientUser)
                targetUser.myFriendRequests.push(clientUser._id)
                await dataSources.profiles.saving(targetUser)
            }catch(err){
                throw new ApolloError('Persistence error occured', err)
            }

            const mutalFriends = await countTheAmountOfFriends(
                targetUser._id, clientUser, dataSources
            )
            wsNotifier.sendNotification(targetUser._id.toString(), '', {
                    id: clientUser._id.toString(),
                    username: clientUser.username,
                    relation: 'UNCERTAIN',
                    mutualFriendCount: mutalFriends
                },  notifyTypes.FRIEND.INVITATION_CREATED
            )

            return {
                id: targetUser._id.toString(),
                username: targetUser.username,
                relation: 'INITIATED',
                mutualFriendCount: mutalFriends
            }
        },
        async removeAFriendshipInitiation(_, args, { authorizRes, dataSources, wsNotifier }){
            authorizEvaluation(authorizRes)

            const { error, issue, field, userid} = useridInputRevise(args.friendid)
            if(error){
                return new UserInputError('No proper userid for remove a friendship invitation!', { field, issue })
            }
            if(userid === authorizRes.subj){
                return new UserInputError('This userid belogns to your account, not permitted!')
            }

            const targetUser = await dataSources.profiles.get(userid)
            if(!targetUser){
                return new UserInputError('No user found', { general: 'No target of input userid' })
            }
            const clientUser = await dataSources.profiles.get(authorizRes.subj)

            if(!clientUser.myInvitations.includes(targetUser._id)){
                return new UserInputError('This userid is NOT marked as initiated connection!')
            }
            try{
                clientUser.myInvitations = clientUser.myInvitations.filter(
                    item=>{ return !item.equals(targetUser._id) }
                )
                await dataSources.profiles.saving(clientUser)
                targetUser.myFriendRequests = targetUser.myFriendRequests.filter(
                    item=>{ return !item.equals(clientUser._id) }
                )
                await dataSources.profiles.saving(targetUser)
            }catch(err){
                throw new ApolloError('Persistence error occured', err)
            }

            wsNotifier.sendNotification(targetUser._id.toString(), 
                clientUser._id.toString(), '',
                notifyTypes.FRIEND.INVITATION_CANCELLED
            )

            return {
                useridAtProcess: targetUser._id.toString(),
                resultText: 'Friendship initiation cancelled!'
            }
        },
        async approveThisFriendshipRequest(_, args, { authorizRes, dataSources, wsNotifier }){
            authorizEvaluation(authorizRes)

            const { error, issue, field, userid} = useridInputRevise(args.friendid)
            if(error){
                return new UserInputError('No proper userid for accept a friendship invitation!', { field, issue })
            }
            if(userid === authorizRes.subj){
                return new UserInputError('This userid belogns to your account, not permitted!')
            }

            const targetUser = await dataSources.profiles.get(userid)
            if(!targetUser){
                return new UserInputError('No user found', { general: 'No target of input userid' })
            }

            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            if(clientUser.friends.includes(targetUser._id)){
                return new UserInputError('This userid is already marked as your friend!')
            }
            if(!clientUser.myFriendRequests.includes(targetUser._id)){
                return new UserInputError('This userid is NOT marked as undecided connection!')
            }
            try{
                clientUser.myFriendRequests = clientUser.myFriendRequests.filter(
                    item=>{ return !item.equals(targetUser._id) }
                )
                clientUser.friends.push(targetUser._id)
                await dataSources.profiles.saving(clientUser)

                targetUser.myInvitations = targetUser.myInvitations.filter(
                    item=>{ return !item.equals(clientUser._id) }
                )
                targetUser.friends.push(clientUser._id)
                await dataSources.profiles.saving(targetUser)
            }catch(err){
                throw new ApolloError('Persistence error occured', err)
            }

            wsNotifier.sendNotification(targetUser._id.toString(), '', {
                    id: clientUser._id.toString(),
                    username: clientUser.username,
                    email: clientUser.email
                }, notifyTypes.FRIEND.REQUEST_APPROVED
            )

            return{
                id: targetUser._id.toString(),
                username: targetUser.username,
                email: targetUser.email
            }

        },
        async discardThisFriendshipRequest(_, args, { authorizRes, dataSources, wsNotifier }){
            authorizEvaluation(authorizRes)
            const { error, issue, field, userid} = useridInputRevise(args.friendid)
            if(error){
                return new UserInputError('No proper userid for refuse a friendship invitation!', { field, issue })
            }
            if(userid === authorizRes.subj){
                return new UserInputError('This userid belogns to your account, not permitted!')
            }

            const targetUser = await dataSources.profiles.get(userid)
            if(!targetUser){
                return new UserInputError('No user found', { general: 'No target of input userid' })
            }
            const clientUser = await dataSources.profiles.get(authorizRes.subj)

            if(!clientUser.myFriendRequests.includes(targetUser._id)){
                return new UserInputError('This userid is NOT marked as undecided connection!')
            }
            try{
                clientUser.myFriendRequests = clientUser.myFriendRequests.filter(
                    item=> { return !item._id.equals(targetUser._id)}
                )
                await dataSources.profiles.saving(clientUser)

                targetUser.myInvitations = targetUser.myInvitations.filter(
                    item=>{ return !item._id.equals(clientUser._id) }
                )
                await dataSources.profiles.saving(targetUser)
            }catch(err){
                throw new ApolloError('Persistence error occured', err)
            }

            wsNotifier.sendNotification(targetUser._id.toString(), 
                clientUser._id.toString(), '', notifyTypes.FRIEND.REQUEST_DISCARDED
            )
            return{
                useridAtProcess: targetUser._id.toString(),
                resultText: 'Friendship request discarded!'
            }
        },
        async removeThisFriend(_, args, { authorizRes, dataSources, wsNotifier }){
            authorizEvaluation(authorizRes)

            const { error, issue, field, userid} = useridInputRevise(args.friendid)
            if(error){
                return new UserInputError('No proper userid for remove a friendship!', { field, issue })
            }
            if(userid === authorizRes.subj){
                return new UserInputError('This userid belogns to your account, not permitted!')
            }

            const targetUser = await dataSources.profiles.get(userid)
            if(!targetUser){
                return new UserInputError('No user found', { general: 'No target of input userid' })
            }
            const clientUser = await dataSources.profiles.get(authorizRes.subj)

            if(!clientUser.friends.includes(targetUser._id)){
                return new UserInputError('This userid is NOT marked as a friend!')
            }
            try{
                clientUser.friends = clientUser.friends.filter(
                    item=>{ return !item._id.equals(targetUser._id) }
                )
                await dataSources.profiles.saving(clientUser)

                targetUser.friends = targetUser.friends.filter(
                    item =>{ return !item._id.equals(clientUser._id) }
                )
                await dataSources.profiles.saving(targetUser)
            }catch(err){
                throw new ApolloError('Persistence error occured', err)
            }
            
            wsNotifier.sendNotification(targetUser._id.toString(), 
                clientUser._id.toString(), '', notifyTypes.FRIEND.CONNECTION_DISCARDED
            )
            return{
                useridAtProcess: targetUser._id.toString(),
                resultText: 'Friendship removed!'
            }
        }
    }
}