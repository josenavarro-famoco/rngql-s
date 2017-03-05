import request from 'request';

const call = (context, endpoint) => {
  console.log(endpoint)
  if (!context.authorization) {
    return new Error('Authorization not provided');
  }
  const options = {
    uri: endpoint,
    headers: {
      Authorization: context.authorization,
    },
    json: true,
  };
  return new Promise((resolve, reject) => {
    request(options, (err, response, body) => {
      // console.log(body)
      if (err) {
        reject(err);
      } else if (response.statusCode > 300) {
        if (body.errors) {
          reject(body.errors.detail);
        }
      }
      resolve(body.results || body);
    });
  });
}

const resolveFunctions = {
  Query: {
    currentUser(root, args, context) {
      return call(context, `${process.env.ENDPOINT}/api/1.0/users/current/`);
    },
    organizations(root, args, context) {
      return call(context, `${process.env.ENDPOINT}/api/1.0/organizations/`);
    },
    organization(root, args, context) {
      return call(context, `${process.env.ENDPOINT}/api/1.0/organizations/${args.id}/`);
    },
    fleets(root, args, context) {
      return call(context, `${process.env.ENDPOINT}/api/1.0/organizations/${args.organizationId}/fleet/`);
    },
    fleet(root, args, context) {
      return call(context, `${process.env.ENDPOINT}/api/1.0/organizations/${args.organizationId}/fleet/${args.fleetId}`);
    },
    organizationMetrics(root, args, context) {
      return call(context, `${process.env.ENDPOINT}/api/1.0/organizations/${args.organizationId}/metrics/`);
    },
    fleetMetrics(root, args, context) {
      return call(context, `${process.env.ENDPOINT}/api/1.0/organizations/${args.organizationId}/fleet/${args.fleetId}/metrics/`);
    },
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
