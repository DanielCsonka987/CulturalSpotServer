const { gql } = require('apollo-server-express')

module.exports = gql`

    ## for account matters
        ##rregister or login user data content
    type UserLoggingContent {
        id: String!
        email: String!
        username: String!
        token: String!
        tokenExpire: Int!
        refreshToken: String!
        registeredAt: String!
        lastLoggedAt: String!

        friends: Int!
        invitations: Int!
        requests: Int!
        allPosts: [Post]!
        allChats: [ChatRoomMini]!
    }
        ##at client reload user data replacement
    type UserPrivateContent {
        id: String!
        email: String!
        username: String!
        registeredAt: String!
        lastLoggedAt: String!

        friends: Int!
        invitations: Int!
        requests: Int!
        allPosts: [Post]!
        allChats: [ChatRoomMini]!
    }
    type TokenAuth {
        id: String!
        newToken: String!
        tokenExpire: Int!
    }
    type AccountProcess {
        resultText: String!
        id: String!
        email: String!
        username: String!
    }

    ## for friends managing, not account datas approach
        ##for searches
    type UserPublicContent {
        userid: String!
        email: String!
        username: String!
        registeredAt: String!
        relation: Connection!
        mutualFriendCount: Int

        friends: [UserFracture]!
    }
        ##for other cases - no connection
    type UserFracture {
        userid: String!
        username: String!
        relation: Connection!
        mutualFriendCount: Int
    }
        ##for friends - approved relation
    type UserMini {
        userid: String!,
        username: String!,
        email: String!
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
        updatedAt: String
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
        partners: [UserFracture]!
        owner: UserFracture!
        title: String!
        startedAt: String!
        messages: [MessageUnit]!
    }
    type ChatRoomMini {
        chatid: String!
        owner: UserFracture!
        title: String!
        startedAt: String!
    }
    type MessageUnit {
        chatid: String!
        messageid: String!
        sentAt: String!
        owner: UserFracture!
        content: String!
        sentiments: [Sentiment]!
    }
    type ChatRoomProcess {
        chatid: String!
        resultText: String!
        alterationType: ChatProcess!
        addedUsers: [UserFracture]!
        removedUsers: [String]!
        updatedTitle: String
    }
    type MessageProcess {
        chatid: String!
        messageid: String
        resultText: String!
    }
    enum ChatProcess {
        ADDED_PARTNERS
        REMOVED_PARTNERS
        UPDATED_CHATROOM
        DELETED_CHATROOM
    }


 
    type Query {

        ## generals
        testquery: String!
        
        ## account processes
        refreshAuth: TokenAuth!
        requireClientContent: UserPrivateContent!

        ## friend processes
        searchForSomeUser(username: String!): [UserFracture]!

        listOfMyFriends: [UserMini]!
        listOfUndecidedFriendships: [UserFracture]!
        listOfInitiatedFriendships: [UserFracture]!
        showThisUserInDetail(userid: String!): UserPublicContent 
            ## undecidedCon and friends of friends
        showMeWhoCouldBeMyFriend: [UserFracture]!

        ## posts processes
        listOfMySentPosts(dating: String, amount: Int): [Post]      ## own posts to a specific user
        listOfMyRecievedPosts(dating: String, amount: Int): [Post]  ## specificly addressed to the user
        listOfAllPosts(dating: String, amount: Int): [Post]         ## own and firends posts

        ## comments, sentiments processes
        listOfTheseComments(targeted: TargetType!, id: ID!, dating: String, amount: Int): [Comment]!

        ## chatting, messaging processes
        listOfMessagesFromChatting(chatid: ID!, dating: String, amount: Int): ChatRoom!

    }
    type Mutation {

        ## account operations - tested!
        login(email: String!, password: String! ): UserLoggingContent!
        registration(email: String!, username: String!, password: String!, passwordconf: String! ): UserLoggingContent!
        resetPasswordStep1(email: String!): AccountProcess!
        resetPasswordStep3(newpassword: String!, newconf: String!): AccountProcess!
        changePassword(oldpassword: String!, newpassword: String!, newconf: String!): AccountProcess!
        changeAccountDatas(username: String! ): AccountProcess!
        deleteAccount(password: String!, passwordconf: String!): AccountProcess!
        logout: AccountProcess!


        ## firend processes
            ## for the initiation management by the source
        createAFriendshipInvitation(userid: ID!): UserFracture!
        removeAFriendshipInitiation(userid: ID!): FriendProcess!
            ## for the initiation acceptance-denial by the target
        approveThisFriendshipRequest(userid: ID!): UserMini
        discardThisFriendshipRequest(userid: ID!): FriendProcess!
            ## for remove a stable friend-conenction
        removeThisFriend(userid: ID!): FriendProcess!


        ## posts processes
            ## all originated
        makeAPost(content: String!, dedication: ID): Post! 
            ## only if it is the user's post
        updateThisPost(postid: ID!, newcontent: String, newdedication: ID): Post!
        removeThisPost(postid: ID!): PostProcess!


        ## comments, sentiments processes
            ## for everibody
        createCommentToHere(targeted: TargetType!, id: ID!, content: String): Comment!
            ## only for the authors
        updateCommentContent(commentid: ID!, content: String!): Comment!
        deleteThisComment(targeted: TargetType!, id: ID!, commentid: ID!): OpinionProcess!


        ## chatting, messaging processes
            ## for all users
        createChatRoom(partners: [ID]!, title: String!, firstContent: String!): ChatRoom!
            ## only for member users
        addPartnersToChatRoom(partners: [ID]!, chatid: ID!): ChatRoomProcess!
        sendNewMessage(chatid: ID!, content: String!): MessageUnit!
            ## privilage for a specific owner/starter user
        removePartnersFromChatRoom(partners: [ID]!, chatid: ID!): ChatRoomProcess!
        updateChatRoom(chatid: ID!, title: String!): ChatRoomProcess!
        deleteChatRoom(chatid: ID!): ChatRoomProcess!
            ## only for the authors of the message
        updateThisMessage(messageid: ID!, content: String!): MessageUnit!
        deleteThisMessage(messageid: ID!): MessageProcess!


        ## sentiment processes
        createSentimentToHere(targeted: TargetType!, id: ID!, content: Opinion!): Sentiment!
            ## only for the sentiment owner
        updateSentimentContent(targeted: TargetType!, id: ID!, sentimentid: ID!, content: Opinion!): Sentiment!
        deleteThisSentiment(targeted: TargetType!, id: ID!, sentimentid: ID!): OpinionProcess!


    }
`;


/**
 * WebSocket output collection
 * 
 * general elveloping structure:
 * {
 *      event: reflects what king of procces occured (post, comment, etc.)
 *      eventMethod: reflects that method was called, that sent this data
 *      properAction: dedicated action, the front application should do
 *      connectedTo: identifier, that needs to be updated at front
 *      payload: dataunit, that front should use to update the front
 * }
 *      connectedTo (-) and payload (=) types at different mutation methods
 * 
 *      createAFriendshipInvitation -'' ={UserFracture}
 *      removeAFriendshipInitiation - {idOfRequester: id } =''
 *      approveThisFriendshipRequest -'' ={UserMini}
 *      discardThisFriendshipRequest -{idOfInvited: id} =''
 *      removeThisFriend -{userid: id} =''
 * 
 * 
 *      makeAPost   -'' ={Post}
 *      updateThisPost -'' ={Post part}
 *      removeThisPost -{postid: id}, =''
 * 
 *      
 *          (if parent and root same => connecting to a Post)
 *      createCommentToHere -{ parent: id, root: id } ={Comment}
 *      updateCommentContent -{ parent: id, root: id } ={Comment part}
 *      deleteThisComment   -{ parent: id, root: id, parentUpdate: DateStr, 
 *                                commentid: id  }      = ''
 * 
 * 
 *      createChatRoom  - '' = {ChatRoom part}
 *      addPartnersToChatRoom - '' = {ChatRoom part}
 *      removePartnersFromChatRoom - '' = {ChatRoom part}
 *      updateChatRoom - '' = { ChatRoom part }
 *      deleteChatRoom - '' = { ChatRoom part }
 *      sendNewMessage -{ chatid: id } ={MessageUnit part}
 *      updateThisMessage -{ chatid: id } ={MessageUnit part}
 *      deleteThisMessage -{ chatid: id, messageid: id } =''
 * 
 * 
 *      createSentimentToHere  *
 *              ={Sentiment}
 *      updateSentimentContent *
 *              ={Sentiment}
 * 
 *        * POST -{parent: id, root: '', parentUpdate: DateStr }
 *          COMMENT -{ parent id, root id, parentUpdate: DateStr }
 *          CHAT    -{ chatid: id, messageid: id }
 * 
 *      deleteThisSentiment
 *          CHAT    -{ chatid: id, messageid: id, sentimentid: id }
 *              =''
 */