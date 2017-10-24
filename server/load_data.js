import { loadSeasonFixtures, loadSeasonTeams, loadSeasonMatchdays, loadMatchdayData } from '../imports/api/datafeed';

function init() {
    const season = 7953;
    let md = 0;

    loadSeasonFixtures(season).then( result => {

        try {
            const league = result.data.league.data;
            const rounds = result.data.rounds.data;

            md = league.current_round_id;
            console.log(md);

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

        try {
            const fixtures = result.data.fixtures.data;
            
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
            })
            
            console.log("Fixture count: " + Fixtures.find().count());
        } catch (err) {
            Log.error("Error processing fixtures for season: " + season, err);
        }

        //TODO: recalculate matchday for next run

        Meteor.setTimeout(() => { pollForMatchdayData(season, md) }, Meteor.settings.private.MATCHDAY_POLL_INTERVAL);
    });

/*
    //Set new timeout for next run of the function.
    //If there is a match in progress then timeout
    //will be shorter
    if (currentFixture.status === "IN_PLAY") {
        Meteor.setTimeout(() => { pollForMatchdayData(url, compId) }, Meteor.settings.private.MATCHDAY_POLL_INTERVAL_LIVE);
    } else {
        Meteor.setTimeout(() => {pollForMatchdayData(url, compId)}, Meteor.settings.private.MATCHDAY_POLL_INTERVAL);
    }
*/
}

export { init }