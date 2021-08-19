const { AuthenticationError, UserInputError, ApolloError  } = require('apollo-server-express')
const MongooseID = require('mongoose').Types.ObjectId

const { authorizEvaluation } = require('./resolveHelpers')

module.exports = {
    Query: {
        async listOfTheseComments(_, args, { authorizRes, dataSources }){
            args.targeted
            args.ids
        }
    },
    Mutation: {
        async createCommentToHere(_, args, { authorizRes, dataSources }){
            args.targeted
            args.id,
            args.content
        },        
        async createSentimentToHere(_, args, { authorizRes, dataSources }){
            args.targeted
            args.id
            args.content
        },
        async updateCommentContent(_, args, { authorizRes, dataSources }){
            args.targeted
            args.id,
            args.commentid,
            args.content
        },
        async updateSentimentContent(_, args, { authorizRes, dataSources }){
            args.targeted
            args.id
            args.sentimentid,
            args.content
        },
        async deleteThisComment(_, args, { authorizRes, dataSources }){
            args.targeted
            args.id,
            args.commentid
        },
        async deleteThisSentiment(_, args, { authorizRes, dataSources }){
            args.targeted
            args.id
            args.sentimentid
        }
    }
}