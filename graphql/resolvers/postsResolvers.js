const { AuthenticationError, UserInputError, ApolloError  } = require('apollo-server-express')
const MongooseID = require('mongoose').Types.ObjectId

const { authorizEvaluation, filterPostsByDateAndAmount_Posts,
    filterPostsByDateAndAmount_Stamps
     } = require('./resolveHelpers')
const { postInputRevise, postUpdateInputRevise, 
    postDeleteInputRevise, postOrCommentFilteringInputRevise 
    } = require('../../utils/inputRevise')
const { notifyTypes } = require('../../extensions/dinamicClientNotifier/userNotifierUnit')


module.exports = {
    Query: {
        async listOfMySentPosts(_, args, { authorizRes, dataSources }){
            authorizEvaluation(authorizRes)
            const {error, issue, field, date, amount} = 
                postOrCommentFilteringInputRevise(args.dating, args.amount)
            if(error){
                return new UserInputError('No proper filtering inputs passed!', { field, issue })
            }

            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            if(!clientUser){
                return AuthenticationError('No user found', { general: 'No target of Token id' })
            }
            const postIDs = clientUser.myPosts.map(stamp=>stamp.postid)
            const clientPosts = await dataSources.posts.getAllOfThese(postIDs)
            if(clientPosts.length === 0){
                return []
            }
            const finalPosts = filterPostsByDateAndAmount_Posts(clientPosts, date, amount)
            return finalPosts.map(postUnit=>{
                return postUnit.getPostFullDatas
                /*
                return {
                    postid: postUnit._id,
                    owner: postUnit.owner,
                    dedicatedTo: postUnit.dedicatedTo,
                    content: postUnit.content,
                    createdAt: postUnit.createdAt,
                    updatedAt: postUnit.updatedAt? postUnit.updatedAt : '',

                    sentiments: postUnit.sentiments,
                    comments: postUnit.comments.length
                }*/
            })
        },
        async listOfMyRecievedPosts(_, args, { authorizRes, dataSources }){
            authorizEvaluation(authorizRes)
            const {error, issue, field, date, amount} = 
                postOrCommentFilteringInputRevise(args.dating, args.amount)
            if(error){
                return new UserInputError('No proper filtering inputs passed!', { field, issue })
            }

            //no caching with this!!
            const dedicToClient = await dataSources.posts.getByDedication(authorizRes.subj)
            if(dedicToClient.length === 0){
                return []
            }
            const finalPosts = filterPostsByDateAndAmount_Posts(dedicToClient)
            return finalPosts.map(postUnit=>{
                return postUnit.getPostFullDatas
                /*
                return {
                    postid: postUnit._id,
                    owner: postUnit.owner,
                    dedicatedTo: postUnit.dedicatedTo,
                    content: postUnit.content,
                    createdAt: postUnit.createdAt,
                    updatedAt: postUnit.updatedAt? postUnit.updatedAt : '',

                    sentiments: postUnit.sentiments,
                    comments: postUnit.comments.length
                }*/
            })
        },
        async listOfAllPosts(_, args, { authorizRes, dataSources }){
            authorizEvaluation(authorizRes)
            const {error, issue, field, date, amount} = 
                postOrCommentFilteringInputRevise(args.dating, args.amount)
            if(error){
                return new UserInputError('No proper filtering inputs passed!', { field, issue })
            }

            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            if(!clientUser){
                return AuthenticationError('No user found', { general: 'No target of Token id' })
            }
            const friendsArray = await dataSources.profiles.getAllOfThese(clientUser.friends)
            const groupsOfPostStamps = friendsArray.map(frnd=>{ return frnd.myPosts })
            const allPostID = filterPostsByDateAndAmount_Stamps(clientUser.myPosts, groupsOfPostStamps, 
                date, amount)
                
            if(allPostID.length === 0){
                return []
            }

            const allPosts = await dataSources.posts.getAllOfThese(allPostID)
            return allPosts.map(postUnit=>{     // mongoose virtuals may give bug, but mongoose method for sure!!
                return {
                    postid: postUnit._id,
                    owner: postUnit.owner,
                    dedicatedTo: postUnit.dedicatedTo,
                    content: postUnit.content,
                    createdAt: postUnit.createdAt.toISOString(),
                    updatedAt: postUnit.updatedAt? postUnit.updatedAt.toISOString() : '',

                    sentiments: postUnit.sentiments,
                    comments: postUnit.comments.length
                }
            })
        },
    },
    Mutation: {
        async makeAPost(_, args, { authorizRes, dataSources, wsNotifier }){
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
                if(!clientUser.haveThisFriend(dedicatedID)){
                    return new UserInputError('The required addressee user is not your friend', 
                        { general: 'User friendlist revise' })
                }
            }
                
            let thePost = '';
            const postDating = new Date()
            try{
                thePost = await dataSources.posts.create({
                    owner: clientUser._id,
                    dedicatedTo: targetUser? targetUser._id: null,
                    content: postContent,
                    createdAt: postDating,
                    updatedAt: null,
                    comments: [],
                    sentiments: []
                })
                clientUser.myPosts.push({ postid: thePost._id, createdAt: postDating })
                await dataSources.profiles.saving(clientUser)
            }catch(err){
                return new ApolloError('Post persisting is not completed!', { error: err.message } )
            }

            for(const frnd of clientUser.friends){
                wsNotifier.sendNotification(frnd.toString(), '', thePost.getPostFullDatas
                /*{
                    postid: thePost._id,
                    owner: thePost.owner,
                    dedicatedTo: thePost.dedicatedTo,
                    content: thePost.content,
                    createdAt: thePost.createdAt,
                    updatedAt: '',
                    comments: 0,
                    sentiments: []
                }*/, notifyTypes.POST.NEW_POST)
            }
            return thePost.getPostFullDatas
            /*
            return {
                postid: thePost._id,
                owner: thePost.owner,
                dedicatedTo: thePost.dedicatedTo,
                content: thePost.content,
                createdAt: thePost.createdAt,
                updatedAt: '',
                comments: 0,
                sentiments: []
            }*/
        },
        async updateThisPost(_, args, { authorizRes, dataSources, wsNotifier }){
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
            if(!clientUser.haveThisPost(seekedPost)){
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
                if(!clientUser.haveThisFriend(targetUser._id)){
                    return new UserInputError('The required addressee user is not your friend', 
                        { general: 'User friendlist revise' })
                }
                postToUpdate.dedicatedTo = targetUser._id
            }
            postToUpdate.content = newContent
            postToUpdate.updatedAt = new Date()
            try{
                await dataSources.posts.saving(postToUpdate)
            }catch(err){
                return new ApolloError('Post update is not completed!', { error: err.message } )
            }

            for(const frnd of clientUser.friends){

                wsNotifier.sendNotification(frnd.toString(), '', postToUpdate.getPostUpdateDatas
                /*{
                    postid: postToUpdate._id,
                    owner: postToUpdate.owner,
                    dedicatedTo: postToUpdate.dedicatedTo,
                    content: postToUpdate.content,
                    updatedAt: postToUpdate.updatedAt
                }*/, notifyTypes.POST.CONTENT_CHANGED)
            }
            return postToUpdate.getPostFullDatas
            /*
            return {
                postid: postToUpdate._id,
                owner: postToUpdate.owner,
                dedicatedTo: postToUpdate.dedicatedTo,
                content: postToUpdate.content,
                createdAt: postToUpdate.createdAt,
                updatedAt: postToUpdate.updatedAt,
                
                comments: postToUpdate.comments.length,
                sentiments: postToUpdate.sentiments
            }*/
        },
        async removeThisPost(_, args, { authorizRes, dataSources, wsNotifier }){
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
            if(!clientUser.haveThisPost(seekedPost)){
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
                clientUser.removeThisPost(postToRemove._id)
                await dataSources.profiles.saving(clientUser)
                await dataSources.comments.recursiveRemovalOfThese(commentsToRemove)
                await dataSources.posts.deleting(postToRemove._id)
            }catch(err){
                return new ApolloError('Post removal is not completed!', { error: err.message } )
            }

            for(const frnd of clientUser.friends){

                wsNotifier.sendNotification(frnd.toString(), 
                    { postid: postToRemove._id.toString() }, '', 
                    notifyTypes.POST.POST_REMOVED)
            }

            return {
                resultText: 'Your post has been removed!',
                postid: postID
            }
        }
    }
}