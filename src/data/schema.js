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
}

type Action {
  id: Int,
  device: Int,
  organization: Int
  from_profile: Int
  to_profile: Int
  name: String
  description: String
  create_date: String
}

type Fleet {
  id: Int
  name: String
}

type Device {
  id: Int
  famoco_id: String
  fleet: String
  sync_status: String
  last_sync: String
  actions: [Action]
}

type Devices {
  count: Int
  results: [Device]
}

type Query {
  currentUser: User
  organizations: [Organization]
  organization(id: Int!): Organization
  fleets: [Fleet]
  fleet(id: Int!): Fleet
  organizationMetrics(organizationId: Int!): OrganizationMetrics
  fleetMetrics(organizationId: Int!, fleetId: Int!): FleetMetrics
  actions(deviceId: Int!): [Action]
  action(deviceId: Int!, actionId: Int!): Action
  device(famocoId: String): Device
  devices(organizationId: Int): Devices
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
