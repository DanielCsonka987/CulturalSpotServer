const { gql } = require('apollo-server')

module.exports = gql`
    type Login {
        email: String!
        password: String!
    }
    type User {
        id: String!
        email: String!
        username: String!
        token: String!
        registeredAt: String!
    }
    type Query {
        testquery: String!
        login(username: String!, password: String!): User!
    }
`;
