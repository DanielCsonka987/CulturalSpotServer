const profAPI = require('./resolvers/profileRes')

module.exports = {
    Query: {
        testquery(_, args){
            console.log(args)
            return 'Server running fine!'
        },
    },
    Mutation: {
        ...profAPI.Mutation
    }
}
