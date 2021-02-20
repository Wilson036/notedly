const { gql } = require('apollo-server-express');

const typeDefs = gql`
    scalar DateTime
    
    type Note{
        id: ID!
        content: String!
        author: String!
        createdAt: DateTime!
        updatedAt: DateTime!
    }

    type User{
        id: ID!
        username: String!
        email: String!
        avatar: String!
        notes:[Note!]!
    }

    type Query{
        notes:[Note!]!
        note(id: ID!):Note!
    }

    type Mutation{ 
        newNote(content:String! , author:String): Note!
        updateNote(id:ID!,content:String!): Note!
        deleteNote(id:ID):Boolean!
        singUp(username:String!,email:String!,password:String!):String!
        singIn(username:String,email:String,password:String):String!
    }
`;

module.exports = typeDefs;
