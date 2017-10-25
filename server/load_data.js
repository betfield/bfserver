import { loadSeasonFixtures, loadMatchdayData } from '../imports/api/datafeed';

function init() {
    const season = 7953;

    loadSeasonFixtures(season).then( result => {
        let md = 0;
        //TODO: check paging as manual says only 100 fixtures per page
        try {
            const league = result.data.league.data;
            const rounds = result.data.rounds.data;

            //Get current matchday (round)
            md = league.current_round_id;

            rounds.forEach( round => {
                let fixtures = round.fixtures.data;

                fixtures.forEach( fixture => {

                    Fixtures.update({
                        "fixture.id": fixture.id
                    },
                    {
                        fixture
                    },
                    {
                        upsert: true
                    });   

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
            const fixtures = result.data.fixtures.data;
            let status = "";

            fixtures.forEach( fixture => {

                Fixtures.update({
                    "fixture.id": fixture.id
                },
                {
                    fixture
                },
                {
                    upsert: true
                });
                
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

export { init }