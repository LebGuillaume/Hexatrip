const xss = require("xss");

function deepSanitize(obj) {
  if (!obj || typeof obj !== "object") return;

  for (const key of Object.keys(obj)) {
    const val = obj[key];

    if (typeof val === "string") {
      obj[key] = xss(val);
    } else if (Array.isArray(val)) {
      val.forEach(deepSanitize);
    } else {
      deepSanitize(val);
    }
  }
}

function xssMiddleware(req, res, next) {
  deepSanitize(req.body);
  deepSanitize(req.params);
  deepSanitize(req.query); // on modifie les valeurs, pas la propriété
  next();
}

module.exports = xssMiddleware;
