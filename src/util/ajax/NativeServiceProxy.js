import AbstractServiceProxy from './AbstractServiceProxy';

/**
 * @public
 */
export default class NativeServiceProxy extends AbstractServiceProxy {
  static buildRequestInfo(method, endpoint, params, headers, cacheVersion) {
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
        const searchParams = new URLSearchParams(params);
        requestURL = `${requestURL}?${searchParams.toString()}`;
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
      cacheVersion,
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
        const error = new Error(jsonData.detail);
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
   * @param args
   * @returns {{abortController: *, url: *, options: {method: *, headers: *}}}
   */
  requestInfo(...args) {
    return this.constructor.buildRequestInfo(...args);
  }


  /**
   *
   * @param method {String}
   * @param args
   * @returns {Promise}
   */
  request(method, ...args) {
    let endpoint, params, context, headers, cacheVersion, authenticate;
    if (typeof(args[0]) === 'object') {
      endpoint = args[0].endpoint;
      params = args[0].params;
      context = args[0].context;
      headers = args[0].headers;
      cacheVersion = args[0].cacheVersion;
      authenticate = args[0].authenticate ?? true;
    } else {
      [endpoint, params, context, headers, cacheVersion] = args;
    }

    return new Promise((resolve, reject) => {
      const requestHeaders = this.constructor.getRequestHeaders(headers, params, authenticate);
      const requestInfo = this.requestInfo(method, endpoint, params, requestHeaders, cacheVersion);

      if (context) {
        context.abortController = requestInfo.abortController;
      }

      this._performRequest(requestInfo).then((response) => {
        this.handleResponse(response, resolve, reject);
      }).catch((fetchError) => {
        reject(fetchError);
      });
    });
  }

  /**
   *
   * @param requestInfo {Object}
   * @private
   */
  _performRequest(requestInfo) {
    const { cacheVersion, options, url } = requestInfo;

    return new Promise(async (resolve, reject) => {
      let cache = null;

      if (cacheVersion) {
        cache = await caches.open(cacheVersion);
        const res = await cache.match(url);
        if (res) {
          return resolve(res);
        }
      }

      fetch(url, options).then(async(res) => {
        if (cache && res.status < 400) {
          await cache.put(url, res.clone());
        }
        resolve(res);
      }).catch(reject);
    });
  }

  /**
   *
   * @param args
   * @returns {*}
   */
  download(...args) {
    return this.get(...args);
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
      formData.append(fileInfo.fieldName, fileInfo.file, fileInfo.fileName);
    }

    return this.request('POST', endpoint, formData, context, headers);
  }
}
