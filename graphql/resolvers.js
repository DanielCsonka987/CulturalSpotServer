

module.exports = {
    Query: {
        testquery(_, __){
            return 'Server running fine!'
        },
        login(_, args){
            console.log(args)
            return {
                id: 'testid',
                email: 'test@gmail.com',
                username: 'strgTo Test this',
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
                registeredAt: new Date().toISOString()
            }
        }
    }
}
