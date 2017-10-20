import { Meteor } from 'meteor/meteor';

import { createApolloServer } from 'meteor/apollo'
import { makeExecutableSchema } from 'graphql-tools';

import { schema } from '../imports/api/schema';

Meteor.startup(() => {

  createApolloServer({
    schema,
  });
  
});
