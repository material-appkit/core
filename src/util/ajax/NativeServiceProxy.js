import qs from 'query-string';

import AbstractServiceProxy from './AbstractServiceProxy';

export default class NativeServiceProxy extends AbstractServiceProxy {
  request(method, endpoint, params, context, headers) {
    return new Promise((resolve, reject) => {
      let requestURL = this.constructor.buildRequestUrl(endpoint);
      const fetchOptions = {
        method,
        mode: 'cors',
        credentials: 'same-origin',
        headers: this.getRequestHeaders(headers),
      };

      if (params) {
        let requestParams = params || {};
        if (typeof requestParams === 'function') {
          requestParams = requestParams();
        }

        if (method === 'GET') {
          requestURL = `${requestURL}?${qs.stringify(params)}`;
        } else {
          fetchOptions.body = JSON.stringify(params);
        }
      }

      const request = new Request(requestURL, fetchOptions);
      if (context) {
        context.request = request;
      }

      function handleJsonResponse(response) {
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

      function handleBlobResponse(response) {
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

      fetch(request).then((response) => {
        response.request = request;

        const contentType = response.headers.get('content-type');
        if (contentType === 'application/json') {
          handleJsonResponse(response);
        } else {
          handleBlobResponse(response);
        }
      }) .catch((fetchError) => {
        reject(fetchError);
      });
    });
  }


  download(endpoint, params, context, headers) {
    return this.get(endpoint, params, context, headers);
  }
  
  /*
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
  */
}
