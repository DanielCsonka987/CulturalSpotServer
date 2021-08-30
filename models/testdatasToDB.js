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
    new mongooseId, new mongooseId
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
        createdAt: new Date('10 May 2021 12:12 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        _id: commentids[2],
        owner: userids[2],
        content: 'Don\'t worry, I could use that!',
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
        createdAt: new Date('12 June 2021 15:26 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        _id: commentids[4],
        owner: userids[0],
        content: 'Nooo, not that place - ',
        createdAt: new Date('14 August 2021 22:54 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        _id: commentids[5],
        owner: userids[3],
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
        createdAt: new Date('11 May 2021 23:56 UTC').toISOString(),
        updatedAt: '',
        comments: [commentids[7], commentids[8]],
        sentiments: []
    },
    {
        _id: commentids[7], 
        owner: userids[2],
        content: 'Is it really good? My car crashed... at the side and fuel-tank may damaged.',
        createdAt: new Date('12 May 2021 07:23 UTC').toISOString(),
        updatedAt: '',
        comments: [commentids[9]],
        sentiments: []
    },
    {
        _id: commentids[8], 
        owner: userids[1],
        content: 'Dont use that, maaan! Its an explosive now with seats.',
        createdAt: new Date('12 May 2021 07:45 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    },
    {
        _id: commentids[9], 
        owner: userids[1],
        content: 'But yes, he is a magician!',
        createdAt: new Date('12 May 2021 07:46 UTC').toISOString(),
        updatedAt: '',
        comments: [],
        sentiments: []
    }
]

module.exports.messages = [
    {
        _id: chatids[0],
        startedAt: '',
        partners: [
            userids[0], userids[1], userids[3]
        ],
        content: [
            {
                id: 1,
                sentAt: '',
                from: userids[0],
                message: 'Hi people! Whatsup?'
            },
            {
                id: 2,
                sentAt: '',
                from: userids[1],
                message: 'Hi! Good to here about you! I fine, as always... And you?'
            },
            {
                id: 3,
                sentAt: '',
                from: userids[3],
                message: 'Ahh, hi, fine, and you? I hope you could have some rest!'
            }
        ]
    },
    {
        _id: chatids[1],
        startedAt: '',
        partners: [
            userids[1], userids[2]
        ],
        content: [
            {
                id: 1,
                sentAt: '',
                from: userids[1],
                message: 'Hi! Do you have some time?'
            },
            {
                id: 2,
                sentAt: '',
                from: userids[1],
                message: 'I have a good idea about the business!'
            },
            {
                id: 3,
                sentAt: '',
                from: userids[2],
                message: 'Hi partner! Dont hold up, im listening!'
            }
        ]
    }
]