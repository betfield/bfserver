import { loadInitialFixtures, loadTeams, loadMatchdayData } from '../imports/api/datafeed';

const compId = Meteor.settings.private.RESULTS_FEED_COMPETITION_ID;
const fixturesUrl = Meteor.settings.private.RESULTS_FEED_API + "competitions/" + compId + "/fixtures";
const teamsUrl = Meteor.settings.private.RESULTS_FEED_API + "competitions/" + compId + "/teams";

function init() {
    //Start init sequence by loading teams into local database
    initLoadTeams(teamsUrl, compId);
}

function pollForMatchdayData(url, compId) {
    const currentFixture = getCurrentFixture(compId);
    const matchdayFixtures = loadMatchdayData(url, currentFixture.matchday);

    if (matchdayFixtures !== null) {
        let counter = 0;

        //Update matchday fixtures that are not finished
        matchdayFixtures.forEach((mdFixture) => {
            if (mdFixture.status !== "FINISHED") {
                let extId = parseLastStringFromLink(mdFixture._links.self.href);

                Fixtures.update({
                    "extId": extId
                },
                {
                    $set: {
                        matchday: mdFixture.matchday,
                        date: new Date(mdFixture.date),
                        result: mdFixture.result,
                        status: mdFixture.status
                    }
                });

                counter++;
        
                //TODO: Implement cache for IN_PLAY fixtures to only update the score when needed


                if (mdFixture.status === "IN_PLAY") {
                    Log.data("In play fixture updated (extId: " + extId + ", homeTeamScore: " + mdFixture.result.goalsHomeTeam + ", awayTeamScore: " + mdFixture.result.goalsAwayTeam + ")", mdFixture);
                }
            }
        });
        Log.info("Matchday fixtures updated: " + counter);
    }

    //Set new timeout for next run of the function.
    //If there is a match in progress then timeout
    //will be shorter
    if (currentFixture.status === "IN_PLAY") {
        Meteor.setTimeout(() => {pollForMatchdayData(url, compId)}, Meteor.settings.private.MATCHDAY_POLL_INTERVAL_LIVE);
    } else {
        Meteor.setTimeout(() => {pollForMatchdayData(url, compId)}, Meteor.settings.private.MATCHDAY_POLL_INTERVAL);
    }
}

function parseLastStringFromLink (link) {
    const last = link.split("/").slice(-1)[0];
    return last;    
}

function getFixtureExternalId(link) {
    const extId = parseInt(parseLastStringFromLink(link));
    
    if (Number.isInteger(extId)) {
        return extId;
    } else {
        Log.info("Fixture external Id not an integer: " + extId);
        return 0;
    }
}

function getCurrentFixture(compId) {
    //Return first fixture that has a start date not older than 2 hours ago and not with finished status
    const date = new Date(new Date().setTime(new Date().getTime()-2*60*60*1000));
    return Fixtures.findOne({
            "competition": compId, 
            "status": {$ne: "FINISHED"}, 
            "date": {$gte: date}
        },
        { 
            "sort": {
                "date": 1,
                "limit": 1
            }
        });
}

function initLoadTeams(url, compId) {
    const newTeams = loadTeams(url);

    //If loading teams succeeded, update these in the local DB
    if (newTeams !== null) {
        Log.info("Start loading Teams for competition " + compId + ". Count: " + Teams.find().count());

        newTeams.forEach((team) => {

            Teams.update({
                    competition: compId,
                    name: team.name
                },
                {
                    competition: compId,
                    name: team.name,
                    code: team.code,
                    shortName: team.shortName,
                    logoUrl: team.crestUrl
                },
                {
                    //Insert new document if team with the name does not exist
                    upsert: true
                }
            );

        }); // end of foreach Fixtures

        Log.info("Finished loading Teams for competition " + compId + ". Count: " + Teams.find().count());

        //Move to the next function and load fixtures into local database
        initLoadFixtures(fixturesUrl, compId);
        
    } else {
        Log.info("No teams found. Waiting to load again..");
        Meteor.setTimeout(() => {initLoadTeams(url, compId)}, Meteor.settings.private.INIT_POLL_INTERVAL);
    }
}

function initLoadFixtures(url, compId) {
    const fixtures = loadInitialFixtures(url);

    //If succeeded in loading fixtures, load them into local DB
    if (fixtures !== null) {
        Log.info("Start loading Fixtures for competition: " + compId + ". Count: " + Fixtures.find().count());

        const teams = Teams.find().fetch();

        fixtures.forEach((fixture) => {
            const extId = parseLastStringFromLink(fixture._links.self.href);

            Fixtures.update({
                    competition: compId,
                    extId: extId
                },
                {
                    extId: extId,
                    competition: compId,
                    matchday: fixture.matchday,
                    date: new Date(fixture.date),
                    homeTeam: teams.find((element) => element.name === fixture.homeTeamName),
                    awayTeam: teams.find((element) => element.name === fixture.awayTeamName),
                    result: fixture.result,
                    status: fixture.status
                },
                {
                    upsert: true
                }
            );
        }); // end of foreach Fixtures

        Log.info("Finished loading Fixtures for competition: " + compId + ". Count: " + Fixtures.find().count());

        //Start polling the competition for current matchday changes
        pollForMatchdayData(fixturesUrl, compId);

    } else {
        Log.info("No fixtures found. Waiting to load again..");
        Meteor.setTimeout(() => {initLoadFixtures(url, compId)}, Meteor.settings.private.INIT_POLL_INTERVAL);
    }
}

export { init }