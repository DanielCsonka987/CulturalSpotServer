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
        username: 'Me Here',
        pwdHash: '$2b$12$MRSBPUJkPgav1B4pFGJsE.hrn0vZZ19/kjpIaOUpGFUlr7X2zF3Uu',  //testing
        registeredAt: '2011-10-05T14:48:00.000Z',
        lastLoggedAt: '2021-07-27T11:46:46.718Z',
        refreshToken: '',
        friends: [],
        initiatedCon: [],
        undecidedCont: []
    },
    {
        email: 'testmail@easymail.com',
        username: 'John Smith',
        pwdHash: '$2b$12$MRSBPUJkPgav1B4pFGJsE.hrn0vZZ19/kjpIaOUpGFUlr7X2zF3Uu',     // testing
        registeredAt: '',
        lastLoggedAt: '',
        resetPwdMarker: '',
        refreshToken: '',

        friends: [],
        initiatedCon: [],
        undecidedCon: []
    },
    {
        email: 'examplemail@easymail.com',
        username: 'Gary Ryan',
        pwdHash: '$2b$12$MRSBPUJkPgav1B4pFGJsE.hrn0vZZ19/kjpIaOUpGFUlr7X2zF3Uu',     // testing
        registeredAt: '',
        lastLoggedAt: '',
        resetPwdMarker: '',
        refreshToken: '',

        friends: [],
        initiatedCon: [],
        undecidedCon: []
    },
    {
        email: 'papermail@easymail.com',
        username: 'Jack Kennedy',
        pwdHash: '$2b$12$MRSBPUJkPgav1B4pFGJsE.hrn0vZZ19/kjpIaOUpGFUlr7X2zF3Uu',     // testing
        registeredAt: '',
        lastLoggedAt: '',
        resetPwdMarker: '',
        refreshToken: '',

        friends: [],
        initiatedCon: [],
        undecidedCon: []
    },
    {
        email: 'golden@easymail.com',
        username: 'Jack Moon',
        pwdHash: '$2b$12$MRSBPUJkPgav1B4pFGJsE.hrn0vZZ19/kjpIaOUpGFUlr7X2zF3Uu',     // testing
        registeredAt: '',
        lastLoggedAt: '',
        resetPwdMarker: '',
        refreshToken: '',

        friends: [],
        initiatedCon: [],
        undecidedCon: []
    },
    {
        email: 'silvern@easymail.com',
        username: 'John Coal',
        pwdHash: '$2b$12$MRSBPUJkPgav1B4pFGJsE.hrn0vZZ19/kjpIaOUpGFUlr7X2zF3Uu',     // testing
        registeredAt: '',
        lastLoggedAt: '',
        resetPwdMarker: '',
        refreshToken: '',

        friends: [],
        initiatedCon: [],
        undecidedCon: []
    },
    {
        email: 'copper@easymail.com',
        username: 'User1234 Here',
        pwdHash: '$2b$12$MRSBPUJkPgav1B4pFGJsE.hrn0vZZ19/kjpIaOUpGFUlr7X2zF3Uu',     // testing
        registeredAt: '',
        lastLoggedAt: '',
        resetPwdMarker: '',
        refreshToken: '',

        friends: [],
        initiatedCon: [],
        undecidedCon: []
    }
]