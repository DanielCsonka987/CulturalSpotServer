const { AuthenticationError, UserInputError, ApolloError  } = require('apollo-server-express')
const MongooseID = require('mongoose').Types.ObjectId

const { authorizEvaluation } = require('./resolveHelpers')
const { postInputRevise, postUpdateInputRevise, postDeleteInputRevise } = require('../../utils/inputRevise')

module.exports = {
    Query: {
        async listOfMySentPosts(_, __, { authorizRes, dataSources }){
            authorizEvaluation(authorizRes)
            
            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            if(!clientUser){
                return AuthenticationError('No user found', { general: 'No target of Token id' })
            }
            const clientPosts = await dataSources.posts.getAllOfThese(clientUser.myPosts)
            if(clientPosts.length === 0){
                return []
            }
            return clientPosts.map(postUnit=>{
                return {
                    postid: postUnit._id,
                    owner: postUnit.owner,
                    dedicatedTo: postUnit.dedicatedTo,
                    content: postUnit.content,
                    createdAt: postUnit.createdAt,
                    updatedAt: postUnit.updatedAt,

                    sentiments: postUnit.sentiments,
                    comments: postUnit.comments.length
                }
            })
        },
        async listOfMyRecievedPosts(_, __, { authorizRes, dataSources }){
            authorizEvaluation(authorizRes)
            
            //no caching with this!!
            const dedicToClient = await dataSources.posts.getByDedication(authorizRes.subj)
            if(dedicToClient.length === 0){
                return []
            }
            return dedicToClient.map(postUnit=>{
                return {
                    postid: postUnit._id,
                    owner: postUnit.owner,
                    dedicatedTo: postUnit.dedicatedTo,
                    content: postUnit.content,
                    createdAt: postUnit.createdAt,
                    updatedAt: postUnit.updatedAt,

                    sentiments: postUnit.sentiments,
                    comments: postUnit.comments.length
                }
            })
        },
        async listOfAllPosts(_, __, { authorizRes, dataSources }){
            authorizEvaluation(authorizRes)

            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            if(!clientUser){
                return AuthenticationError('No user found', { general: 'No target of Token id' })
            }
            const clientPosts = await dataSources.posts.getAllOfThese(clientUser.myPosts)

            const friendsArray = await dataSources.profiles.getAllOfThese(clientUser.friends)
            const groupsOfPostsIDs = friendsArray.map(frnd=>{ return frnd.myPosts })
            const friendsPosts = await dataSources.posts.getAllPostsFromGroups(groupsOfPostsIDs)
            const finalPosts = [ ...clientPosts, ...friendsPosts ]

            if(finalPosts.length === 0){
                return []
            }
            return finalPosts.map(postUnit=>{
                return {
                    postid: postUnit._id,
                    owner: postUnit.owner,
                    dedicatedTo: postUnit.dedicatedTo,
                    content: postUnit.content,
                    createdAt: postUnit.createdAt,
                    updatedAt: postUnit.updatedAt,

                    sentiments: postUnit.sentiments,
                    comments: postUnit.comments.length
                }
            })
        },
    },
    Mutation: {
        async makeAPost(_, args, { authorizRes, dataSources }){
            authorizEvaluation(authorizRes)

            const {error, field, issue, dedicatedID, postContent} = postInputRevise(
                args.dedication, args.content
            )
            if(error){
                return new UserInputError('No proper post inputs!', { field, issue })
            }
            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            if(!clientUser){
                return new ApolloError('No user found', { general: 'No target of Token id' })
            }
            let targetUser = null;
            if(dedicatedID){
                targetUser = await dataSources.profiles.get(dedicatedID)
                if(!targetUser){
                    return new UserInputError('No required addressee user found', 
                        { general: 'Targeted addressee revise' })
                }
                if(!clientUser.friends.includes(dedicatedID)){
                    return new UserInputError('The required addressee user is not your friend', 
                        { general: 'User friendlist revise' })
                }
            }
                
            let thePost = '';
            try{
                thePost = await dataSources.posts.create({
                    owner: clientUser._id,
                    dedicatedTo: targetUser? targetUser._id: null,
                    content: postContent,
                    createdAt: new Date().toISOString(),
                    updatedAt: '',
                    comments: [],
                    sentiments: []
                })
                clientUser.myPosts.push(thePost._id)
                await dataSources.profiles.saving(clientUser)
            }catch(err){
                return new ApolloError('Post persisting is not completed!', { err })
            }
            return {
                postid: thePost._id,
                owner: thePost.owner,
                dedicatedTo: thePost.dedicatedTo,
                content: thePost.content,
                createdAt: thePost.createdAt,
                updatedAt: '',
                comments: 0,
                sentiments: []
            }
        },
        async updateThisPost(_, args, { authorizRes, dataSources }){
            authorizEvaluation(authorizRes)

            const { error, field, issue, postID, newContent, dedicatedID} =
                postUpdateInputRevise(args.postid, args.newcontent, args.newdedication)
            if(error){
                return new UserInputError('No proper post inputs!', { field, issue })
            }
            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            if(!clientUser){
                return new ApolloError('No user found', { general: 'No target of Token id' })
            }
            const seekedPost = new MongooseID(postID)
            if(!clientUser.myPosts.includes(seekedPost)){
                return new UserInputError('No proper post inputs!', 
                    { general: 'Posts of the user not contains that postid' }
                )
            }

            const postToUpdate = await dataSources.posts.get(postID)
            if(!postToUpdate){
                return new ApolloError('No post found', { general: 'No target of postid to update' })
            }
            if(dedicatedID){
                const targetUser = await dataSources.profiles.get(dedicatedID)
                if(!targetUser){
                    return new UserInputError('No required addressee user found', 
                        { general: 'Targeted addressee revise' })
                }
                if(!clientUser.friends.includes(dedicatedID)){
                    return new UserInputError('The required addressee user is not your friend', 
                        { general: 'User friendlist revise' })
                }
                postToUpdate.dedicatedTo = targetUser._id
            }
            postToUpdate.content = newContent
            postToUpdate.updatedAt = new Date().toISOString()
            try{
                await dataSources.posts.saving(postToUpdate)
            }catch(err){
                return new ApolloError('Post update is not completed!', { err })
            }

            return {
                postid: postToUpdate._id,
                owner: postToUpdate.owner,
                dedicatedTo: postToUpdate.dedicatedTo,
                content: postToUpdate.content,
                createdAt: postToUpdate.createdAt,
                updatedAt: postToUpdate.updatedAt,
                
                comments: postToUpdate.comments.length,
                sentiments: postToUpdate.sentiments
            }
        },
        async removeThisPost(_, args, { authorizRes, dataSources }){
            authorizEvaluation(authorizRes)

            const { error, field, issue, postID} = postDeleteInputRevise(args.postid)
            if(error){
                return new UserInputError('No proper post inputs!', { field, issue })
            }

            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            if(!clientUser){
                return new ApolloError('No user found', { general: 'No target of Token id' })
            }
            const seekedPost = new MongooseID(postID)
            if(!clientUser.myPosts.includes(seekedPost)){
                return new UserInputError('No proper post inputs!', 
                    { general: 'Posts of the user not contains that postid' }
                )
            }

            const postToRemove = await dataSources.posts.get(postID)
            if(!postToRemove){
                return new ApolloError('No post found', { general: 'No target of postid to remove' })
            }
            const commentsToRemove = postToRemove.comments
            try{
                clientUser.myPosts = clientUser.myPosts.filter(
                    post=>{ post._id.toString() !== postID }
                )
                await dataSources.profiles.saving(clientUser)

                await dataSources.comments.recursiveRemovalOfThese(commentsToRemove)

                await dataSources.posts.deleting(postToRemove._id)
            }catch(err){
                return new ApolloError('Post removal is not completed!', { err })
            }

            return {
                resultText: 'Your post has been removed!',
                postid: postID
            }
        }
    }
}