import { HTTP } from 'meteor/http';

function loadMatchdayData(url, md) {

    try {
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
    } catch (err) {
        console.log("Failed to load matchday data: " + err.message);
        console.log(err.stack);
        return null;
    }
    
};

function loadInitialFixtures(url) {
    
    try {
        const result = HTTP.call( 'GET', url, 
            {
            headers: {
                "X-Auth-Token": Meteor.settings.private.RESULTS_FEED_KEY
            }});
        
        console.log(url);
    return result.data.fixtures;
    } catch (err) {
        console.log("Failed to load initial fixtures: " + err.message);
        console.log(err.stack);
        return null;
    }
};

function loadTeams(url) {

    try {
        const result = HTTP.call( 'GET', url,
            {
            headers: {
            "X-Auth-Token": Meteor.settings.private.RESULTS_FEED_KEY
            }});

        return result.data.teams;
    } catch (err) {
        console.log("Failed to load Teams: " + err.message);
        console.log(err.stack);
        return null;
    }
};

export { loadInitialFixtures, loadMatchdayData, loadTeams };