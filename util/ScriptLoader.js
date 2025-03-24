class ScriptLoader {
  static loadScript(url) {
    const scriptElement = document.createElement("script");
    scriptElement.setAttribute("src", url);
    scriptElement.setAttribute("async", true);

    const promise = new Promise((resolve, reject) => {
      scriptElement.onload = function(e) {
        resolve(e);
      };
      scriptElement.onerror = function (err) {
        reject(err);
      }
    });

    const head = document.head;
    head.insertBefore(scriptElement, head.firstElementChild);

    return promise;
  }
}


export default ScriptLoader;
