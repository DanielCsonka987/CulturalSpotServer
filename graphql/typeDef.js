const { gql } = require('apollo-server')

module.exports = gql`
    input LoginInput {
        email: String!
        password: String!
    }
    input RegistrationInput {
        email: String!
        password: String!
        passwordconf: String!
         username: String!
    }
    input ChangePwdInput {
        oldpassword: String!
        passwordconf: String!
        newpassword: String! 
    }
    input DelAccountInput{
        password: String!
        passwordconf: String! 
    }
    type User {
        id: String!
        email: String!
        username: String!
        token: String!
        registeredAt: String!
    }
    type ProfileProcess {
        id: String!
        processResult: Boolean!
        resultText: String!
    }
    type Query {
        testquery: String!
    }
    type Mutation {
        login(loginInput: LoginInput): User!
        registration(registrationInput: RegistrationInput ): User!
        resetPassword(email: String!): ProfileProcess!
        changePassword(changePwdInput: ChangePwdInput): ProfileProcess!
        changeAccountDatas(username: String! ): ProfileProcess!
        deleteAccount(delAccountInput: DelAccountInput): ProfileProcess!
    }
`;
