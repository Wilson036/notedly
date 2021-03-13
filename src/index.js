// index.js
// This is the main entry point of our application
const { ApolloServer } = require('apollo-server-express');
const depthLimit = require('graphql-depth-limit');
const { createComplexityLimitRule } = require('graphql-validation-complexity');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const jwt = require('jsonwebtoken');
const express = require('express');
require('dotenv').config();
const db = require('./db');

const models = require('./models');
const helmet = require('helmet');
const cors = require('cors');

const DB_HOST = process.env.DB_HOST;
const port = process.env.PORT || 4000;

const app = express();
db.connect(DB_HOST);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
    context: ({ req }) => {
        const token = req.headers.authorization;
        const user = getUser(token);
        console.log('user', user);
        return { models, user };
    },
});
server.applyMiddleware({ app, path: '/api' });

app.use(helmet());
app.use(cors());

app.get('/', (req, res) => res.send('hello world33'));
app.listen({ port }, () => console.log(`port is ${port}`));

const getUser = token => {
    if (token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            console.log('error', err);
            throw new Error('session error');
        }
    }
};
