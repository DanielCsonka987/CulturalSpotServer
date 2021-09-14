const mongooseId = require('mongoose').Types.ObjectId
const userids = [
    new mongooseId, new mongooseId, new mongooseId, new mongooseId, new mongooseId,
    new mongooseId, new mongooseId, new mongooseId, new mongooseId, new mongooseId
]
const postids = [
    new mongooseId, new mongooseId, new mongooseId, new mongooseId, new mongooseId,
    new mongooseId, new mongooseId, new mongooseId, new mongooseId, new mongooseId
]
const commentids = [
    new mongooseId, new mongooseId, new mongooseId, new mongooseId, new mongooseId,
    new mongooseId, new mongooseId, new mongooseId, new mongooseId, new mongooseId
]
const chatids = [
    new mongooseId, new mongooseId, new mongooseId, new mongooseId, new mongooseId
]
const messageids = [
    new mongooseId, new mongooseId, new mongooseId, new mongooseId, new mongooseId,
    new mongooseId, new mongooseId, new mongooseId, new mongooseId, new mongooseId,
    new mongooseId, new mongooseId, new mongooseId, new mongooseId, new mongooseId,
    new mongooseId, new mongooseId, new mongooseId, new mongooseId, new mongooseId
]

module.exports.profiles = [
    {
        _id: userids[0],
        email: 'example@hotmail.uk',
        username: 'John Doe',
        pwdHash: '$2b$12$MRSBPUJkPgav1B4pFGJsE.hrn0vZZ19/kjpIaOUpGFUlr7X2zF3Uu',     // testing
        registeredAt: new Date('11 December 2020 10:34 UTC').toISOString(),
        lastLoggedAt: new Date('08 August 2021 23:21 UTC').toISOString(),
        resetPwdMarker: '',
        refreshToken: '',

        myPosts: [postids[0], postids[5]],
        myChats: [chatids[0]],
        friends: [userids[1], userids[3]],
        myInvitations: [],
        myFriendRequests: [userids[5]]
    },
    {
        _id: userids[1],
        email: 'mymail@hotmail.com',
        username: 'Fraser',
        pwdHash: '$2b$12$MRSBPUJkPgav1B4pFGJsE.hrn0vZZ19/kjpIaOUpGFUlr7X2zF3Uu',     // testing
        registeredAt: new Date('18 June 2019 16:04 UTC').toISOString(),
        lastLoggedAt: new Date('28 July 2021 12:32 UTC').toISOString(),
        resetPwdMarker: '',
        refreshToken: '',

        myPosts: [postids[3], postids[4]],
        myChats: [chatids[0], chatids[1], chatids[2]],
        friends: [userids[0], userids[2], userids[7], userids[8]],
        myInvitations: [],
        myFriendRequests: []
    },
    {
        _id: userids[2],
        email: 'email@gmail.jp',
        username: 'Caster',
        pwdHash: '$2b$12$XBj3d7FG3ETwbHtIaEd2vuWdq.8wpLtmxHN8JdLEae5s5attfPFVC',     // testing
        registeredAt: new Date('13 May 2021 13:10 UTC').toISOString(),
        lastLoggedAt: new Date('21 July 2021 06:10 UTC').toISOString(),
        resetPwdMarker: '',
        refreshToken: '',

        myPosts: [postids[2]],
        myChats: [chatids[1], chatids[2]],
        friends: [userids[1]],
        myInvitations: [],
        myFriendRequests: []
    },
    {
        _id: userids[3],
        email: 'myacc@hotmail.com',
        username: 'Passer By',
        pwdHash: '$2b$12$mZqGaZe0EY3RWCV8.U5CD.n5bOdapHztkHoVzkunATOtsovbjxobC',     // testing
        registeredAt: new Date('13 May 2020 13:37 UTC').toISOString(),
        lastLoggedAt: new Date('03 February 2021 13:37 UTC').toISOString(),
        resetPwdMarker: '',
        refreshToken: '',

        myPosts: [postids[1], postids[6]],
        myChats: [chatids[0]],
        friends: [userids[0]],
        myInvitations: [],
        myFriendRequests: []
    },
    {
        _id: userids[4],
        email: 'testing@gmail.com',
        username: 'Passenger',
        pwdHash: '$2b$12$FBM2jfgz3QgDBDewmAHvKONp9Zg.Y1NFgH.jDoEyif1aHtUzPN8RW',     // testing
        registeredAt: new Date('13 May 2018 18:30 UTC').toISOString(),
        lastLoggedAt: new Date('10 August 2021 11:24 UTC').toISOString(),
        resetPwdMarker: '',
        refreshToken: '',

        myPosts: [],
        myChats: [],
        friends: [],
        myInvitations: [],
        myFriendRequests: [userids[5]]
    },
    {
        _id: userids[5],
        email: 'testpurpose@gmail.com',
        username: 'Somebody',
        pwdHash: '$2b$12$puvV62aqpUXGG3JJfUHKVOC4RVSMHJkfeW7hyrQrpmHcKBU9j9NIS',     // testing
        registeredAt: new Date('11 January 2016 13:37 UTC').toISOString(),
        lastLoggedAt: new Date('21 May 2021 18:21 UTC').toISOString(),
        resetPwdMarker: '',
        refreshToken: '',

        myPosts: [postids[7]],
        myChats: [],
        friends: [userids[9]],
        myInvitations: [userids[4], userids[0]],
        myFriendRequests: []
    },
    {
        _id: userids[6],
        email: 'testpurpose@gmail.com',
        username: 'Really New Here',
        pwdHash: '$2b$12$UVOs.o3nDnMpPuCB182KJOnjznM.2udxeoZWproMQmq6vDPBPli0C',     // testing
        registeredAt: new Date('30 May 2019 19:00 UTC').toISOString(),
        lastLoggedAt: new Date('13 July 2021 13:04 UTC').toISOString(),
        resetPwdMarker: '',
        refreshToken: '',

        myPosts: [],
        myChats: [],
        friends: [],
        myInvitations: [],
        myFriendRequests: []
    },
    {
        _id: userids[7],
        email: 'usermail@gmail.com',
        username: 'Profile_1089',
        pwdHash: '$2b$12$26bRmafEWLEggXu7XA7SCuRfR3GJT.eXbSOP05mkqfxgQvATWmffO',     // testing
        registeredAt: new Date('26 September 2016 09:37 UTC').toISOString(),
        lastLoggedAt: new Date('13 May 2021 13:37 UTC').toISOString(),
        resetPwdMarker: '',
        refreshToken: '',

        myPosts: [postids[9]],
        myChats: [chatids[1]],
        friends: [userids[1]],
        myInvitations: [],
        myFriendRequests: []
    },
    {
        _id: userids[8],
        email: 'mail1569@gmail.com',
        username: 'User Programmer',
        pwdHash: '$2b$12$.WEmolgcMWZl78bTn8sBC.w1mbR4kpE/F0hI9Bql7ylAtWi2ni3Uy',     // testing
        registeredAt: new Date('01 December 2020 15:37 UTC').toISOString(),
        lastLoggedAt: new Date('24 June 2021 13:25 UTC').toISOString(),
        resetPwdMarker: '',
        refreshToken: '',

        myPosts: [],
        myChats: [],
        friends: [userids[1]],
        myInvitations: [],
        myFriendRequests: []
    },
    {
        _id: userids[9],
        email: 'user319mail@gmail.com',
        username: 'CoolGuy',
        pwdHash: '$2b$12$xDMFtCneEzaUpu0plRIk1u29i5NdriaOMnndJt980lrkHb7MoqfGS',     // testing
        registeredAt: new Date('26 May 2020 10:12 UTC').toISOString(),
        lastLoggedAt: new Date('29 August 2021 15:31 UTC').toISOString(),
        resetPwdMarker: '',
        refreshToken: '',

        myPosts: [postids[8]],
        myChats: [],
        friends: [userids[5]],
        myInvitations: [],
        myFriendRequests: []
    }
]

module.exports.posts = [
    {
        _id: postids[0],
        owner: userids[0],

        content: 'I have got married yesterday!',
        createdAt: new Date('14 April 2021 07:11 UTC').toISOString(),
        updatedAt: new Date('15 April 2021 11:12 UTC').toISOString(),
        comments: [],
        sentiments: [
            { 
                id: 1,
                owner: userids[1],
                content: 'LOVE'
            }
        ]
    },
    {
        _id: postids[1],
        owner: userids[3],
        dedicatedTo: userids[0],
        content: 'I moved to a new appartmant!',
        createdAt: new Date('22 November 2020 01:12 UTC').toISOString(),
        updatedAt: new Date('24 November 2020 10:12 UTC').toISOString(),
        comments: [
            commentids[0]
        ],
        sentiments: []
    },
    {
        _id: postids[2],
        owner: userids[2],

        content: 'Where can is find a good car mechanic?',
        createdAt: new Date('16 May 2021 16:26 UTC').toISOString(),
        updatedAt: new Date('10 May 2021 13:17 UTC').toISOString(),
        comments: [
            commentids[1], commentids[2]
        ],
        sentiments: [
            { 
                id: 1,
                owner: userids[1],
                content: 'LIKE'
            }
        ]
    },
    {
        _id: postids[3],
        owner: userids[1],
        dedicatedTo: userids[7],
        content: 'It is a sunny day! Don\'t stay inside!',
        createdAt: new Date('10 June 2021 16:54 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        _id: postids[4],
        owner: userids[1],

        content: 'I drove in a storm... I crushed the bumper...',
        createdAt: new Date('12 June 2021 10:26 UTC').toISOString(),
        updatedAt: new Date('12 June 2021 16:26 UTC').toISOString(),
        comments: [
            commentids[3]
        ],
        sentiments: [
            { 
                id: 1,
                owner: userids[0],
                content: 'DISLIKE'
            }, 
            { 
                id: 2,
                owner: userids[2],
                content: 'SAD'
            }
        ]
    },
    {
        _id: postids[5],
        ownser: userids[0],

        content: 'I have some extra gooseberry - who want some?',
        createdAt: new Date('04 April 2021 23:59 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        _id: postids[6],
        owner: userids[3],

        content: 'I am preparing to have a tour to Krakko - any ide, where to go?',
        createdAt: new Date('14 August 2021 20:10 UTC').toISOString(),
        updatedAt: new Date('14 August 2021 23:56 UTC').toISOString(),
        comments: [
            commentids[4], commentids[5]
        ],
        sentiments: []
    },
    {
        _id: postids[7],
        owner: userids[5],

        content: 'Good Business is appeared, no hesitate to ask about it!',
        createdAt: new Date('16 March 2021 16:26 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        _id: postids[8],
        owner: userids[9],

        content: 'I have some newborn little kittey, who seeks new home at good owners!',
        createdAt: new Date('23 May 2021 12:26 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        _id: postids[9],
        owner: userids[7],

        content: 'The weather is awful....I have already wet cealing - anybody with the same problem?',
        createdAt: new Date('19 February 2021 14:16 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    }
]

module.exports.comments = [
    {
        _id: commentids[0],
        owner: userids[0],
        content: 'Wow - here did you have found one?',
        parentNode: postids[1],
        rootPost: postids[1],
        createdAt: new Date('24 November 2020 10:12 UTC').toISOString(),
        updatedAt: new Date('25 November 2021 22:32 UTC').toISOString(),
        comments: [],
        sentiments: [
            {
                id: 1,
                owner: userids[7],
                content: 'FUNNY'
            }
        ]
    },
    {
        _id: commentids[1],
        owner: userids[1],
        content: 'I could give one, but it is expensive!',
        parentNode: postids[2],
        rootPost: postids[2],
        createdAt: new Date('10 May 2021 12:12 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        _id: commentids[2],
        owner: userids[2],
        content: 'Don\'t worry, I could use that!',
        parentNode: postids[2],
        rootPost: postids[2],
        createdAt: new Date('10 May 2021 13:17 UTC').toISOString(),
        updatedAt: new Date('11 May 2021 23:56 UTC').toISOString(),
        comments: [
            commentids[6]
        ],
        sentiments: []
    },
    {
        _id: commentids[3],
        owner: userids[2],
        content: 'What?! Are you all right?',
        parentNode: postids[4],
        rootPost: postids[4],
        createdAt: new Date('12 June 2021 15:26 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        _id: commentids[4],
        owner: userids[0],
        content: 'Nooo, not that place - ',
        parentNode: postids[6],
        rootPost: postids[6],
        createdAt: new Date('14 August 2021 22:54 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        _id: commentids[5],
        owner: userids[3],
        parentNode: postids[6],
        rootPost: postids[6],
        content: 'Of course that place... why not?',
        createdAt: new Date('14 August 2021 23:56 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        _id: commentids[6], 
        owner: userids[1],
        content: 'RepairNow MechaShop, 1st Road 10, I hope it is a real help!',
        parentNode: postids[6],
        rootPost: postids[2],
        createdAt: new Date('11 May 2021 23:56 UTC').toISOString(),
        updatedAt: '',
        comments: [commentids[7], commentids[8]],
        sentiments: []
    },
    {
        _id: commentids[7], 
        owner: userids[2],
        content: 'Is it really good? My car crashed... at the side and fuel-tank may damaged.',
        parentNode: postids[6],
        rootPost: postids[2],
        createdAt: new Date('12 May 2021 07:23 UTC').toISOString(),
        updatedAt: '',
        comments: [commentids[9]],
        sentiments: []
    },
    {
        _id: commentids[8], 
        owner: userids[1],
        content: 'Dont use that, maaan! Its an explosive now with seats.',
        parentNode: postids[6],
        rootPost: postids[2],
        createdAt: new Date('12 May 2021 07:45 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        _id: commentids[9], 
        owner: userids[1],
        content: 'But yes, he is a magician!',
        parentNode: postids[7],
        rootPost: postids[2],
        createdAt: new Date('12 May 2021 07:46 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    }
]


module.exports.chattings = [
    {
        _id: chatids[0],
        owner: userids[0],
        title: 'Discussion',
        startedAt: new Date('14 May 2021 09:46 UTC'),
        partners: [
            userids[1], userids[3]
        ]
    },
    {
        _id: chatids[1],
        owner: userids[1],
        title: 'Cinema experience',
        startedAt: new Date('15 May 2021 07:26 UTC'),
        partners: [
           userids[2], userids[7]
        ]
    },
    {
        _id: chatids[2],
        owner: userids[2],
        title: 'Urgent help needed',
        startedAt: new Date('15 May 2021 07:26 UTC'),
        partners: [
           userids[1]
        ]
    },
    {
        _id: chatids[3],
        owner: userids[5],
        title: 'Marketting list and argue',
        startedAt: new Date('21 June 2021 08:14 UTC'),
        partners: [
           userids[9]
        ]
    },
    {
        _id: chatids[4],
        owner: userids[0],
        title: 'Gaming news',
        startedAt: new Date('14 June 2021 17:20 UTC'),
        partners: [
           userids[3]
        ]
    }
]


module.exports.messages = [
    {
        _id: messageids[0],
        chatid: chatids[0],
        owner: userids[0],

        sentAt: new Date('14 May 2021 09:46 UTC'),
        content: 'Hy people!',
        prevMsg: null,
        nextMsg: messageids[1],

        sentiments: []
    },
    {
        _id: messageids[1],
        chatid: chatids[0],
        owner: userids[1],

        sentAt: new Date('14 May 2021 09:49 UTC'),
        content: 'Hy what is up? What is this chatting for?',
        prevMsg: messageids[0],
        nextMsg: messageids[2],

        sentiments: []
    },
    {
        _id: messageids[2],
        chatid: chatids[0],
        owner: userids[0],

        sentAt: new Date('14 May 2021 09:53 UTC'),
        content: 'For arguing some things...',
        prevMsg: messageids[1],
        nextMsg: messageids[4],

        sentiments: []
    },


    {
        _id: messageids[3],
        chatid: chatids[1],
        owner: userids[1],

        sentAt: new Date('15 May 2021 07:26 UTC'),
        content: 'Hy, what was it like in the cinema?',
        prevMsg: null,
        nextMsg: messageids[5],

        sentiments: []
    },


    {
        _id: messageids[4],
        chatid: chatids[0],
        owner: userids[3],

        sentAt: new Date('14 May 2021 09:54 UTC'),
        content: 'Please, we are listening!',
        prevMsg: messageids[2],
        nextMsg: messageids[6],

        sentiments: []
    },
    {
        _id: messageids[5],
        chatid: chatids[1],
        owner: userids[2],

        sentAt: new Date('15 May 2021 07:43 UTC'),
        content: 'Well, ive seen better movie before - i survived',
        prevMsg: messageids[3],
        nextMsg: messageids[7],

        sentiments: []
    },
    {
        _id: messageids[6],
        chatid: chatids[0],
        owner: userids[1],

        sentAt: new Date('14 May 2021 09:58 UTC'),
        content: 'Dont hold you back!',
        prevMsg: messageids[4],
        nextMsg: messageids[8],

        sentiments: []
    },
    {
        _id: messageids[7],
        chatid: chatids[1],
        owner: userids[7],

        sentAt: new Date('15 May 2021 07:44 UTC'),
        content: 'It was not soo bad, but true, i could wish better one',
        prevMsg: messageids[5],
        nextMsg: null,

        sentiments: []
    },
    {
        _id: messageids[8],
        chatid: chatids[0],
        owner: userids[0],

        sentAt: new Date('14 May 2021 09:58 UTC'),
        content: 'Next week, i got a promotion, we need to celebrate! What ideas you have?',
        prevMsg: messageids[6],
        nextMsg: null,

        sentiments: []
    },
    {
        _id: messageids[9],
        chatid: chatids[2],
        owner: userids[2],

        sentAt: new Date('19 May 2021 01:58 UTC'),
        content: 'Are you up?',
        prevMsg: null,
        nextMsg: null,

        sentiments: []
    },
    {
        _id: messageids[10],
        chatid: chatids[3],
        owner: userids[5],

        sentAt: new Date('21 June 2021 08:14 UTC'),
        content: 'Hy, we need to talk about tonns of things',
        prevMsg: null,
        nextMsg: messageids[11],

        sentiments: []
    },
    {
        _id: messageids[11],
        chatid: chatids[3],
        owner: userids[9],

        sentAt: new Date('21 June 2021 08:18 UTC'),
        content: 'Yeh, i am here - buying new stuff',
        prevMsg: messageids[10],
        nextMsg: messageids[13],

        sentiments: []
    },
    {
        _id: messageids[12],
        chatid: chatids[4],
        owner: userids[0],

        sentAt: new Date('21 June 2021 08:14 UTC'),
        content: 'Gaming news chatroom created - i hope some peuple may join with time...',
        prevMsg: null,
        nextMsg: messageids[14],

        sentiments: []
    },
    {
        _id: messageids[13],
        chatid: chatids[3],
        owner: userids[5],

        sentAt: new Date('21 June 2021 08:23 UTC'),
        content: 'Good, so we need some mic for the vocalists',
        prevMsg: messageids[11],
        nextMsg: messageids[16],

        sentiments: []
    },
    {
        _id: messageids[14],
        chatid: chatids[4],
        owner: userids[3],

        sentAt: new Date('21 June 2021 08:54 UTC'),
        content: 'Perhaps soon... what mistakes did you do this season?',
        prevMsg: messageids[12],
        nextMsg: messageids[15],

        sentiments: []
    },
    {
        _id: messageids[15],
        chatid: chatids[4],
        owner: userids[0],

        sentAt: new Date('21 June 2021 08:55 UTC'),
        content: 'I could not block tonns of attacks - annoying',
        prevMsg: messageids[14],
        nextMsg: messageids[17],

        sentiments: []
    },
    {
        _id: messageids[16],
        chatid: chatids[3],
        owner: userids[9],

        sentAt: new Date('21 June 2021 10:03 UTC'),
        content: 'Yes, but some sheets for them may not great money',
        prevMsg: messageids[13],
        nextMsg: messageids[18],

        sentiments: []
    },
    {
        _id: messageids[17],
        chatid: chatids[4],
        owner: userids[3],

        sentAt: new Date('21 June 2021 09:02 UTC'),
        content: 'Dont let it cheer you down - i see some of that - you are getting always strong attackers!',
        prevMsg: messageids[15],
        nextMsg: null,

        sentiments: []
    },
    {
        _id: messageids[18],
        chatid: chatids[3],
        owner: userids[5],

        sentAt: new Date('21 June 2021 10:10 UTC'),
        content: 'Shure...',
        prevMsg: messageids[16],
        nextMsg: messageids[19],

        sentiments: []
    },
    {
        _id: messageids[19],
        chatid: chatids[3],
        owner: userids[5],

        sentAt: new Date('21 June 2021 10:19 UTC'),
        content: 'And dont forget the guittar reparation. John crashed it again his one!',
        prevMsg: messageids[18],
        nextMsg: null,

        sentiments: []
    },
]