// index.js
// This is the main entry point of our application
const {ApolloServer, gql} = require('apollo-server-express')
const express  = require('express');
const app = express();
const port = process.env.PORT ||4000 ; 

const typeDefs = gql`
    type Query{
        hello: String
    }
`;

const resolvers = {
    Query:{
        hello: () => 'hello world!'
    }
}

const server = new ApolloServer({typeDefs , resolvers});
server.applyMiddleware({app, path: '/api'});
app.get('/', (req, res) =>res.send('hello world33'));
app.listen({port} ,() => console.log(`port is ${port}`));
