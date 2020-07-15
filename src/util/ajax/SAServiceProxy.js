import request from 'superagent';

import AbstractServiceProxy from './AbstractServiceProxy';

export default class SAServiceProxy extends AbstractServiceProxy {
  request(method, endpoint, params, context, headers) {
    const requestURL = this.constructor.buildRequestUrl(endpoint);

    if (typeof params === 'function') {
      params = params();
    }

    let req = request(method, requestURL);
    if (params) {
      if (method === 'GET') {
        req = req.query(params);
      } else {
        req = req.send(params);
      }
    }

    req.set(this.getRequestHeaders(headers));

    if (context) {
      context.request = req;
    }
    return req;
  }


  get(endpoint, params, context, headers) {
    return this.request('GET', endpoint, params, context, headers);
  }

  post(endpoint, params, context, headers) {
    return this.request('POST', endpoint, params, context, headers);
  }

  put(endpoint, params, context, headers) {
    return this.request('PUT', endpoint, params, context, headers);
  }

  patch(endpoint, params, context, headers) {
    return this.request('PATCH', endpoint, params, context, headers);
  }

  delete(endpoint, params, context, headers) {
    return this.request('DELETE', endpoint, params, context, headers);
  }

  options(endpoint, params, context, headers) {
    return this.request('OPTIONS', endpoint, params, context, headers);
  }

  head(endpoint, params, context, headers) {
    return this.request('HEAD', endpoint, params, context, headers);
  }

  download(endpoint, params, context, headers) {
    const requestContext = context || {};
    const req = this.get(endpoint, params, requestContext, headers);
    requestContext.request.responseType('blob');
    return req;
  }

  upload(endpoint, filesInfoList, params, context, headers) {
    if (!Array.isArray(filesInfoList)) {
      throw new Error('Expecting "files" to be an array');
    }

    const requestURL = this.constructor.buildRequestUrl(endpoint);
    const req = request.post(requestURL);

    req.set(this.getRequestHeaders(headers));

    for (const fileInfo of filesInfoList) {
      req.attach(fileInfo.name, fileInfo.file);
    }

    const fields = params || {};
    Object.keys(fields).forEach((fieldName) => {
      req.field(fieldName, fields[fieldName])
    });

    if (context) {
      context.request = req;
    }

    return req;
  }
}
