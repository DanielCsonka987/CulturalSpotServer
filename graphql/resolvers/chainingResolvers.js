
const { countTheAmountOfFriends, defineUserConnections } = require('./resolveHelpers')

module.exports = {
    UserLogging: {
        friends: async (parent, _, { dataSources })=>{     //UserMini type return
            const friendsArray = await dataSources.profiles.getAllOfThese(parent.friends)
            return friendsArray.map(userMiniTypeDefine)
        },
        allPosts: async (parent, _, { dataSources })=>{    //Post type return
            //comments and sentiments are needed
            let clientPosts = []
            if(parent.posts){
                clientPosts = await dataSources.posts.getAllOfThese(parent.posts)
            }
            let friendsPosts = []
            if(parent.friends){
               const friendsArray = await dataSources.profiles.getAllOfThese(parent.friends)
   
               const groupsOfPostIDs = friendsArray.map(item=>{ return item.myPosts })
               const friendsPosts = await dataSources.posts.getAllPostsFromGroups(groupsOfPostIDs)
            }

            const finalPosts = [ ...clientPosts, ...friendsPosts ]
            return finalPosts.map(postTypeDefine)
        }
    },
    
    UserPublic: {
        friends: async (parent, _, { authorizRes, dataSources })=>{     //UserFracture type return
            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            const friendsArray = await dataSources.profiles.getAllOfThese(parent.friends)
            return await friendsArray.map(async frnd=>{
                return await userFractureTypeDefine(frnd, clientUser, dataSources) 
            })
        },
    },
    Post: {
        owner: async (parent, _, { authorizRes, dataSources })=>{     //UserFracture type return
            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            const ownerClient = await dataSources.profiles.get(parent.owner)
            return await userFractureTypeDefine(ownerClient, clientUser, dataSources) 
        },
        dedicatedTo: async (parent, _, { authorizRes, dataSources })=>{ //UserFracture type return
            if(!parent.dedicatedTo){
                return
            }
            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            const dedicatedClient = await dataSources.profiles.get(parent.dedicatedTo)
            if(!dedicatedClient){
                return
            }
            return await userFractureTypeDefine(dedicatedClient, clientUser, dataSources) 
        },
        sentiments: async (parent, _, { authorizRes, dataSources })=>{
            const sentimArray = parent.sentiments
            return sentimArray.map(sentimentTypeDefine)
        }
    },
    Comment: {
        owner: async (parent, _, { authorizRes, dataSources })=>{     //UserFracture type return
            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            const ownerClient = await dataSources.profiles.get(parent.owner)
            return await userFractureTypeDefine(ownerClient, clientUser, dataSources) 
        },
        sentiments: async (parent, _, { authorizRes, dataSources })=>{
            const sentimArray = parent.sentiments
            return sentimArray.map(sentimentTypeDefine)
        }
    },
    Sentiment: {
        owner: async (parent, _, { authorizRes, dataSources })=>{     //UserFracture type return
            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            const ownerClient = await dataSources.profiles.get(parent.owner)
            return await userFractureTypeDefine(ownerClient, clientUser, dataSources) 
        }
    }
}

function userMiniTypeDefine(frnd){
    return { 
        id: frnd._id,
        username: frnd.username,
        email: frnd.email
    }
}
function postTypeDefine(postUnit){
    return {
        postid: postUnit._id,
        owner: postUnit.owner,
        addressee: postUnit.addressee,
        content: postUnit.content,

        comments: postUnit.comments,        //array of commmentid-s
        sentiments: postUnit.sentiments     //Sentiment type array
    }
    
}
async function userFractureTypeDefine(actClient, clientUser, dataSources){
    return {
        id: actClient._id,
        username: actClient.username,
        relation: defineUserConnections(
            actClient._id, clientUser,
        ),
        mutualFriendCount: await countTheAmountOfFriends(
            actClient._id, clientUser, dataSources
        )
    }
}
function sentimentTypeDefine(sentimentUnit){
    return {
        sentimentid: sentimentUnit._id,
        owner: sentimentUnit.owner,
        content: sentimentUnit.content,
        createdAt: sentimentUnit.createdAt,
        updatedAt: sentimentUnit.updatedAt
    }
}