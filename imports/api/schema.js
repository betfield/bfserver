import {
    makeExecutableSchema,
    addMockFunctionsToSchema,
  } from 'graphql-tools';
  
  import { resolvers } from './resolvers';
  
  const typeDefs = `
  
  scalar Date               # Define a custom scalar type. 
                            # GraphQL by default supports only "String", "Int", "Float" and "Boolean".

  type Fixture {
    id: Int!
    league_id: Int!
    season_id: Int!
    matchday_id: Int!
    matchday_name: String
    homeTeam: Team!
    awayTeam: Team!
    result: Result
    status: String!
    date: Date!             # custom scalar Date
  }
  
  type Result {
    goalsHomeTeam: Int
    goalsAwayTeam: Int
  }
  
  type Team {
    id: Int!
    name: String!
    logoUrl: String
  }

  # This type specifies the entry points into our API
  type Query {
    fixtures(season: Int!): [Fixture]
    matchdayFixtures(season: Int!, matchday: Int!): [Fixture]
    currentMatchdayfixtures(season: Int!): [Fixture]
  }
  `;
  
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  export { schema };
  