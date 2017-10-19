import { HTTP } from 'meteor/http';

function loadMatchdayData(url, md) {
    console.log(url);
    
    var result = HTTP.call( 'GET', url, 
        {
        headers: {
            "X-Auth-Token": Meteor.settings.private.RESULTS_FEED_KEY
        },
        params: {
            "matchday": md
        }
        });

    var fixtureSet = result.data;

    //TODO: add handler for persisting matchday data and changes

    /*
    fixtureSet.forEach((fixture) => {
    if (publishedKeys[doc._id]) {
        this.changed(COLLECTION_NAME, doc._id, doc);
    } else {
        publishedKeys[doc._id] = true;
        this.added(COLLECTION_NAME, doc._id, doc);
    }
    });
    */
};

function loadInitialFixtures(url) {
    
    //TODO: add error handlers

    var result = HTTP.call( 'GET', url, 
        {
        headers: {
            "X-Auth-Token": Meteor.settings.private.RESULTS_FEED_KEY
        }});
    
    console.log(url);
    return result.data.fixtures;
};

function loadTeams(url) {
    console.log(url);
    
    var result = HTTP.call( 'GET', url,
        {
        headers: {
        "X-Auth-Token": Meteor.settings.private.RESULTS_FEED_KEY
        }});

    return result.data.teams;
};

export { loadInitialFixtures, loadMatchdayData, loadTeams };