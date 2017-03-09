const typeDefinitions = `
type LogInRequest {
  username: String
  password: String
}

type LogInResponse {
  access_token: String
  expires_in: Int
  refresh_token: String
  scope: String
  token_type: String
}

type User {
  username: String
  first_name: String
  last_name: String
  email: String
  language: String
}

type OrganizationMetrics {
  devices_synced_count: Int
  devices_never_synced_count: Int
  devices_in_repair_count: Int
  applications_count: Int
  devices_in_the_field_count: Int
  fleets_count: Int
  devices_in_stock_count: Int
  devices_not_synced_count: Int
  profiles_count: Int
  devices_count: Int
}

type FleetMetrics {
  devices_synced_count: Int
  devices_never_synced_count: Int
  devices_in_repair_count: Int
  applications_count: Int
  devices_in_the_field_count: Int
  devices_in_stock_count: Int
  devices_not_synced_count: Int
  devices_count: Int
}

type Organization {
  id: Int
  name: String
  metrics: OrganizationMetrics
}

type Action {
  id: Int
  name: String
  description: String
}

type Device {
  id: Int
  famoco_id: String
  actions: [Action]
}

type Fleet {
  id: Int
  name: String
  devices: [Device]
}

type Query {
  currentUser: User
  organizations: [Organization]
  organization(id: Int!): Organization
  fleets(organizationId: Int!): [Fleet]
  fleet(organizationId: Int!, fleetId: Int!): Fleet
  organizationMetrics(organizationId: Int!): OrganizationMetrics
  fleetMetrics(organizationId: Int!, fleetId: Int!): FleetMetrics
}

type Mutation {
  logIn(username: String, password: String): LogInResponse
}

schema {
  query: Query
  mutation: Mutation
}
`;

export default [typeDefinitions];
