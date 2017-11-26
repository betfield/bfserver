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
        },
        currentMatchdayfixtures: (_, { season }) => {
            Log.info("Loading Query (currentMatchdayFixtures) for season: " + season);
            
            try {
                const fixtures = Fixtures.find({ "fixture.round_id": Seasons.findOne({"id": season}).current_round_id }).fetch();
                return adjustFixtureValues(fixtures);
            } catch (err) {
                Log.error("Failed to load Query (currentMatchdayFixtures)", err);
                return null;
            }
        }
    },
};

function adjustFixtureValues(fixtures) {
    let res = [];
    console.log("Fixture: " + fixtures[0]);    
    fixtures.forEach( e => {
        let result = null;

        let fixture = {
            "id": e.fixture.id,
            "league_id": e.fixture.league_id,
            "season_id": e.fixture.season_id,
            "matchday_id": e.fixture.round_id,
            "matchday_name": e.fixture.round_name,
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
            "venue": {
                "id": e.fixture.venue.data.id,
                "name": e.fixture.venue.data.name,
                "city": e.fixture.venue.data.city,
                "capacity": e.fixture.venue.data.capacity,
                "imgUrl": e.fixture.venue.data.image_path
            },
            "status": e.fixture.time.status,
            "date": new Date(e.fixture.time.starting_at.date_time + " " + e.fixture.time.starting_at.timezone)
        }
    
        //Set result and stats, unless game has not been started yet (or has been postponed)
        if (e.fixture.time.status !== "NS" && e.fixture.time.status !== "POSTP") {
            fixture.result = {
                "goalsHomeTeam": e.fixture.scores.localteam_score,
                "goalsAwayTeam": e.fixture.scores.visitorteam_score
            };

            //Get stats array
            const stats = e.fixture.stats.data;

            //Check if stats array has data (at least 2 elements in array) and assign to fixtures object
            if (stats !== undefined && stats !== null && stats.length > 1 ) {
                fixture.statsHomeTeam = {
                    "shots": {
                        "total": stats[0].shots.total,
                        "ongoal": stats[0].shots.ongoal,
                        "offgoal": stats[0].shots.offgoal,
                        "blocked": stats[0].shots.blocked
                    },
                    "fouls": stats[0].fouls,
                    "corners": stats[0].corners,
                    "offsides": stats[0].offsides,
                    "possessiontime": stats[0].possessiontime,
                    "yellowcards": stats[0].yellowcards,
                    "redcards": stats[0].redcards,
                    "saves": stats[0].saves
                };

                fixture.statsAwayTeam = {
                    "shots": {
                        "total": stats[1].shots.total,
                        "ongoal": stats[1].shots.ongoal,
                        "offgoal": stats[1].shots.offgoal,
                        "blocked": stats[1].shots.blocked
                    },
                    "fouls": stats[1].fouls,
                    "corners": stats[1].corners,
                    "offsides": stats[1].offsides,
                    "possessiontime": stats[1].possessiontime,
                    "yellowcards": stats[1].yellowcards,
                    "redcards": stats[1].redcards,
                    "saves": stats[1].saves
                }
            }
        }

        let referee = e.fixture.referee;

        if (referee !== null && referee !== undefined ) {
            fixture.referee = referee.data.fullname;
        } else {
            fixture.referee = null;
        }

        res.push(fixture);
    });
    
    return res;
}