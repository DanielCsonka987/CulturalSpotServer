const { gql } = require('apollo-server-express')

module.exports = gql`

    ## for account matters
    type UserLogging {
        id: String!
        email: String!
        username: String!
        token: String!
        tokenExpire: Int!
        refreshToken: String!
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


    ## used generally in comments, messages or sentiments
    enum TargetType {
        POST
        COMMENT
        MESSAGE
    }
    type OpinionProcess {
        resultText: String!
        targetType: TargetType!
        targetId: String!
        targetUpdate: String!
        id: String!
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
    type PostProcess {
        resultText: String!
        postid: String!
    }





    ## for sentiments
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




    ## for chattings
    type ChatRoom {
        chatid: String!
        partners: [UserMini]!
        owner: UserMini!
        title: String!
        startedAt: String!
        messages: [MessageUnit]!
    }
    type MessageUnit {
        chatid: String!
        sentAt: String!
        owner: UserMini!
        contnet: String!
        sentiments: [Opinion]!
    }
    type ChatRoomProcess {
        chatid: String!
        resultText: String!
        alterationType: ChatRoomProcess!
        alteredUsers: [String]!
        updatedTitle: String
    }
    type MessageProcess {
        chatid: String!
        messageid: String
        resultText: String!
    }
    enum ChatRoomProcess {
        ADD_PARTNERS
        REMOVE_PARTNERS
        UPDATE_ROOMTITLE
        DELETE_ROOM
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

        ## chatting, messaging processes
        listOfMessagesFromChatting(chatid: String!, dating: String!, amount: Int): ChatRoom!

    }
    type Mutation {

        ## account operations - tested!
        login(email: String!, password: String! ): UserLogging!
        registration(email: String!, username: String!, password: String!, passwordconf: String! ): UserLogging!
        resetPasswordStep1(email: String!): AccountProcess!
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
        discardThisFriendshipRequest(friendid: String!): FriendProcess!
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
            ## only for the authors
        updateCommentContent(commentid: String!, content: String!): Comment!
        deleteThisComment(targeted: TargetType!, id: String!, commentid: String!): OpinionProcess!


        ## chatting, messaging processes
            ## for all users
        createChatRoom(partners: [String]!, title: String!, firstContent: String!): ChatRoom!
            ## only for member users
        addPartnersToChatRoom(partners: [String]!, chatid): ChatRoomProcess!
        sendNewMessage(chatid: String!, content: String!): MessageUnit!
            ## privilage for a specific owner/starter user
        removePartnersFromChatRoom(partners: [String]!, chatid): ChatRoomProcess!
        updateChatRoom(chatid: String!, title: String!): ChatRoomProcess!
        deleteChatRoom(chatid: String!): ChatRoomProcess!
            ## only for the authors of the message
        updateThisMessage(chatid: String!, messageid: String!, content: String!): MessageUnit!
        deleteThisMessage(chatid: String!, messageid: String!): MessageProcess!


        ## sentiment processes
        createSentimentToHere(targeted: TargetType!, id: String!, content: Opinion!): Sentiment!
            ## only for the sentiment owner
        updateSentimentContent(targeted: TargetType!, id: String!, sentimentid: String!, content: Opinion!): Sentiment!
        deleteThisSentiment(targeted: TargetType!, id: String!, sentimentid: String!): OpinionProcess!


    }
`;
