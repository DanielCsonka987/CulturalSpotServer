const { AuthenticationError, ApolloError } = require('apollo-server-express')

const { authorizEvaluation } = require('./resolveHelpers')
const {  } 
    = require('../../utils/inputRevise')
const { notifyTypes } = require('../../extensions/dinamicClientNotifier/userNotifierUnit')


module.exports = {
    Query: {
        async listOfMessagesFromChatting(_, args, { authorizRes, dataSources }){
            authorizEvaluation(authorizRes)
        }
    },
    Mutation: {
        async createChatRoom(_, args, { authorizRes, dataSources, wsNotifier }){
            authorizEvaluation(authorizRes)

        },
        async addPartnersToChatRoom(_, args, { authorizRes, dataSources, wsNotifier }){
            authorizEvaluation(authorizRes)

        },
        async sendNewMessage(_, args, { authorizRes, dataSources, wsNotifier }){
            authorizEvaluation(authorizRes)

        },
        async removePartnersFromChatRoom(_, args, { authorizRes, dataSources, wsNotifier }){
            authorizEvaluation(authorizRes)

        },
        async updateChatRoom(_, args, { authorizRes, dataSources, wsNotifier }){
            authorizEvaluation(authorizRes)

        },
        async deleteChatRoom(_, args, { authorizRes, dataSources, wsNotifier }){
            authorizEvaluation(authorizRes)

        },
        async updateThisMessage(_, args, { authorizRes, dataSources, wsNotifier }){
            authorizEvaluation(authorizRes)

        },
        async deleteThisMessage(_, args, { authorizRes, dataSources, wsNotifier }){
            authorizEvaluation(authorizRes)

        }
    }
}