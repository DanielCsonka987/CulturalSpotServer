const { gql } = require('apollo-server-express')

module.exports = gql`
    ## for friends managing
    type UserPublic {
        id: String!
        email: String!
        username: String!
        registeredAt: String!
        friends: [UserFracture]!
        posts: [Post]!
    }
    type UserFracture {
        id: String!
        username: String!
    }
    type FriendProcess {
        resultText: String!
        friendid: String!
    }


    ## for posts and comments
    type Post {
        postid: String!
        owner: UserFracture!
        addressee: UserFracture
        content: String!
        sentiments: [Sentiment]!
        comments: [Comment]!
    }
    type Comment {
        commentid: String!
        owner: UserFracture!
        content: String!
        comments: [Comment]!
        sentiments: [Sentiment]!
    }
    type Sentiment {
        sentimentid: String!
        owner: UserFracture!
        content: Opinion!
    }
    enum Opinion {
        LIKE
        DISLIKE
        LOVE
        FUNNY
        SAD
    }
    type PostProcess {
        resultText: String!
        postid: String!
        commentid: String!
    }
    type SentimentProcess {
        resultText: String!
        postid: String
        commentid: String
        sentiment: Opinion
    }



    ## for account matters
    type UserLogging {
        id: String!
        email: String!
        username: String!
        token: String!
        tokenExpire: Int!
        registeredAt: String!
        lastLoggedAt: String!

        friends: [UserFracture]!
        posts: [Post]
    }
    type AccountProcess {
        resultText: String!
        id: String!
        email: String!
        username: String!
    }



 
    type Query {
        testquery: String!

        ## firend processes
        listOfMyFriends: [UserPublic]!
        listOfFriendsOf(friendid: String!): [UserPublic]!

        ## posts processes
        listOfAllPosts: [Post]!         ## own and firends posts
        listOfRecievedPosts: [Post]!    ## specificly addressed to the user
        listOfSentPosts: [Post]!        ## sent by the user
    }
    type Mutation {

        ## account operations - tested!
        login(email: String!, password: String! ): UserLogging!
        registration(email: String!, username: String!, password: String!, passwordconf: String! ): UserLogging!
        resetPassword(email: String!): AccountProcess!
        changePassword(oldpassword: String!, newpassword: String!, newconf: String!): AccountProcess!
        changeAccountDatas(username: String! ): AccountProcess!
        deleteAccount(password: String!, passwordconf: String!): AccountProcess!

        ## firend processes
        makeAFriend(friendId: String!): UserPublic!
        removeAFriend(friendId: String): FriendProcess!

        ## posts processes
            ## only if it is the user's
        removeThisPost(postid: String!): PostProcess!
        updateThisPost(postid: String!, newcontent: String, newadressee: String): Post!
        updateThisComment(commentid: String! newcontent: String!): Comment!
        sentimentRemoval(postid: String!, commentid: String!): SentimentProcess!

            ## all originated
        makeAPost(content: String!, addressee: String): Post! 
        commentThisPost(postid: String!, content: String!): Comment!
        sentimentThisPost(postid: String!, sentiment: Opinion!): SentimentProcess!
        sentimentThisComment(commentid: String!, sentiment: Opinion!): SentimentProcess!
    }
`;
