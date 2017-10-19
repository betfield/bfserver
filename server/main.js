import { Meteor } from 'meteor/meteor';

import { createApolloServer } from 'meteor/apollo'
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';

import { schema } from '../imports/api/schema';
import { loadMatchdayData } from '../imports/api/football-data';

Meteor.startup(() => {

  createApolloServer({
    schema,
  });
  
  var url = Meteor.settings.private.RESULTS_FEED_API + "competitions/" + Meteor.settings.private.RESULTS_FEED_COMPETITION_ID + "/fixtures";
  var md = 8;

  const interval = Meteor.setInterval(() => {
      return loadMatchdayData(url, md);
    },
    Meteor.settings.private.MATCHDAY_POLL_INTERVAL);

});
