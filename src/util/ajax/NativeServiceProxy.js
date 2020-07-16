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
      resolve(response);
    }).catch((jsonDecodeError) => {
      jsonDecodeError.response = response;
      reject(jsonDecodeError);
    });
  }


  handleBlobResponse(response, resolve, reject) {
    response.blob().then((blobData) => {
      response.blobData = blobData;
      resolve(response);
    }).catch((blobDecodeError) => {
      blobDecodeError.response = response;
      reject(blobDecodeError);
    });
  }

  handleResponse(response, resolve, reject) {
    if (!response.ok) {
      const error = new Error('Network response was not ok');
      error.response = response;
      reject(error);
    } else {
      const contentType = response.headers.get('content-type');
      if (contentType === 'application/json') {
        this.handleJsonResponse(response, resolve, reject);
      } else {
        this.handleBlobResponse(response, resolve, reject);
      }
    }
  }


  requestInfo(method, endpoint, params, headers) {
    let requestURL = this.constructor.buildRequestUrl(endpoint);

    const fetchOptions = {
      ...DEFAULT_FETCH_OPTIONS,
      method,
      headers,
    };
    
    let abortController = null;
    if (window.AbortController) {
      abortController = new AbortController();
      fetchOptions.signal = abortController.signal;
    }

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

    return {
      abortController,
      url: requestURL,
      options: fetchOptions,
    };
  }


  request(method, endpoint, params, context, headers) {
    return new Promise((resolve, reject) => {
      const requestHeaders = this.constructor.getRequestHeaders(headers, params);

      const requestInfo = this.requestInfo(method, endpoint, params, requestHeaders);
      const { abortController, options, url } = requestInfo;

      if (context) {
        context.abortController = abortController;
      }

      fetch(url, options).then((response) => {
        this.handleResponse(response, resolve, reject);
      }).catch((fetchError) => {
        reject(fetchError);
      });
    });
  }


  download(endpoint, params, context, headers) {
    return this.get(endpoint, params, context, headers);
  }


  upload(endpoint, filesInfoList, params, context, headers) {
    if (!Array.isArray(filesInfoList)) {
      throw new Error('Expecting "files" to be an array');
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

    return this.request('POST', endpoint, formData, context, headers);
  }
}
