const mongooseId = require('mongoose').Types.ObjectId
const userids = [
    new mongooseId, new mongooseId, new mongooseId, new mongooseId, new mongooseId,
    new mongooseId
]
const postids = [
    new mongooseId, new mongooseId, new mongooseId, new mongooseId, new mongooseId,
    new mongooseId, new mongooseId
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
        pwdHash: '$2b$12$1qZdlguz7VvXF2C.FBy/0OEYbszOuUnkHUBp37td1YcTppNVaAona',     // testing
        registeredAt: '',
        lastLoggedAt: '',
        resetPwdToken: '',

        friends: [userids[1], userids[3]],
        undecided: []
    },
    {
        _id: userids[1],
        email: 'mymail@hotmail.com',
        username: 'Fraser',
        pwdHash: '$2b$12$L38Vr6KWwOzskRdIdUo7COGBrNW/2./V8pp5/5QAMNLOM4c1OVHv.',     // tester
        registeredAt: '',
        lastLoggedAt: '',
        resetPwdToken: '',

        friends: [userids[0], userids[2]],
        undecided: []
    },
    {
        _id: userids[2],
        email: 'email@gmail.jp',
        username: 'Caster',
        pwdHash: '$2b$12$S4q3ocgS9Jrs0DKISlnhfOLwhIhUoKkyuoUX9N.xS3JNvHz7WDXJq',     // testcase
        registeredAt: '',
        lastLoggedAt: '',
        resetPwdToken: '',

        friends: [userids[1]],
        undecided: []
    },
    {
        _id: userids[3],
        email: 'myacc@hotmail.com',
        username: 'Passer By',
        pwdHash: '$2b$12$XNEpIDrfE3T0V8uyprkiuOOl8TFiaz1svamipfn5kMDQTA85rwXwK',     // testpass
        registeredAt: '',
        lastLoggedAt: '',
        resetPwdToken: '',

        friends: [userids[0]],
        undecided: []
    },
    {
        _id: userids[4],
        email: 'testing@gmail.com',
        username: 'Passenger',
        pwdHash: '$2b$12$XNEpIDrfE3T0V8uyprkiuOOl8TFiaz1svamipfn5kMDQTA85rwXwK',     // testpasser
        registeredAt: '',
        lastLoggedAt: '',
        resetPwdToken: '',

        friends: [],
        undecided: [userids[5]]
    },
    {
        _id: userids[5],
        email: 'testpurpose@gmail.com',
        username: 'Somebody',
        pwdHash: '$2b$12$1rGfwRBKU8zcFCHAEOWAlunq4JJG6bdKCQ3yjxdvw71a2RMtJtS2e',     // testkey
        registeredAt: '',
        lastLoggedAt: '',
        resetPwdToken: '',

        friends: [],
        undecided: [userids[5]]
    },
    {
        _id: userids[6],
        email: 'testpurpose@gmail.com',
        username: 'Really New Here',
        pwdHash: '$2b$12$CtegCLT5gmar/gJ2r36kOOf5DnMMQnjwcL0CK0AtWt85R8lNjGwFe',     // testsecret
        registeredAt: '',
        lastLoggedAt: '',
        resetPwdToken: '',

        friends: [],
        undecided: []
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