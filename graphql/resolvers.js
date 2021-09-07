const accountAPI = require('./resolvers/accountResolvers')
const friendsAPI = require('./resolvers/friendsResolvers')
const postsAPI = require('./resolvers/postsResolvers')
const commentAPI = require('./resolvers/commentResolvers')
const chattingAPI = require('./resolvers/chattingResolvers')
const sentimentAPI = require('./resolvers/sentimentResolvers')
const chainings = require('./resolvers/chainingResolvers')

module.exports = {
    ...chainings,
    Query: {
        testquery(_, args){
            console.log('Server is running fine!')
            return 'Server is running fine!'
        },
        ...accountAPI.Query,
        ...friendsAPI.Query,
        ...postsAPI.Query,
        ...commentAPI.Query,
        ...sentimentAPI.Query,
        ...chattingAPI.Query
    },
    Mutation: {
        ...accountAPI.Mutation,
        ...friendsAPI.Mutation,
        ...postsAPI.Mutation,
        ...commentAPI.Mutation,
        ...sentimentAPI.Mutation,
        ...chattingAPI.Mutation
    }
}
