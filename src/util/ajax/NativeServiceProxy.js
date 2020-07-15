import qs from 'query-string';

import AbstractServiceProxy from './AbstractServiceProxy';

const DEFAULT_FETCH_OPTIONS = {
  mode: 'cors',
  credentials: 'same-origin',
};

export default class NativeServiceProxy extends AbstractServiceProxy {
  handleJsonResponse(response, resolve, reject) {
    response.json().then((jsonData) => {
      response.jsonData = jsonData;

      if (!response.ok) {
        const error = new Error('Network response was not ok');
        error.response = response;
        reject(error);
      } else {
        resolve(response);
      }
    }).catch((jsonDecodeError) => {
      jsonDecodeError.response = response;
      reject(jsonDecodeError);
    });
  }


  handleBlobResponse(response, resolve, reject) {
    response.blob().then((blobData) => {
      response.blobData = blobData;

      if (!response.ok) {
        const error = new Error('Network response was not ok');
        error.response = response;
        reject(error);
      } else {
        resolve(response);
      }
    }).catch((blobDecodeError) => {
      blobDecodeError.response = response;
      reject(blobDecodeError);
    });
  }

  buildRequest(method, endpoint, params, headers, extraFetchOptions) {
    let requestURL = this.constructor.buildRequestUrl(endpoint);

    const fetchOptions = {
      ...DEFAULT_FETCH_OPTIONS,
      ...extraFetchOptions,
      method,
      headers,
    };

    if (params) {
      let requestParams = params;

      const paramType = typeof requestParams;
      if (paramType === 'function') {
        requestParams = requestParams();
      }

      if (method === 'GET') {
        requestURL = `${requestURL}?${qs.stringify(params)}`;
      } else {
        if (requestParams instanceof FormData) {
          fetchOptions.body = requestParams;
        } else {
          fetchOptions.body = JSON.stringify(requestParams);
        }
      }
    }

    return new Request(requestURL, fetchOptions);
  }

  invokeRequest(request, resolve, reject) {
    fetch(request).then((response) => {
      response.request = request;

      const contentType = response.headers.get('content-type');
      if (contentType === 'application/json') {
        this.handleJsonResponse(response, resolve, reject);
      } else {
        this.handleBlobResponse(response, resolve, reject);
      }
    }).catch((fetchError) => {
      reject(fetchError);
    });
  }


  request(method, endpoint, params, context, headers) {
    return new Promise((resolve, reject) => {
      let requestHeaders = headers || {};
      requestHeaders['Content-Type'] = 'application/json';
      requestHeaders = this.constructor.getRequestHeaders(requestHeaders);

      const controller = new AbortController();
      const extraFetchOptions = { signal: controller.signal };

      const request = this.buildRequest(method, endpoint, params, requestHeaders, extraFetchOptions);
      if (context) {
        context.request = request;
        context.controller = controller;
      }

      this.invokeRequest(request, resolve, reject);
    });
  }


  download(endpoint, params, context, headers) {
    return this.get(endpoint, params, context, headers);
  }


  upload(endpoint, filesInfoList, params, context, headers) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(filesInfoList)) {
        reject(new Error('Expecting "files" to be an array'));
      }

      const formData = new FormData();

      if (params) {
        Object.keys(params).forEach((paramName) => {
          formData.append(paramName, params[paramName]);
        })
      }

      for (const fileInfo of filesInfoList) {
        formData.append(fileInfo.name, fileInfo.file);
      }

      let requestHeaders = headers || {};
      requestHeaders = this.constructor.getRequestHeaders(requestHeaders);

      const controller = new AbortController();
      const extraFetchOptions = { signal: controller.signal };

      const request = this.buildRequest(method, endpoint, params, requestHeaders, extraFetchOptions);
      if (context) {
        context.request = request;
        context.controller = controller;
      }

      this.invokeRequest(request, resolve, reject);
    });
  }
}
