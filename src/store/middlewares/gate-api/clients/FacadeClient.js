/* eslint-disable prefer-destructuring */

import { client } from 'jayson';

import GateError from '../errors/GateError';

export default class FacadeClient {
  constructor() {
    const url = process.env.FACADE_CONNECT;

    if (!url) {
      // eslint-disable-next-line no-console
      console.error('Env variable "FACADE_CONNECT" hasn\'t set');
      return;
    }

    this.client = client.http(url);
  }

  callApi(apiName, params, userId) {
    return new Promise((resolve, reject) => {
      this.client.request(
        apiName,
        {
          auth: {
            user: userId || undefined,
          },
          params,
        },
        (err, response) => {
          if (err) {
            reject(err);
            return;
          }

          if (response.error) {
            reject(new GateError(response.error, apiName));
            return;
          }

          resolve(response.result);
        }
      );
    });
  }
}
