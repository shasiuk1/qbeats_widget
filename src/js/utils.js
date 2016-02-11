/**
 * Utils and Helpers
 * @type {{isObject: utils.isObject, isString: utils.isString, isNumber: utils.isNumber}}
 */
var utils = {
  isObject:(obj) => obj !== null && typeof obj === "object",
  isString: (str) => typeof str === "string",
  isNumber: (num) => (num != '' && !isNaN(parseFloat(num)))
};

export default utils;
