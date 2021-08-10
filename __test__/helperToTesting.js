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
        registeredAt: new Date('19 February 2015 14:48 UTC').toISOString(),
        lastLoggedAt: new Date('05 May 2021 10:51 UTC').toISOString(),
        refreshToken: '',
        friends: [],
        initiatedCon: [],
        undecidedCont: []
    },
    {
        email: 'testmail@easymail.com',
        username: 'John Smith',
        pwdHash: '$2b$12$MRSBPUJkPgav1B4pFGJsE.hrn0vZZ19/kjpIaOUpGFUlr7X2zF3Uu',     // testing
        registeredAt: new Date('10 October 2015 14:10 UTC').toISOString(),
        lastLoggedAt: new Date('08 May 2020 13:34 UTC').toISOString(),
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
        registeredAt: new Date('05 June 2017 10:41 UTC').toISOString(),
        lastLoggedAt: new Date('01 October 2020 14:48 UTC').toISOString(),
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
        registeredAt: new Date('16 November 2020 09:14 UTC').toISOString(),
        lastLoggedAt: new Date('06 April 2021 11:40 UTC').toISOString(),
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
        registeredAt: new Date('31 March 2015 04:54 UTC').toISOString(),
        lastLoggedAt: new Date('05 July 2021 14:30 UTC').toISOString(),
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
        registeredAt: new Date('30 January 2017 11:48 UTC').toISOString(),
        lastLoggedAt: new Date('13 August 2021 21:08 UTC').toISOString(),
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
        registeredAt: new Date('05 October 2015 14:48 UTC').toISOString(),
        lastLoggedAt: new Date('15 October 2020 10:12 UTC').toISOString(),
        resetPwdMarker: '',
        refreshToken: '',

        friends: [],
        initiatedCon: [],
        undecidedCon: []
    }
]