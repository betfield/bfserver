import {
    makeExecutableSchema,
    addMockFunctionsToSchema,
  } from 'graphql-tools';
  
  import { resolvers } from './resolvers';
  
  const typeDefs = `
  
  scalar Date               # Define a custom scalar type. 
                            # GraphQL by default supports only "String", "Int", "Float" and "Boolean".

  type Fixture {
    extId: Int
    competition: Int!
    matchday: Int!
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
    name: String!
    code: String
    shortName: String
    logoUrl: String
  }

  # This type specifies the entry points into our API
  type Query {
    fixtures(comp: Int!): [Fixture]
    matchdayFixtures(comp: Int!, matchday: Int!): [Fixture]
  }
  `;
  
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  export { schema };
  