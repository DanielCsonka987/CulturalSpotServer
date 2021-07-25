const profAPI = require('./resolvers/profileRes')

module.exports = {
    Query: {
        testquery(_, args){
            console.log('Server is running fine!')
            return 'Server is running fine!'
        },
    },
    Mutation: {
        ...profAPI.Mutation
    }
}
