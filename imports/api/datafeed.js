/*
    Sportmonks.get(endpoint,params).then( function(resp){
        //resp.data will contain your data 
        //resp.meta will contain the meta informations 
        console.log(resp);
    });

*/

function loadSeasonMatchdays(season) {
    return Sportmonks.get("v2.0/rounds/season/{id}", {
        "id": season
    }).catch( err => {
        Log.error("Failed to load matchdays for season: " + season, err);
    });
};

function loadMatchdayData(md) {
    return Sportmonks.get("v2.0/rounds/{id}", {
        "id": md, 
        "league": true, 
        "fixtures.localTeam": true, 
        "fixtures.visitorTeam": true
    }).catch( err => {
        Log.error("Failed to load data for matchday: " + md, err);
    });
};

function loadSeasonFixtures(season) {
    return Sportmonks.get("v2.0/seasons/{id}", {
        "id": season, 
        "league": true, 
        "rounds.fixtures.localTeam": true,
        "rounds.fixtures.visitorTeam": true,
        "rounds.fixtures.stats": true
    }).catch( err => {
        Log.error("Failed to load fixtures for season: " + season, err);
    });
};

function loadSeasonTeams(season) {
    return Sportmonks.get("v2.0/teams/season/{id}", {
        "id": season, 
        "squad.player": true
    }).catch( err => {
        Log.error("Failed to load teams for season: " + season, err);
    });
};

export { loadSeasonMatchdays, loadSeasonFixtures, loadMatchdayData, loadSeasonTeams };