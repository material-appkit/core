import qs from 'query-string';

import AbstractServiceProxy from './AbstractServiceProxy';

/**
 * @public
 */
export default class NativeServiceProxy extends AbstractServiceProxy {
  static buildRequestInfo(method, endpoint, params, headers) {
    let requestURL = this.buildRequestUrl(endpoint);

    const fetchOptions = {
      mode: 'cors',
      credentials: this.credentials || 'same-origin',
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

      if (method === 'GET' || method === 'OPTIONS') {
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

  /**
   *
   * @param response
   * @param resolve
   * @param reject
   */
  handleJsonResponse(response, resolve, reject) {
    response.json().then((jsonData) => {
      response.jsonData = jsonData;
      if (response.ok) {
        resolve(response);
      } else {
        const error = new Error('Network response was not ok');
        error.response = response;
        reject(error);
      }
    }).catch((jsonDecodeError) => {
      jsonDecodeError.response = response;
      reject(jsonDecodeError);
    });
  }


  /**
   *
   * @param response
   * @param resolve
   * @param reject
   */
  handleBlobResponse(response, resolve, reject) {
    response.blob().then((blobData) => {
      response.blobData = blobData;
      if (response.ok) {
        resolve(response);
      } else {
        const error = new Error('Network response was not ok');
        error.response = response;
        reject(error);
      }
    }).catch((blobDecodeError) => {
      blobDecodeError.response = response;
      reject(blobDecodeError);
    });
  }


  /**
   *
   * @param response
   * @param resolve
   * @param reject
   */
  handleResponse(response, resolve, reject) {
    const contentType = response.headers.get('content-type');
    if (contentType === 'application/json') {
      this.handleJsonResponse(response, resolve, reject);
    } else {
      this.handleBlobResponse(response, resolve, reject);
    }
  }


  /**
   *
   * @param method
   * @param endpoint
   * @param params
   * @param headers
   * @returns {{abortController: *, url: *, options: {method: *, headers: *}}}
   */
  requestInfo(method, endpoint, params, headers) {
    return this.constructor.buildRequestInfo(
      method, endpoint, params, headers
    );
  }


  /**
   *
   * @param method
   * @param args
   * @returns {Promise}
   */
  request(method, ...args) {
    let endpoint, params, context, headers;
    if (typeof(args[0]) === 'object') {
      endpoint = args[0].endpoint;
      params = args[0].params;
      context = args[0].context;
      headers = args[0].headers;
    } else {
      [endpoint, params, context, headers] = args;
    }

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


  /**
   *
   * @param endpoint
   * @param params
   * @param context
   * @param headers
   * @returns {*}
   */
  download(endpoint, params, context, headers) {
    return this.get(endpoint, params, context, headers);
  }


  /**
   *
   * @param endpoint
   * @param filesInfoList
   * @param params
   * @param context
   * @param headers
   * @returns {Promise}
   */
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
