import { Meteor } from 'meteor/meteor';

import { createApolloServer } from 'meteor/apollo'
import { makeExecutableSchema } from 'graphql-tools';

import { init } from './load_data'
import { schema } from '../imports/api/schema';
import { logger } from './helpers/logger';

Meteor.startup(() => {
  //Define logger object
  Log = logger;
  Log.info("Loggly logger started");

  //Start init sequence
  Log.info("Starting initialisation sequence");
  init();

  //Start Apollo server 
  createApolloServer({
    schema,
  });

  Log.info("Apollo server started");

});
