import { loadSeasonFixtures, loadMatchdayData } from '../imports/api/datafeed';

function init() {
    //const season = 7953; //Scottish Premiership
    const season = 6361; //Danish Superligaen

    loadSeasonFixtures(season).then( result => {
        let md = 0;
        try {
            //Extract league object from result for later use
            const league = result.data.league.data;
            
            //Extract rounds object from result for later use
            const rounds = result.data.rounds.data;
            
            //Update season data in local db
            updateSeason(league);

            //Get current matchday (round)
            //TODO: Might need a better way to do this as seems that API 
            //provided current round id not accurate when fixtures postponed
            md = league.current_round_id;

            rounds.forEach( round => {
                const fixtures = round.fixtures.data;

                fixtures.forEach( fixture => {
                    //Update fixture data in local db
                    updateMatchdayFixtures(fixture, round.name)
                });
                
            });
            
            pollForMatchdayData(season, md);
        } catch (err) {
            Log.error("Error processing fixtures for season: " + season, err);
        }

    });
}

function pollForMatchdayData(season, md) {

    loadMatchdayData(md).then( result => {

        //Assign poll interval to default
        let interval = Meteor.settings.private.MATCHDAY_POLL_INTERVAL;

        try {
            //Update season data in local db
            updateSeason(result.data.league.data);

            const fixtures = result.data.fixtures.data;
            const matchday = result.data.name;
            let status = "";

            fixtures.forEach( fixture => {

                updateMatchdayFixtures(fixture, matchday)
                
                status = fixture.time.status;

                //If there is a match ongoing, set polling interval to live value
                if (interval !== Meteor.settings.private.MATCHDAY_POLL_INTERVAL_LIVE && (status === "LIVE" || status === "HT")) {
                    interval = Meteor.settings.private.MATCHDAY_POLL_INTERVAL_LIVE;
                    Log.info("Ongoing match with status: " + status + ". Setting polling interval to live");
                }
            })
            
            //Get current matchday (round) id from the latest API call 
            const newMd = result.data.season.data.current_round_id;
            
            //Check if the matchday has been changed
            if (newMd && newMd !== md) {
                //Replace old matchday value with the new one
                md = newMd;
                Log.info("Matchday id changed from: " + md + " to: " + newMd);
            }
            
        } catch (err) {
            Log.error("Error processing fixtures for season: " + season, err);
        }

        //Call function again after polling interval
        Meteor.setTimeout(() => { pollForMatchdayData(season, md) }, interval);
    });
}

function updateMatchdayFixtures(fixture, matchday) {
    //Add matchday name as part of fixture object
    fixture.round_name = matchday;
    
    //Update fixture in local db or add new if doesn't exist
    Fixtures.update({
        "fixture.id": fixture.id
    },
    {
        fixture
    },
    {
        upsert: true
    });   

}

function updateSeason(season) {
    Seasons.update({
        "id": season.current_season_id
    },
    {
        "id": season.current_season_id,
        "league_id": season.id,
        "league_name": season.name,
        "current_round_id": season.current_round_id
    },
    {
        upsert: true
    });   
}

export { init }