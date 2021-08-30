module.exports.createTokenToHeader = (token)=>{
    return 'Bearer ' + token;
}

module.exports.userTestRegister = {
    email: 'useregist@easygmail.com',   //this is added durring the test
    username: 'New User',
    pwd: 'testing',
}

module.exports.userTestDatas = [
    {
        email: 'user@easygmail.com',    //this is removed durring the test
        username: 'User 0',
        pwdHash: '$2b$12$MRSBPUJkPgav1B4pFGJsE.hrn0vZZ19/kjpIaOUpGFUlr7X2zF3Uu',  //testing
        registeredAt: new Date('19 February 2015 14:48 UTC').toISOString(),
        lastLoggedAt: new Date('05 May 2021 10:51 UTC').toISOString(),
        refreshToken: '',

        myPosts: [],
        friends: [],
        myInvitations: [],
        myFriendRequestst: []
    },
    {
        email: 'testmail@easymail.com',
        username: 'User 1',
        pwdHash: '$2b$12$MRSBPUJkPgav1B4pFGJsE.hrn0vZZ19/kjpIaOUpGFUlr7X2zF3Uu',     // testing
        registeredAt: new Date('10 October 2015 14:10 UTC').toISOString(),
        lastLoggedAt: new Date('08 May 2020 13:34 UTC').toISOString(),
        resetPwdMarker: '',
        refreshToken: '',

        myPosts: [],
        friends: [],
        myInvitations: [],
        myFriendRequests: []
    },
    {
        email: 'examplemail@easymail.com',
        username: 'User 2',
        pwdHash: '$2b$12$MRSBPUJkPgav1B4pFGJsE.hrn0vZZ19/kjpIaOUpGFUlr7X2zF3Uu',     // testing
        registeredAt: new Date('05 June 2017 10:41 UTC').toISOString(),
        lastLoggedAt: new Date('01 October 2020 14:48 UTC').toISOString(),
        resetPwdMarker: '',
        refreshToken: '',

        myPosts: [],
        friends: [],
        myInvitations: [],
        myFriendRequests: []
    },
    {
        email: 'papermail@easymail.com',
        username: 'User 3',
        pwdHash: '$2b$12$MRSBPUJkPgav1B4pFGJsE.hrn0vZZ19/kjpIaOUpGFUlr7X2zF3Uu',     // testing
        registeredAt: new Date('16 November 2020 09:14 UTC').toISOString(),
        lastLoggedAt: new Date('06 April 2021 11:40 UTC').toISOString(),
        resetPwdMarker: '',
        refreshToken: '',

        myPosts: [],
        friends: [],
        myInvitations: [],
        myFriendRequests: []
    },
    {
        email: 'golden@easymail.com',
        username: 'User 4',
        pwdHash: '$2b$12$MRSBPUJkPgav1B4pFGJsE.hrn0vZZ19/kjpIaOUpGFUlr7X2zF3Uu',     // testing
        registeredAt: new Date('31 March 2015 04:54 UTC').toISOString(),
        lastLoggedAt: new Date('05 July 2021 14:30 UTC').toISOString(),
        resetPwdMarker: '',
        refreshToken: '',

        myPosts: [],
        friends: [],
        myInvitations: [],
        myFriendRequests: []
    },
    {
        email: 'silvern@easymail.com',
        username: 'User 5',
        pwdHash: '$2b$12$MRSBPUJkPgav1B4pFGJsE.hrn0vZZ19/kjpIaOUpGFUlr7X2zF3Uu',     // testing
        registeredAt: new Date('30 January 2017 11:48 UTC').toISOString(),
        lastLoggedAt: new Date('13 August 2021 21:08 UTC').toISOString(),
        resetPwdMarker: '',
        refreshToken: '',

        myPosts: [],
        friends: [],
        myInvitations: [],
        myFriendRequests: []
    },
    {
        email: 'copper@easymail.com',
        username: 'User 6',
        pwdHash: '$2b$12$MRSBPUJkPgav1B4pFGJsE.hrn0vZZ19/kjpIaOUpGFUlr7X2zF3Uu',     // testing
        registeredAt: new Date('05 October 2015 14:48 UTC').toISOString(),
        lastLoggedAt: new Date('15 October 2020 10:12 UTC').toISOString(),
        resetPwdMarker: '',
        refreshToken: '',

        myPosts: [],
        friends: [],
        myInvitations: [],
        myFriendRequests: []
    }
]

module.exports.postTestDatas1 = [   //owner-s are defined at the test
    {
        content: 'Post content 0',
        createdAt: new Date('15 May 2021 10:12 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        content: 'Post content 1',
        createdAt: new Date('23 December 2020 11:12 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        content: 'Post content 2',
        createdAt: new Date('01 February 2021 10:36 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        content: 'Post content 3',
        createdAt: new Date('05 June 2020 07:12 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        content: 'Post content 4',
        createdAt: new Date('27 April 2020 21:02 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        content: 'Post content 5',
        createdAt: new Date('30 May 2020 23:04 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    }
]
module.exports.postTestDatas2 = [
    {
        content: 'Post content 6',
        createdAt: new Date('23 October 2020 17:10 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        content: 'Post content 7',
        createdAt: new Date('04 March 2021 19:56 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        content: 'Post content 8',
        createdAt: new Date('19 August 2020 14:43 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    }
]

module.exports.commentTestDatas1 = [
    {
        content: 'Commenting 0',
        createdAt: new Date('11 May 2021 13:13 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        content: 'Commenting 1',
        createdAt: new Date('29 January 2020 13:12 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        content: 'Commenting 2',
        createdAt: new Date('25 January 2021 05:11 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        content: 'Commenting 3',
        createdAt: new Date('22 October 2020 01:24 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        content: 'Commenting 4',
        createdAt: new Date('26 June 2021 17:37 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        content: 'Commenting 5',
        createdAt: new Date('22 April 2021 05:52 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        content: 'Commenting 6',
        createdAt: new Date('03 March 2020 14:49 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    }
]

module.exports.commentTestDatas2 = [
    {
        content: 'Commenting 7',
        createdAt: new Date('26 June 2021 17:37 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        content: 'Commenting 8',
        createdAt: new Date('22 April 2021 05:52 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        content: 'Commenting 9',
        createdAt: new Date('03 March 2020 14:49 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        content: 'Commenting 10',
        createdAt: new Date('03 March 2020 14:49 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    }
]

module.exports.sentimentTestDatas = [
    {
        content: 'LIKE',
        createdAt: new Date('04 May 2020 12:33 UTC').toISOString()
    },
    {
        content: 'LIKE',
        createdAt: new Date('11 June 2021 02:51 UTC').toISOString()
    },
    {
        content: 'DISLIKE',
        createdAt: new Date('19 November 2020 16:23 UTC').toISOString()
    },
    {
        content: 'SAD',     //no.3
        createdAt: new Date('23 December 2020 04:30 UTC').toISOString()
    },
    {
        content: 'FUNNY',   //no.4
        createdAt: new Date('05 September 2020 20:17 UTC').toISOString()
    },
    {
        content: 'LOVE',    //no.5
        createdAt: new Date('26 October 2020 16:44 UTC').toISOString()
    },
    {
        content: 'MAD', //no.6
        createdAt: new Date('03 March 2020 14:49 UTC').toISOString()
    },
    {
        content: 'LIKE',
        createdAt: new Date('01 MAy 2021 12:31 UTC').toISOString()
    },
]