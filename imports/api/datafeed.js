/*
    Sportmonks.get(endpoint,params).then( function(resp){
        //resp.data will contain your data 
        //resp.meta will contain the meta informations 
        console.log(resp);
    });

*/

function loadMatchdayData(md) {
    return Sportmonks.get("v2.0/rounds/{id}", {
        "id": md, 
        "league": true,
        "season": true, 
        "fixtures.localTeam": true, 
        "fixtures.visitorTeam": true,
        "fixtures.venue": true,
        "fixtures.referee": true,
        "fixtures.stats": true
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
        "rounds.fixtures.venue": true,
        "rounds.fixtures.referee": true,
        "rounds.fixtures.stats": true
    }).catch( err => {
        Log.error("Failed to load fixtures for season: " + season, err);
    });
};

export { loadSeasonFixtures, loadMatchdayData };