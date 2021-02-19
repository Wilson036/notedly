// index.js
// This is the main entry point of our application
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const express = require('express');
require('dotenv').config();
const db = require('./db');

const models = require('./models');


const DB_HOST = process.env.DB_HOST;
const port = process.env.PORT || 4000;

const app = express();
db.connect(DB_HOST);

const server = new ApolloServer({ typeDefs, resolvers, context: () => ({ models }) });
server.applyMiddleware({ app, path: '/api' });

app.get('/', (req, res) => res.send('hello world33'));
app.listen({ port }, () => console.log(`port is ${port}`));
