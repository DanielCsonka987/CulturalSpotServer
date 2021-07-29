const accountAPI = require('./resolvers/accountResolvers')
const friendsAPI = require('./resolvers/friendsResolvers')
const postsAPI = require('./resolvers/postsResolvers')
const chainings = require('./resolvers/chainingResolvers')

module.exports = {
    ...chainings,
    Query: {
        testquery(_, args){
            console.log('Server is running fine!')
            return 'Server is running fine!'
        },
        ...friendsAPI.Query,
        ...postsAPI.Query
    },
    Mutation: {
        ...accountAPI.Mutation,
        ...friendsAPI.Mutation,
        ...postsAPI.Mutation
    }
}
