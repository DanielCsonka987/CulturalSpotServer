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
    new mongooseId, new mongooseId
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
        registeredAt: '',
        lastLoggedAt: '',
        resetPwdToken: '',

        friends: [userids[1], userids[3]],
        initiatedCon: [],
        undecidedCon: [userids[5]]
    },
    {
        _id: userids[1],
        email: 'mymail@hotmail.com',
        username: 'Fraser',
        pwdHash: '$2b$12$MRSBPUJkPgav1B4pFGJsE.hrn0vZZ19/kjpIaOUpGFUlr7X2zF3Uu',     // testing
        registeredAt: '',
        lastLoggedAt: '',
        resetPwdToken: '',

        friends: [userids[0], userids[2], userids[7], userids[8]],
        initiatedCon: [],
        undecidedCon: []
    },
    {
        _id: userids[2],
        email: 'email@gmail.jp',
        username: 'Caster',
        pwdHash: '$2b$12$XBj3d7FG3ETwbHtIaEd2vuWdq.8wpLtmxHN8JdLEae5s5attfPFVC',     // testing
        registeredAt: '',
        lastLoggedAt: '',
        resetPwdToken: '',

        friends: [userids[1]],
        initiatedCon: [],
        undecidedCon: []
    },
    {
        _id: userids[3],
        email: 'myacc@hotmail.com',
        username: 'Passer By',
        pwdHash: '$2b$12$mZqGaZe0EY3RWCV8.U5CD.n5bOdapHztkHoVzkunATOtsovbjxobC',     // testing
        registeredAt: '',
        lastLoggedAt: '',
        resetPwdToken: '',

        friends: [userids[0]],
        initiatedCon: [],
        undecidedCon: []
    },
    {
        _id: userids[4],
        email: 'testing@gmail.com',
        username: 'Passenger',
        pwdHash: '$2b$12$FBM2jfgz3QgDBDewmAHvKONp9Zg.Y1NFgH.jDoEyif1aHtUzPN8RW',     // testing
        registeredAt: '',
        lastLoggedAt: '',
        resetPwdToken: '',

        friends: [],
        initiatedCon: [],
        undecidedCon: [userids[5]]
    },
    {
        _id: userids[5],
        email: 'testpurpose@gmail.com',
        username: 'Somebody',
        pwdHash: '$2b$12$puvV62aqpUXGG3JJfUHKVOC4RVSMHJkfeW7hyrQrpmHcKBU9j9NIS',     // testing
        registeredAt: '',
        lastLoggedAt: '',
        resetPwdToken: '',

        friends: [userids[9]],
        initiatedCon: [userids[4], userids[0]],
        undecidedCon: []
    },
    {
        _id: userids[6],
        email: 'testpurpose@gmail.com',
        username: 'Really New Here',
        pwdHash: '$2b$12$UVOs.o3nDnMpPuCB182KJOnjznM.2udxeoZWproMQmq6vDPBPli0C',     // testing
        registeredAt: '',
        lastLoggedAt: '',
        resetPwdToken: '',

        friends: [],
        initiatedCon: [],
        undecidedCon: []
    },
    {
        _id: userids[7],
        email: 'usermail@gmail.com',
        username: 'Profile_1089',
        pwdHash: '$2b$12$26bRmafEWLEggXu7XA7SCuRfR3GJT.eXbSOP05mkqfxgQvATWmffO',     // testing
        registeredAt: '',
        lastLoggedAt: '',
        resetPwdToken: '',

        friends: [userids[1]],
        initiatedCon: [],
        undecidedCon: []
    },
    {
        _id: userids[8],
        email: 'mail1569@gmail.com',
        username: 'User Programmer',
        pwdHash: '$2b$12$.WEmolgcMWZl78bTn8sBC.w1mbR4kpE/F0hI9Bql7ylAtWi2ni3Uy',     // testing
        registeredAt: '',
        lastLoggedAt: '',
        resetPwdToken: '',

        friends: [userids[1]],
        initiatedCon: [],
        undecidedCon: []
    },
    {
        _id: userids[9],
        email: 'user319mail@gmail.com',
        username: 'CoolGuy',
        pwdHash: '$2b$12$xDMFtCneEzaUpu0plRIk1u29i5NdriaOMnndJt980lrkHb7MoqfGS',     // testing
        registeredAt: '',
        lastLoggedAt: '',
        resetPwdToken: '',

        friends: [userids[5]],
        initiatedCon: [],
        undecidedCon: []
    }
]

module.exports.posts = [
    {
        _id: postids[0],
        owner: userids[0],
        content: 'I have got married yestaurday!',
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
        content: 'I moved to a new appartmant!',
        comments: [
            commentids[0]
        ],
        sentiments: []
    },
    {
        _id: postids[2],
        owner: userids[2],
        content: 'Where can is find a good car mechanic?',
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
        content: 'It is a sunny day! Don\'t stay inside!',
        comments: [],
        sentiments: []
    },
    {
        _id: postids[4],
        owner: userids[1],
        content: 'I drove in a storm... I crushed the bumper...',
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
        owner: userids[0],
        content: 'I have some extra gooseberry - who want some?',
        comments: [],
        sentiments: []
    },
    {
        _id: postids[6],
        owner: userids[3],
        content: 'I am preparing to have a tour to Krakko - any ide, where to go?',
        comments: [
            commentids[4], commentids[5]
        ],
        sentiments: []
    },
    {
        _id: postids[7],
        owner: userids[5],
        content: 'Good Business is appeared, no hesitate to ask about it!',
        comments: [],
        sentiments: []
    },
    {
        _id: postids[8],
        owner: userids[9],
        content: 'I have some newborn little kittey, who seeks new home at good owners!',
        comments: [],
        sentiments: []
    },
    {
        _id: postids[9],
        owner: userids[7],
        content: 'The weather is awful....I have already wet cealing - anybody with the same problem?',
        comments: [],
        sentiments: []
    }
]

module.exports.comments = [
    {
        _id: commentids[0],
        owner: userids[2],
        content: 'Wow - here did you have found one?',
        comments: [],
        sentiments: [
            {
                id: 1,
                owner: userids[2],
                content: 'FUNNY'
            }
        ]
    },
    {
        _id: commentids[1],
        owner: userids[1],
        content: 'I could give one, but it is expensice!',
        comments: [],
        sentiments: []
    },
    {
        _id: commentids[2],
        owner: userids[1],
        content: 'Don\'t worry, I could use that!',
        comments: [
            commentids[6]
        ],
        sentiments: []
    },
    {
        _id: commentids[3],
        owner: userids[2],
        content: 'What?! Are you all right?',
        comments: [],
        sentiments: []
    },
    {
        _id: commentids[4],
        owner: userids[0],
        content: 'Nooo, not that place - ',
        comments: [],
        sentiments: []
    },
    {
        _id: commentids[5],
        owner: userids[3],
        content: 'Of course that place... why not?',
        comments: [],
        sentiments: []
    },
    {
        _id: commentids[6], 
        owner: userids[2],
        content: 'RepairNow MechaShop, 1st Road 10, I hope it is a real help!',
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