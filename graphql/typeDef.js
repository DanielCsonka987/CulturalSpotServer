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
        dedicatedTo: UserFracture
        createdAt: String!
        updatedAt: String!
        content: String!
        sentiments: [Sentiment]!
        comments: Int! 
    }
    type Comment {
        commentid: String!
        owner: UserFracture!
        createdAt: String!
        updatedAt: String!
        content: String!
        sentiments: [Sentiment]!
        comments: Int! 
    }
    type Sentiment {
        sentimentid: String!
        createdAt: String!
        updatedAt: String!
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
    enum TargetType {
        POST
        COMMENT
    }
    type PostProcess {
        resultText: String!
        postid: String!
    }
    type OpinionProcess {
        resultText: String!
        targetType: TargetType!
        targetId: String!
        targetUpdate: String!
        id: String!
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
        allPosts: [Post]!
    }
    type TokenAuth {
        id: String!
        newToken: String!
        tokenExpire: Int!
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

        ## account processes
        refreshAuth: TokenAuth!

        ## friend processes
        listOfMyFriends: [UserMini]!
        listOfUndecidedFriendships: [UserFracture]!
        listOfInitiatedFriendships: [UserFracture]!
        showThisUserInDetail(friendid: String!): UserPublic 
            ## undecidedCon and friends of friends
        showMeWhoCouldBeMyFriend: [UserFracture]!

        ## posts processes
        listOfMySentPosts: [Post]      ## own posts to a specific user
        listOfMyRecievedPosts: [Post]  ## specificly addressed to the user
        listOfAllPosts: [Post]         ## own and firends posts

        ## comments, sentiments processes
        listOfTheseComments(targeted: TargetType!, id: String!): [Comment]!
    }
    type Mutation {

        ## account operations - tested!
        login(email: String!, password: String! ): UserLogging!
        registration(email: String!, username: String!, password: String!, passwordconf: String! ): UserLogging!
        resetPassword(email: String!): AccountProcess!
        changePassword(oldpassword: String!, newpassword: String!, newconf: String!): AccountProcess!
        changeAccountDatas(username: String! ): AccountProcess!
        deleteAccount(password: String!, passwordconf: String!): AccountProcess!
        logout: AccountProcess!

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
            ## all originated
        makeAPost(content: String!, dedication: String): Post! 
            ## only if it is the user's post
        updateThisPost(postid: String!, newcontent: String, newdedication: String): Post!
        removeThisPost(postid: String!): PostProcess!

        ## comments, sentiments processes
            ## for everibody
        createCommentToHere(targeted: TargetType!, id: String!, content: String): Comment!
        createSentimentToHere(targeted: TargetType!, id: String!, content: Opinion): Sentiment!
            ## only for the authors
        updateCommentContent(commentid: String!, content: String!): Comment!
        deleteThisComment(targeted: TargetType!, id: String!, commentid: String!): OpinionProcess!
        updateSentimentContent(targeted: TargetType!, id: String!, sentimentid: String!, content: String!): Sentiment!
        deleteThisSentiment(targeted: TargetType!, id: String!, sentimentid: String!): OpinionProcess!
    }
`;
