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
  id: ID
  name: String
  metrics: OrganizationMetrics
  devices: [Device]
  fleets: [Fleet]
  applications: [Application]
  profiles: [Profile]
}

type Application {
  id: ID
  package_name: String
  package_version_code: String
  package_version_name: String
  label: String
  apk: String
  icon: String
  create_date: String
  size: Int
}

type Action {
  id: ID,
  device: Int,
  organization: Int
  from_profile: Int
  to_profile: Int
  name: String
  description: String
  create_date: String
}

type Profile {
  id: ID
  name: String
  comment: String
  is_archived: Boolean
  create_date: String
  applications: [Application]
}

type Fleet {
  id: ID
  name: String
  is_archived: Boolean
  profile: Profile
  devices: [Device]
}

type Device {
  id: ID
  famoco_id: String
  fleet: String
  profile: String
  sync_status: String
  last_sync: String
  heartbeat: String
  model: String
  imei: [String]
  maintenance_status: String
  actions: [Action]
}

type Devices {
  count: Int
  results: [Device]
}

type Query {
  currentUser: User
  organizations: [Organization]
  organization(id: ID!): Organization
  fleets(organizationid: ID!): [Fleet]
  fleet(organizationid: ID!, fleetid: ID!): Fleet
  organizationMetrics(organizationid: ID!): OrganizationMetrics
  fleetMetrics(organizationid: ID!, fleetid: ID!): FleetMetrics
  actions(deviceid: ID!): [Action]
  action(deviceid: ID!, actionid: ID!): Action
  device(famocoId: String): Device
  devices(organizationid: ID): Devices
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
