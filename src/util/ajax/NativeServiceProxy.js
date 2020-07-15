import AbstractServiceProxy from './AbstractServiceProxy';

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


  request(method, endpoint, params, context, headers) {
    return new Promise((resolve, reject) => {
      const request = this.constructor.buildRequest(method, endpoint, params, headers);
      if (context) {
        context.request = request;
      }

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
