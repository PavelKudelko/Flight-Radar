// graphQL schema

const typeDefs = `#graphql
  type AircraftPositions {
    id: ID!
    icao: String
    flight: String
    latitude: Float
    longitude: Float
    altitude: Float
    speed: Float
    heading: Float
    timestamp: String
  }

  type Query {
    aircraftPositions(limit: Int!): [AircraftPositions]
    aircraftByICAO(icao: String!, limit: Int!): [AircraftPositions]
    aircraftByFlight(flight: String!, limit: Int!): [AircraftPositions]
  }
`;

module.exports = { typeDefs };