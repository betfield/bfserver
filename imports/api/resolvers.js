import GraphQLDate from 'graphql-date';

export const resolvers = {
    Date: GraphQLDate,
    Query: {
        fixtures: (_, { comp }) => Fixtures.find({ competition: comp }).fetch(),
        matchdayFixtures: (_, { comp, matchday }) => Fixtures.find({ competition: comp, matchday: matchday }).fetch(),
    },
};
