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
    }
    type Mutation {
        login(email: String!, password: String!): User!
        registration(email: String!, password: String!, passwordconf: String!, username: String!): User!
    }
`;
