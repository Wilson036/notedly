// index.js
// This is the main entry point of our application
const {ApolloServer, gql} = require('apollo-server-express')
const express  = require('express');
require('dotenv').config();
const db = require('./db');

const models = require('./models');


const DB_HOST = process.env.DB_HOST;
const port = process.env.PORT ||4000 ; 


const typeDefs = gql`
    type Note{
        id: ID!
        content: String!
        author: String!
    }

    type Query{
        hello: String!
        notes:[Note!]!
        note(id: ID!):Note!
    }

    type Mutation{ 
        newNote(content:String! , author:String): Note!
    }
`;

const resolvers = {
    Query:{
        hello: () => 'hello world!',
        notes: async () => {
            return await models.Note.find();
        } ,
        note: async (parent , args) => {
            return await models.Note.findById(args.id);
        }
    },
    Mutation:{
        newNote: async(parent, args) => {
            return  await models.Note.create({
                content:args.content,
                author:'test'
            });
        }
    }
};
const app = express();
db.connect(DB_HOST);

const server = new ApolloServer({typeDefs , resolvers});
server.applyMiddleware({app, path: '/api'});

app.get('/', (req, res) =>res.send('hello world33'));
app.listen({port} ,() => console.log(`port is ${port}`));
