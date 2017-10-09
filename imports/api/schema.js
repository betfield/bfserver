import {
    makeExecutableSchema,
    addMockFunctionsToSchema,
  } from 'graphql-tools';
  
  import { resolvers } from './resolvers';
  
  const typeDefs = `
  
  scalar Date               # Define a custom scalar type. 
                            # GraphQL by default supports only "String", "Int", "Float" and "Boolean".

  type Fixture{
    id: ID!
    homeTeam: Team!
    awayTeam: Team!
    venue: Venue!
    date: Date!             # custom scalar Date
  }
  
  type Week {
    id: ID!                 # "!" denotes a required field
    nr: Int
    fixtures: [Fixture]!    # "[]" means this is a list of fixtures 
  }
  
  type Team {
    id: ID!
    name: String!
    logoUrl: String!
  }

  type Venue {
    id: ID!
    name: String!
  }
  
  # This type specifies the entry points into our API
  type Query {
    weeks: [Week]
    week(id: ID!): Week 
  }
  `;
  
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  export { schema };
  