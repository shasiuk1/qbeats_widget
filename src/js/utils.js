/**
 * Utils module.
 */
var utils = {
  isObject: (obj) => obj !== null && typeof obj === "object",
  isString: (str) => typeof str === "string",
  isNumber: (num) => (num != '' && !isNaN(parseFloat(num)))
};

export default utils;
