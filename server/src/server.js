import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { schema } from './schema';
import connectMongo from './mongo-connector';
import { authenticate } from './authentication';
import formatError from './formatError';
import {execute, subscribe} from 'graphql';
import {createServer} from 'http';
import {SubscriptionServer} from 'subscriptions-transport-ws';
import cors from 'cors';

const start = async () => {
    
    const mongo = await connectMongo();
    const app = express();
    const PORT = process.env.PORT;
    const HOST = process.env.C9_HOSTNAME;
    
    const buildOptions = async (req, res) => {
    const user = await authenticate(req, mongo.Users);
    return {
      context: {
          mongo, 
          user,
      },
      formatError,
      schema,
    };
  };
    app.use('*', cors({ origin: `https://${HOST}` }));
    app.use('/graphql', bodyParser.json(), graphqlExpress(buildOptions));

    app.use('/graphiql', graphiqlExpress({
        endpointURL: '/graphql',
        passHeader: `'Authorization': 'bearer token-ben@gmail.com'`,
        subscriptionsEndpoint: `ws://how-to-graphql-js-benjaminadk.c9users.io:${PORT}/subscriptions`,
    }));

    
    const ws = createServer(app);
    ws.listen(PORT, () => {
        console.log(`HackerNews is up on PORT: ${PORT}`);
        new SubscriptionServer({
            execute, 
            subscribe, 
            schema
            },{
            server: ws, 
            path: '/subscriptions'
            });
    });
};

start();



