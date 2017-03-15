import request from 'request';

const call = (args, context, endpoint) => {
  console.log(context)
  if (!context.authorization) {
    return new Error('Authorization not provided');
  }
  const options = {
    uri: endpoint,
    headers: {
      Authorization: context.authorization,
    },
    qs: {
      page_size: args.page_size || 10,
      page: args.page || 1,
    },
    json: true,
  };
  return new Promise((resolve, reject) => {
    request(options, (err, response, body) => {
      console.log(body)
      if (err) {
        reject(err);
      } else if (response.statusCode > 300) {
        if (body.errors) {
          reject(body.errors.detail);
        }
      }
      resolve(body);
    });
  });
}

const resolveFunctions = {
  Query: {
    currentUser(root, args, context) {
      return call(args, context, `${process.env.ENDPOINT}/api/1.0/users/current/`);
    },
    organizations(root, args, context) {
      return call(args, context, `${process.env.ENDPOINT}/api/1.0/organizations/`);
    },
    organization(root, args, context) {
      return call(args, context, `${process.env.ENDPOINT}/api/1.0/organizations/${args.id}/`);
    },
    fleets(root, args, context) {
      return call(args, context, `${process.env.ENDPOINT}/api/1.0/organizations/${args.organizationId}/fleets/`);
    },
    fleet(root, args, context) {
      return call(args, context, `${process.env.ENDPOINT}/api/1.0/organizations/${args.organizationId}/fleets/${args.fleetId}`);
    },
    organizationMetrics(root, args, context) {
      return call(args, context, `${process.env.ENDPOINT}/api/1.0/organizations/${args.organizationId}/metrics/`);
    },
    fleetMetrics(root, args, context) {
      return call(args, context, `${process.env.ENDPOINT}/api/1.0/organizations/${args.organizationId}/fleet/${args.fleetId}/metrics/`);
    },
    logs(root, args, context) {
      return call(args, context, `${process.env.ENDPOINT}/api/1.0/devices/${args.deviceId}/logs/`);
    },
    log(root, args, context) {
      return call(args, context, `${process.env.ENDPOINT}/api/1.0/devices/${args.deviceId}/logs/${args.logId}/`);
    },
    devices(root, args, context) {
      return call(args, context, `${process.env.ENDPOINT}/api/1.0/organizations/${args.organizationId}/devices/`);
    },
    device(root, args, context) {
      return call(args, context, `${process.env.ENDPOINT}/api/1.0/devices/${args.famocoId}/devices/`);
    },
  },
  Organization: {
    metrics(organization, args, context, info) {
      return call(args, context, `${process.env.ENDPOINT}/api/1.0/organizations/${organization.id}/metrics/`);
    },
    devices(organization, args, context, info) {
      return call(args, context, `${process.env.ENDPOINT}/api/1.0/organizations/${organization.id}/devices/`);
    },
    fleets(organization, args, context, info) {
      return call(args, context, `${process.env.ENDPOINT}/api/1.0/organizations/${organization.id}/fleets/`);
    },
    profiles(organization, args, context, info) {
      return call(args, context, `${process.env.ENDPOINT}/api/1.0/organizations/${organization.id}/profiles/`);
    },
    applications(organization, args, context, info) {
      return call(args, context, `${process.env.ENDPOINT}/api/1.0/organizations/${organization.id}/applications/`);
    },
  },
  Fleet: {
    devices(fleet, args, context, info) {
      return call(args, context, `${process.env.ENDPOINT}/api/1.0/organizations/${fleet.organization.id}/devices/?fleet=${fleet.id}`);
    }
  },
  Device: {
    logs(device, args, context, info) {
      return call(args, context, `${process.env.ENDPOINT}/api/1.0/organizations/${device.organization.id}/devices/${device.id}/logs/`);
    },
    fleet(device, args, context, info) {
      return device.fleet !== null ? device.fleet.name : null
    },
    last_sync(device, args, context, info) {
      return device.state_details.last_sync
    },
    sync_status(device, args, context, info) {
      return device.state_details.sync_status
    },
    profile(device, args, context, info) {
      const profileFleet = device.fleet !== null && device.fleet.profile !== null ? device.fleet.profile.name : undefined
      const profile = device.profile !== null ? device.profile.name : undefined
      return  profile || profileFleet
    },
    fleet(device, args, context, info) {
      return device.fleet !== null ? device.fleet.name : undefined
    },
    maintenance_status(device, args, context, info) {
      return device.state_details.maintenance_status
    },
    profile(device, args, context, info) {
      const profileFleet = device.fleet !== null && device.fleet.profile !== null ? device.fleet.profile.name : undefined
      const profile = device.profile !== null ? device.profile.name : undefined
      return  profile || profileFleet
    },
    imei(device, args, context, info) {
      return device.hardware_details.imei
    },
    model(device, args, context, info) {
      return device.hardware_details.model
    }
  },
  Profile: {
    applications(profile, args, context, info) {
      const calls = profile.applications.map(appId => call(args, context, `${process.env.ENDPOINT}/api/1.0/organizations/${profile.organization.id}/applications/${appId}/`))
      return Promise.all(calls);
    }
  },
  Mutation: {
    logIn(root, args) {
      const options = {
        uri: `${process.env.ENDPOINT}/api/oauth2/token/`,
        method: 'POST',
        form: {
          username: args.username,
          password: args.password,
          grant_type: process.env.GRANT_TYPE,
          client_id: process.env.CLIENT_ID,
        },
        json: true,
      };
      return new Promise((resolve, reject) => {
        request(options, (err, response, body) => {
          if (err) {
            reject(err);
          } else if (response.statusCode > 300) {
            reject(body.error_description);
          }
          resolve(body);
        });
      });
    },
  }
};

export default resolveFunctions;
