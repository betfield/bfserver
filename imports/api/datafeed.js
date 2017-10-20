import { HTTP } from 'meteor/http';

function loadMatchdayData(url, md) {
    
    const result = HTTP.call( 'GET', url, 
        {
        headers: {
            "X-Auth-Token": Meteor.settings.private.RESULTS_FEED_KEY
        },
        params: {
            "matchday": md
        }
        });

    return fixtureSet = result.data.fixtures;
};

function loadInitialFixtures(url) {
    
    //TODO: add error handlers

    const result = HTTP.call( 'GET', url, 
        {
        headers: {
            "X-Auth-Token": Meteor.settings.private.RESULTS_FEED_KEY
        }});
    
    console.log(url);
    return result.data.fixtures;
};

function loadTeams(url) {
    console.log(url);
    
    const result = HTTP.call( 'GET', url,
        {
        headers: {
        "X-Auth-Token": Meteor.settings.private.RESULTS_FEED_KEY
        }});

    return result.data.teams;
};

export { loadInitialFixtures, loadMatchdayData, loadTeams };