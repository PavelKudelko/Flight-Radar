require('dotenv').config();

const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { typeDefs } = require('./schema.js');
const resolvers = require('./resolvers.js');


const PORT = 4000;

const startServer = async () => {
    // config the server
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    const { url } = await startStandaloneServer(server, {
        listen: { port: PORT },
    });

    console.log(`🚀 GraphQL ready at ${url}`);
};

startServer();
