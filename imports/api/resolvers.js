import GraphQLDate from 'graphql-date';

export const resolvers = {
    Date: GraphQLDate,
    Query: {
        fixtures: (_, { season }) => {
            Log.info("Loading Query (fixtures) for season: " + season);

            try {
                const fixtures = Fixtures.find({ "fixture.season_id": season }).fetch();
                return adjustFixtureValues(fixtures);
            } catch (err) {
                Log.error("Failed to load Query (fixtures)", err);
                return null;
            }
        },
        matchdayFixtures: (_, { season, matchday }) => {
            Log.info("Loading Query (matchdayFixtures) for season: " + season + ", matchday: " + matchday);
            
            try {
                const fixtures = Fixtures.find({ "fixture.season_id": season, "fixture.round_id": matchday }).fetch();
                return adjustFixtureValues(fixtures);
            } catch (err) {
                Log.error("Failed to load Query (matchdayFixtures)", err);
                return null;
            }
        }
    },
};

function adjustFixtureValues(fixtures) {
    let res = [];
    
    fixtures.forEach( e => {
        let result = null;

        let fixture = {
            "id": e.fixture.id,
            "league_id": e.fixture.league_id,
            "season_id": e.fixture.season_id,
            "matchday": e.fixture.round_id,
            "homeTeam": {
                "id": e.fixture.localTeam.data.id,
                "name": e.fixture.localTeam.data.name,
                "logoUrl": e.fixture.localTeam.data.logo_path,
            },
            "awayTeam": {
                "id": e.fixture.visitorTeam.data.id,
                "name": e.fixture.visitorTeam.data.name,
                "logoUrl": e.fixture.visitorTeam.data.logo_path,
            },
            "status": e.fixture.time.status,
            "date": new Date(e.fixture.time.starting_at.date_time + " " + e.fixture.time.starting_at.timezone)
        }
    
        //If game has not been started then set result as empty
        if (e.fixture.time.status !== "NS" && e.fixture.time.status !== "POSTP") {
            fixture.result = {
                "goalsHomeTeam": e.fixture.scores.localteam_score,
                "goalsAwayTeam": e.fixture.scores.visitorteam_score
            }
        }

        res.push(fixture);
    });
    
    return res;
}