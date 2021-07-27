const { gql } = require('apollo-server-express')

module.exports = gql`

    type UserLog {
        id: String!
        email: String!
        username: String!
        token: String!
        tokenExpire: Int!
        registeredAt: String!
        lastLoggedAt: String!
    }

    type UserPublic {
        id: String!
        email: String!
        username: String!
    }
    type ProfileProcess {
        resultText: String!
        id: String!
        email: String!
        username: String!
    }
    type Query {
        testquery: String!
    }
    type Mutation {
        login(email: String!, password: String! ): UserLog!
        registration( email: String!, username: String!, password: String!, passwordconf: String! ): UserLog!
        resetPassword(email: String!): ProfileProcess!
        changePassword(oldpassword: String!, newpassword: String!, newconf: String!): ProfileProcess!
        changeAccountDatas(username: String! ): ProfileProcess!
        deleteAccount(password: String!, passwordconf: String!): ProfileProcess!
    }
`;
