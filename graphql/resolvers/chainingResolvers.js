

module.exports = {

    UserLogging: {
        friends: (friendsArray)=>{
            return friendsArray.map(forFriends)
        },
        posts: (postsArray)=>{
            return postsArray.map(forPosts)
        },
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

function forFriends(friendUnit){    //creates UserFracture
    return {
        id: friendUnit._id,
        username: friendUnit.username
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
