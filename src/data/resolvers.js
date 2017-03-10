import request from 'request';

const devicePromise = (organizationId, item) => new Promise((resolve, reject) => {
  const options = {
    uri: `${process.env.ENDPOINT}/api/1.0/organizations/${organizationId}/devices/${item.id}/actions/`,
    headers: {
      // Authorization: context.authorization,
      Authorization: TOKEN
    },
    json: true,
  };

  request(options, (err, response, body) => {
    if (err) {
      reject(err);
    } else if (response.statusCode > 300) {
      if (body.errors) {
        reject(body.errors.detail);
      }
    }
    const deviceInfo = Object.assign({}, item, {
      fleet: item.fleet !== null ? item.fleet.name : '',
      last_sync: item.state_details.last_sync,
      sync_status: item.state_details.sync_status,
      actions: body.results
    })
    resolve(deviceInfo);
  })
});

// const pagePromise = (organizationId)
const TOKEN = 'Bearer Mdb1Ub9Mf1pVR4nzsQUiVwmjZMrZ1r';
const call = (context, endpoint) => {
  console.log(endpoint)
  // if (!context.authorization) {
  //   return new Error('Authorization not provided');
  // }
  const options = {
    uri: endpoint,
    headers: {
      // Authorization: context.authorization,
      Authorization: TOKEN
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
    actions(root, args, context) {
      return call(context, `${process.env.ENDPOINT}/api/1.0/devices/${args.deviceId}/actions/`);
    },
    action(root, args, context) {
      return call(context, `${process.env.ENDPOINT}/api/1.0/devices/${args.deviceId}/actions/${args.actionId}/`);
    },
    devices(root, args, context) {
      return new Promise((resolve, reject) => {
        const options = {
          uri: `${process.env.ENDPOINT}/api/1.0/organizations/${args.organizationId}/devices/`,
          headers: {
            // Authorization: context.authorization,
            Authorization: TOKEN
          },
          json: true,
          qs: {
            page_size: 100,
          }
        };

        request(options, (err, response, body) => {
          const pr = body.results.map(item => devicePromise(args.organizationId, item));
          Promise.all(pr).then((values) => {
            resolve({
              count: values.length,
              results: values
            })
          }).catch(err => {
            reject(err)
          });
        })
      })
    },
    device(root, args, context) {
      return new Promise((resolve, reject) => {
        const options = {
          uri: `${process.env.ENDPOINT}/api/1.0/devices/${args.famocoId}/`,
          headers: {
            // Authorization: context.authorization,
            Authorization: TOKEN
          },
          json: true,
        };
        request(options, (err, response, body) => {
          // console.log(body)
          if (err) {
            reject(err);
          } else if (response.statusCode > 300) {
            if (body.errors) {
              reject(body.errors.detail);
            }
          }
          const deviceInfo = Object.assign({}, body, {
            fleet: body.fleet.name,
            last_sync: body.state_details.last_sync,
            sync_status: body.state_details.sync_status,
          })
          resolve(deviceInfo);
        });
      });
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
