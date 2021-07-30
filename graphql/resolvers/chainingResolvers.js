const ProfileModel = require('../../models/ProfileModel')

const { countTheAmountOfFriends, defineUserConnections } = require('./someHelper')

module.exports = {

    UserLogging: {
        friends: async (parent)=>{
            const friendsArray = await ProfileModel.find({_id: parent.friends })
            return friendsArray.map(frnd=>{
                return { 
                    id: frnd._id,
                    username: frnd.username,
                    email: frnd.email
                }
            })
            
        },
        myposts: (postsArray)=>{
            return postsArray.map(forPosts)
        },
    },
    UserPublic: {
        friends: async({friends}, __, {authorizRes})=>{
            const clientUser = await ProfileModel.findOne({ _id: authorizRes.subj })
            return friends.map(async item=>{
                const relat = defineUserConnections(item._id, clientUser)
                const mutualAmount = await countTheAmountOfFriends(item._id, clientUser)
                return{
                    id: item._id,
                    username: item.username,
                    relation: relat,
                    mutualFriendCount: mutualAmount
                }
            })
        }
    },
    Post: {
        comments: (commentsArray)=>{
            return commentsArray.map(forComments)
            
        },
        sentiments: (sentimentsArray)=>{
            return sentimentsArray.map(forSentiments)
        }
    },
    Comment: {
        comments: (commentsArray)=>{
            return commentsArray.map(forComments)
            
        },
        sentiments: (sentimentsArray)=>{
            return sentimentsArray.map(forSentiments)
        }
    }
}

function forPosts(postUnit){    //creates a Post
    return {
        postid: postUnit._id,
        owner: postUnit.owner,
        addressee: postUnit.addressee,
        content: postUnit.content,

        sentiments: postUnit.sentiments,
        comments: postUnit.comments
    }
}

function forComments(commentUnit){  //creates a Comment
    return {
        commentid: commentUnit._id,
        owner: commentUnit.owner,
        content: commentUnit.content,

        sentiments: commentUnit.sentiments
    }
}

function forSentiments(sentimentUnit){  //creates a Sentiment
    return{
        sentimentid: sentimentUnit._id,
        owner: sentimentUnit.owner,
        content: sentimentUnit.opinion
    }
}
