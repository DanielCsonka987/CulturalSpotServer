const { gql } = require('apollo-server-express')

module.exports = gql`
    ## for friends managing, not account datas approach
    type UserPublic {
        id: String!
        email: String!
        username: String!
        registeredAt: String!
        relation: Connection!
        mutualFriendCount: Int

        friends: [UserFracture]!
    }
    type UserFracture {
        id: String!
        username: String!
        relation: Connection!
        mutualFriendCount: Int
    }
    type FriendProcess {
        resultText: String!
        useridAtProcess: String!
    }
    enum Connection {
        FRIEND
        INITIATED
        UNCERTAIN
        UNCONNECTED
        ME
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
        MAD
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
        tokenRefresh: String!
        registeredAt: String!
        lastLoggedAt: String!

        friends: [UserMini]!
        myposts: [Post]
    }
    type UserMini {
        id: String!,
        username: String!,
        email: String!
    }
    type AccountProcess {
        resultText: String!
        id: String!
        email: String!
        username: String!
    }



 
    type Query {
        testquery: String!

        ## friend processes
        listOfMyFriends: [UserMini]!
        listOfUndecidedFriendships: [UserFracture]!
        listOfInitiatedFriendships: [UserFracture]!
        showThisUserInDetail(friendid: String!): UserPublic 
            ## undecidedCon and friends of friends
        showMeWhoCouldBeMyFriend: [UserFracture]!

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
            ## for the initiation management by the source
        createAFriendshipInvitation(friendid: String!): UserFracture!
        removeAFriendshipInitiation(friendid: String): FriendProcess!
            ## for the initiation acceptance-denial by the target
        approveThisFriendshipRequest(friendid: String!): UserMini
        removeThisFriendshipRequest(friendid: String!): FriendProcess!
            ## for remove a stable friend-conenction
        removeThisFriend(friendid: String!): FriendProcess!


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
