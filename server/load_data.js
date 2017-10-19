import { loadInitialFixtures, loadTeams } from '../imports/api/football-data';

Meteor.startup(function () {
    const compId = Meteor.settings.private.RESULTS_FEED_COMPETITION_ID;

    //Load teams into local database
    initLoadTeams(compId);

    //Load fixtures into local database
    initLoadFixtures(compId);
    
});

function parseLastStringFromLink (link) {
    const last = link.split("/").slice(-1)[0];
    return last;    
}

function getFixtureExternalId (link) {
    const extId = parseInt(parseLastStringFromLink(link));
    
    if (Number.isInteger(extId)) {
        return extId;
    } else {
        console.log("Fixture external Id not an integer: " + extId);
        return 0;
    }
}

function initLoadTeams(compId) {
    var url = Meteor.settings.private.RESULTS_FEED_API + "competitions/" + compId + "/teams";
    var newTeams = loadTeams(url);

    console.log("Start loading Teams for competition " + compId + ". Count: " + Teams.find().count());

    newTeams.forEach(function(team){

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

function initLoadFixtures(compId) {
    var url = Meteor.settings.private.RESULTS_FEED_API + "competitions/" + compId + "/fixtures";
    var fixtures = loadInitialFixtures(url);

    console.log("Start loading Fixtures for competition: " + compId + ". Count: " + Fixtures.find().count());

    fixtures.forEach(function(fixture){
        
        var teams = Teams.find().fetch();
        var extId = parseLastStringFromLink(fixture._links.self.href);

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