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
        Log.error("Failed to load matchday data: ", err);
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
        
    return result.data.fixtures;
    } catch (err) {
        Log.error("Failed to load initial fixtures: ", err);
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
        Log.error("Failed to load Teams: ", err);
        return null;
    }
};

export { loadMatchdays, loadInitialFixtures, loadMatchdayData, loadTeams };