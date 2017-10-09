import { Meteor } from 'meteor/meteor';

import { createApolloServer } from 'meteor/apollo'
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';

import { schema } from '../imports/api/schema';
import { getFixtures} from '../imports/api/football-data';
/*import express from 'express';

import {
  graphqlExpress,
  graphiqlExpress,
} from 'graphql-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';


import { execute, subscribe } from 'graphql';

import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
*/
Meteor.startup(() => {

  createApolloServer({
    schema,
  });

  const myMockServer = addMockFunctionsToSchema({ 
    schema,
    mocks: {
      Date: () => new Date("2017-10-07"),
    },
    preserveResolvers: true
  });

  getFixtures(445);

/*  const PORT = 4002;
  const server = express();
  
  server.use('*', cors({ origin: 'http://localhost:3004' }));
  
  server.use('/graphql', bodyParser.json(), graphqlExpress({
    schema
  }));
  
  server.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:4002/subscriptions`
  }));
  
  // We wrap the express server so that we can attach the WebSocket for subscriptions
  const ws = createServer(server);
  
  ws.listen(PORT, () => {
    console.log(`GraphQL Server is now running on http://localhost:${PORT}`);
  
    // Set up the WebSocket for handling GraphQL subscriptions
    new SubscriptionServer({
      execute,
      subscribe,
      schema
    }, {
      server: ws,
      path: '/subscriptions',
    });
  });*/
});
