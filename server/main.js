import { Meteor } from 'meteor/meteor';

import { createApolloServer } from 'meteor/apollo'
import { makeExecutableSchema } from 'graphql-tools';

import { init } from './load_data'
import { schema } from '../imports/api/schema';
import { logger } from './helpers/logger';

import { loadSeasonMatchdays, loadMatchdayData, loadSeasonFixtures, loadSeasonTeams } from '../imports/api/datafeed';
import { SportmonksApi } from '../imports/api/sportmonks';

Meteor.startup(() => {
  //Define logger object
  Log = logger;
  Log.info("Loggly logger started");

  Sportmonks = new SportmonksApi( Meteor.settings.private.SPORTMONKS_API, 
                                  Meteor.settings.private.SPORTMONKS_API_TOKEN);
  Log.info("Sportmonks object created");

  //Start Apollo server 
  createApolloServer({
    schema,
  });

  Log.info("Apollo server started");

  /*
  loadSeasonMatchdays(7953).then( result => {
    //console.log(result);
  });

  
*/
/*
  loadSeasonTeams(7953).then( result => {
    //console.log(result);
  });
*/
   //Start init sequence
  Log.info("Starting initialisation sequence");
  init();

});
