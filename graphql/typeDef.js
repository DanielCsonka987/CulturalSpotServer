const { gql } = require('apollo-server-express')

module.exports = gql`

    ## for account matters
    type UserLoggingContent {
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
        allChats: [ChatRoomMini]!
    }
    type UserPrivateContent {
        id: String!
        email: String!
        username: String!
        registeredAt: String!
        lastLoggedAt: String!

        friends: [UserMini]!
        allPosts: [Post]!
        allChats: [ChatRoomMini]!
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
    type UserPublicContent {
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
        showThisUserInDetail(friendid: String!): UserPublicContent 
            ## undecidedCon and friends of friends
        showMeWhoCouldBeMyFriend: [UserFracture]!

        ## posts processes
        listOfMySentPosts(dating: String, amount: Int): [Post]      ## own posts to a specific user
        listOfMyRecievedPosts(dating: String, amount: Int): [Post]  ## specificly addressed to the user
        listOfAllPosts(dating: String, amount: Int): [Post]         ## own and firends posts

        ## comments, sentiments processes
        listOfTheseComments(targeted: TargetType!, id: String!, dating: String, amount: Int): [Comment]!

        ## chatting, messaging processes
        listOfMessagesFromChatting(chatid: String!, dating: String, amount: Int): ChatRoom!

    }
    type Mutation {

        ## account operations - tested!
        login(email: String!, password: String! ): UserLoggingContent!
        registration(email: String!, username: String!, password: String!, passwordconf: String! ): UserLoggingContent!
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
        addPartnersToChatRoom(partners: [String]!, chatid: String!): ChatRoomProcess!
        sendNewMessage(chatid: String!, content: String!): MessageUnit!
            ## privilage for a specific owner/starter user
        removePartnersFromChatRoom(partners: [String]!, chatid: String!): ChatRoomProcess!
        updateChatRoom(chatid: String!, title: String!): ChatRoomProcess!
        deleteChatRoom(chatid: String!): ChatRoomProcess!
            ## only for the authors of the message
        updateThisMessage(messageid: String!, content: String!): MessageUnit!
        deleteThisMessage(messageid: String!): MessageProcess!


        ## sentiment processes
        createSentimentToHere(targeted: TargetType!, id: String!, content: Opinion!): Sentiment!
            ## only for the sentiment owner
        updateSentimentContent(targeted: TargetType!, id: String!, sentimentid: String!, content: Opinion!): Sentiment!
        deleteThisSentiment(targeted: TargetType!, id: String!, sentimentid: String!): OpinionProcess!


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
 *      removeThisFriend -{friendid: id} =''
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