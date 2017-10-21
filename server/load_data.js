import { loadInitialFixtures, loadTeams, loadMatchdayData } from '../imports/api/datafeed';

Meteor.startup(function () {
    const compId = Meteor.settings.private.RESULTS_FEED_COMPETITION_ID;
    const fixturesUrl = Meteor.settings.private.RESULTS_FEED_API + "competitions/" + compId + "/fixtures";
    const teamsUrl = Meteor.settings.private.RESULTS_FEED_API + "competitions/" + compId + "/teams";
    
    //Load teams into local database
    initLoadTeams(teamsUrl, compId);

    //Load fixtures into local database
    initLoadFixtures(fixturesUrl, compId);

    //Start polling the competition for current matchday changes
    pollForMatchdayData(fixturesUrl, compId);

});

function pollForMatchdayData(url, compId) {
    const currentFixture = getCurrentFixture(compId);
    
    try {
        const matchdayFixtures = loadMatchdayData(url, currentFixture.matchday).fixtures;

        let counter = 0;
        //Update matchday fixtures that are not finished
        matchdayFixtures.forEach((mdFixture) => {
            if (mdFixture.status !== "FINISHED") {
                Fixtures.update({
                    "extId": mdFixture.extId
                },
                {
                    matchday: mdFixture.matchday,
                    date: mdFixture.date,
                    homeTeam: mdFixture.homeTeamName,
                    awayTeam: mdFixture.awayTeamName,
                    result: mdFixture.result,
                    status: mdFixture.status
                });

                counter++;
            }
        });

        console.log("Matchday fixtures updated: " + counter);
    } catch (err) {
        console.log("Error loading matcday data: " + err.message);
        console.log(err.stack);
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
        console.log("Fixture external Id not an integer: " + extId);
        return 0;
    }
}

function getCurrentFixture(compId) {
   return Fixtures.findOne({"competition": compId, "status": {$ne: "FINISHED"}}, {$orderby: {date: 1}});
}

function initLoadTeams(url, compId) {
    const newTeams = loadTeams(url).teams;

    console.log("Start loading Teams for competition " + compId + ". Count: " + Teams.find().count());

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

    console.log("Finished loading Teams for competition " + compId + ". Count: " + Teams.find().count());
}

function initLoadFixtures(url, compId) {
    const fixtures = loadInitialFixtures(url).fixtures;

    console.log("Start loading Fixtures for competition: " + compId + ". Count: " + Fixtures.find().count());

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

    console.log("Finished loading Fixtures for competition: " + compId + ". Count: " + Fixtures.find().count());
}