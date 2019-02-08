const _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

export function include(base, routes) {
  const mappedRoutes = {
    toString: function toString() {
      return base;
    },
  };

  Object.keys(routes).forEach(function (route) {
    const url = routes[route];

    if (typeof url === "function" && route === "toString") {
      mappedRoutes.toString = function () {
        return base + routes.toString();
      };
    } else if ((typeof url === "undefined" ? "undefined" : _typeof(url)) === "object") {
      // nested include - prefix all sub-routes with base
      mappedRoutes[route] = include(base, url);
    } else {
      mappedRoutes[route] = [base, url]
        .filter((component) => component)
        .join("/")
        .replace("//", "/");
    }
  });

  return mappedRoutes;
}
