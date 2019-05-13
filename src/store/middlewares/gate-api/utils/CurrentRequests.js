import AbortError from '../errors/AbortError';

export default class CurrentRequests {
  constructor() {
    this.requests = {};
  }

  add(info) {
    let currentRequests = this.requests[info.requestType];

    if (!currentRequests) {
      currentRequests = [];
      this.requests[info.requestType] = currentRequests;
    }

    currentRequests.push(info);
  }

  remove(info) {
    if (this.requests[info.requestType]) {
      this.requests[info.requestType] = this.requests[info.requestType].filter(
        currentInfo => currentInfo !== info
      );
    }
  }

  abortByType(requestType) {
    const currentRequests = this.requests[requestType];

    if (currentRequests && currentRequests.length) {
      for (const requestInfo of currentRequests) {
        requestInfo.isCanceled = true;
        requestInfo.reject(new AbortError());
      }

      this.requests[requestType] = [];
    }
  }
}
