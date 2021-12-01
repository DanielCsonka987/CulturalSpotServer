
const { countTheAmountOfFriends, defineUserConnections, filterPostsByDateAndAmount_Stamps } = require('./resolveHelpers')

module.exports = {
    UserLoggingContent: {
        friends: async (parent, _, { dataSources })=>{     //UserMini type return
            /*
            const friendsArray = await dataSources.profiles.getAllOfThese(parent.friends)
            return friendsArray.map(userMiniTypeDefine)*/
            return parent.friends.length
        },
        allPosts: async (parent, _, { dataSources })=>{    //Post type return
            const friendsArray = await dataSources.profiles.getAllOfThese(parent.friends)
            const groupsOfPostIDs = friendsArray.map(item=>{ return item.myPosts })

            const allPostsIDs = filterPostsByDateAndAmount_Stamps(parent.posts, groupsOfPostIDs)
            const finalPosts = await dataSources.posts.getAllOfThese(allPostsIDs)
            return finalPosts.map(postTypeDefine)
        },
        allChats: async (parent, _, { dataSources })=>{
            const clientChattings = await dataSources.chats.getAllOfThese(parent.chats)
            return clientChattings.map(chatMiniTypeDefine)
        }
    },
    UserPrivateContent: {
        friends: async (parent, _, { dataSources })=>{     //UserMini type return
            /*
            const friendsArray = await dataSources.profiles.getAllOfThese(parent.friends)
            return friendsArray.map(userMiniTypeDefine)*/
            return parent.friends.length
        },
        allPosts: async (parent, _, { dataSources })=>{    //Post type return
            const friendsArray = await dataSources.profiles.getAllOfThese(parent.friends)
            const groupsOfPostIDs = friendsArray.map(item=>{ return item.myPosts })
            
            const allPostsIDs = filterPostsByDateAndAmount_Stamps(parent.posts, groupsOfPostIDs)
            const finalPosts = await dataSources.posts.getAllOfThese(allPostsIDs)
            return finalPosts.map(postTypeDefine)
        },
        allChats: async (parent, _, { dataSources })=>{
            const clientChattings = await dataSources.chats.getAllOfThese(parent.chats)
            return clientChattings.map(chatMiniTypeDefine)
        }
    },
    UserPublicContent: {
        friends: async (parent, _, { authorizRes, dataSources })=>{     //UserFracture type return
            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            //may needs friends empty handling
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
    },
    ChatRoom:{
        owner: async (parent, _, { authorizRes, dataSources })=>{     //UserFracture type return
            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            const theOwner = await dataSources.profiles.get(parent.owner)
            return await userFractureTypeDefine(theOwner, clientUser, dataSources)
        },
        partners: async (parent, _, { authorizRes, dataSources })=>{     //[UserFracture] type return
            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            const thePartners = await dataSources.profiles.getAllOfThese(parent.partners)
            return thePartners.map(async item => await userFractureTypeDefine(item, clientUser, dataSources )) 
        },
        messages: async (parent, _, { dataSources })=>{
            let theMessages = []
            if(parent.messages.length){     //at chatroom creation
                theMessages = parent.messages
            }else{                
                theMessages = await dataSources.messages.getChattingWithPreciseDate(
                    parent.chatid, parent.messages.dating, parent.messages.amount)
            }
            return theMessages.map(messageUnitTypeDefine)            
        }
    },
    ChatRoomMini:{
        owner: async (parent, _, { authorizRes, dataSources })=>{     //UserFracture type return
            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            const theOwner = await dataSources.profiles.get(parent.owner)
            return await userFractureTypeDefine(theOwner, clientUser, dataSources)
        },
    },
    ChatRoomProcess: {
        addedUsers: async (parent, _, { authorizRes, dataSources })=>{
            if(!parent.addedUsers){
                return []
            }
            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            const thePartners = await dataSources.profiles.getAllOfThese(parent.addedUsers)
            return thePartners.map(async item => await userFractureTypeDefine(item, clientUser, dataSources))
        }
    },
    MessageUnit:{
        owner: async (parent, _, { authorizRes, dataSources })=>{     //UserFracture type return
            const clientUser = await dataSources.profiles.get(authorizRes.subj)
            const theOwner = await dataSources.profiles.get(parent.owner)
            return userFractureTypeDefine(theOwner, clientUser, dataSources)
        },
        sentiments: async (parent, _, { authorizRes, dataSources })=>{
            return parent.sentiments.map(sentimentTypeDefine)
        }
    }
}

function userMiniTypeDefine(frnd){
    return { 
        userid: frnd._id,
        username: frnd.username,
        email: frnd.email
    }
}
function postTypeDefine(postUnit){
    return {
        postid: postUnit._id,
        owner: postUnit.owner,
        createdAt: postUnit.createdAt,
        updatedAt: postUnit.updatedAt? postUnit.updatedAt.toISOString(): '',
        addressee: postUnit.addressee,
        content: postUnit.content,

        comments: postUnit.comments.length,        //array of commmentid-s
        sentiments: postUnit.sentiments     //Sentiment type array
    }
    
}
async function userFractureTypeDefine(actClient, clientUser, dataSources){
    return {
        userid: actClient._id,
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
function messageUnitTypeDefine(msgUnit){
    return {
        messageid: msgUnit._id.toString(),
        sentAt:  msgUnit.sentAt? msgUnit.sentAt.toISOString() : '',
        owner: msgUnit.owner,
        content: msgUnit.content,
        sentiments: msgUnit.sentiments
    }
}
function chatMiniTypeDefine(chatUnit){
    return{
        chatid: chatUnit._id,
        owner: chatUnit.owner,
        title: chatUnit.title,
        startedAt: chatUnit.startedAt.toISOString()
    }
}