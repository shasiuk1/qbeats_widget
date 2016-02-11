(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require("./utils");

var _utils2 = _interopRequireDefault(_utils);

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** Class representing the Widget. */

var Widget = function () {
  /**
   * Create a Widget.
   * @param {string} containerId - ID selector of element where the widget is placed.
   * @param {string} title - Main title of Widget.
   */

  function Widget(containerId) {
    var title = arguments.length <= 1 || arguments[1] === undefined ? "Expenses" : arguments[1];

    _classCallCheck(this, Widget);

    this.container = document.getElementById(containerId);
    this.title = title;
    // to have different storages for each widget, we add containers ID
    this._storeId = _constants.LS + "_" + containerId;
    // if data exists - take it from local storage
    this._data = JSON.parse(localStorage.getItem(this._storeId)) || [];
    this._sorted = 1;
    this._sign = "$";

    // main render
    this._render();

    // get elements for easier usage
    this._widget = this.container.querySelector("." + _constants.CSS['w']);
    this._expandBtn = this.container.querySelector("." + _constants.CSS['w_expand']);
    this._nameInput = this.container.querySelector("[name=\"w_name\"]");
    this._amountInput = this.container.querySelector("[name=\"w_amount\"]");
    this._submitBtn = this.container.querySelector("[name=\"w_submit\"]");
    this._dataTable = this.container.querySelector("." + _constants.CSS['w-tbl_body']);
    this._sumValue = this.container.querySelector("." + _constants.CSS['w-sum_val']);
    this._sortBtn = this.container.querySelector("[data-w-sortbyname]");

    // add event handlers after html is rendered
    this._expandBtn.addEventListener('click', this.expandWidget.bind(this), false);
    this._submitBtn.addEventListener('click', this._submitHandler.bind(this), false);
    this._sortBtn.addEventListener('click', this._sortHandler.bind(this), false);
    this._widget.addEventListener('keydown', function (ev) {
      var e = ev || window.event;

      if (e.keyCode === 13) {
        this._submitHandler();
      }
    }.bind(this), false);
  }

  /**
   * Handles sort event.
   * @param e
   * @private
   */


  _createClass(Widget, [{
    key: "_sortHandler",
    value: function _sortHandler(e) {
      var el = e.currentTarget;

      this._sorted = this._sorted === 1 ? -1 : 1;
      el.setAttribute('data-w-sortbyname', this._sorted);
      this._sortData();
      this._dataTable.innerHTML = this._generateDataRows();
    }

    /**
     * Event handler for adding new data.
     * @private
     */

  }, {
    key: "_submitHandler",
    value: function _submitHandler() {
      if (!this._nameInput.validity.valid || !this._amountInput.validity.valid) {
        alert('plz enter valid data');
        return false;
      }

      var name = this._nameInput.value;
      var amount = '' + this._amountInput.value;
      var data = { name: name, amount: amount };

      this._nameInput.value = '';
      this._amountInput.value = '';
      this.addData(data);
    }

    /**
     * Calculates Amount.
     * @returns {string} - widget Sign + total ammount.
     * @private
     */

  }, {
    key: "_calculateAmount",
    value: function _calculateAmount() {
      return this._sign + this._data.reduce(function (prev, curr) {
        return prev + (parseFloat(curr.amount) || 0);
      }, 0);
    }

    /**
     * Generates html rows with data.
     * @returns {string} - html of table rows with data.
     * @private
     */

  }, {
    key: "_generateDataRows",
    value: function _generateDataRows() {
      var _this = this;

      return this._data.map(function (data) {
        return "\n        <div class=\"" + _constants.CSS['w-tbl_tr'] + "\">\n          " + Object.keys(data).map(function (key) {
          var text = key === "amount" ? _this._sign + parseFloat(data[key]) : data[key];

          return "\n              <div class=\"" + _constants.CSS['w-tbl_td'] + "\">\n                <span>" + text + "</span>\n              </div>\n            ";
        }).join("") + "\n        </div>\n        ";
      }).join("");
    }

    /**
     * Sorts widget data.
     * @returns {Array} - sorted widget data.
     * @private
     */

  }, {
    key: "_sortData",
    value: function _sortData() {
      var _this2 = this;

      return this._data.sort(function (a, b) {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -_this2._sorted;
        }

        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return _this2._sorted;
        }

        return 0;
      });
    }

    /**
     * Renders the html into specified container.
     * @private
     */

  }, {
    key: "_render",
    value: function _render() {
      var totalAmount = this._calculateAmount();
      var rows = this._generateDataRows();

      var template = "<div class=\"" + _constants.CSS['w'] + "\" tabindex=\"0\">\n        <header class=\"" + _constants.CSS['w_head'] + "\">\n          <h3 class=\"" + _constants.CSS['w_title'] + "\">" + this.title + "</h3>\n          <div class=\"" + _constants.CSS['w_expand'] + "\"></div>\n        </header>\n        <section class=\"" + _constants.CSS['w_body'] + "\">\n          <div class=\"" + _constants.CSS['w-tbl'] + "\">\n            <div class=\"" + _constants.CSS['w-tbl_head'] + "\">\n              <div class=\"" + _constants.CSS['w-tbl_tr'] + "\">\n                <div class=\"" + _constants.CSS['w-tbl_td'] + "\">\n                  <div class=\"" + _constants.CSS['w-tbl_head-i'] + "\"\n                        data-w-sortbyname=\"" + this._sorted + "\">" + _constants.TEXT.name + "</div>\n                </div>\n                <div class=\"" + _constants.CSS['w-tbl_td'] + "\">\n                  <div class=\"" + _constants.CSS['w-tbl_head-i'] + "\">" + _constants.TEXT.amount + "</div>\n                </div>\n              </div>\n            </div>\n            <div class=\"" + _constants.CSS['w-tbl_body'] + "\">\n              " + rows + "\n            </div>\n          </div>\n        </section>\n        <footer class=\"" + _constants.CSS['w_footer'] + "\">\n          <div class=\"" + _constants.CSS['w-form'] + "\">\n            <div class=\"" + _constants.CSS['w-form_cell'] + "\">\n              <input class=\"" + _constants.CSS['w-form_input'] + "\" \n                    type=\"text\"\n                    name=\"w_name\"\n                    placeholder=\"Jane Doe\"\n                    required=\"required\"\n                    pattern=\"[a-zA-Z-&][a-zA-Z-& ]+\"/>\n            </div>\n            <div class=\"" + _constants.CSS['w-form_cell'] + "\">\n              <span class=\"" + _constants.CSS['w-form_symbol'] + "\">" + this._sign + "</span>\n              <input class=\"" + _constants.CSS['w-form_input'] + " " + _constants.CSS['w-form_input_val'] + "\" \n                    type=\"text\"\n                    name=\"w_amount\"\n                    placeholder=\"19.99\"\n                    required=\"required\"\n                    pattern=\"\\d+(.\\d{2})?\"/>\n              <button class=\"" + _constants.CSS['w-form_submit'] + "\" name=\"w_submit\"></button>\n            </div>\n          </div>\n          <div class=\"" + _constants.CSS['w-sum'] + "\">\n            <div class=\"" + _constants.CSS['w-sum_text'] + "\">" + _constants.TEXT.total + "</div>           \n            <div class=\"" + _constants.CSS['w-sum_val'] + "\">" + totalAmount + "</div>\n          </div>\n        </footer>\n      </div>";

      this.container.innerHTML = template;
    }

    /**
     * Expands Widget.
     */

  }, {
    key: "expandWidget",
    value: function expandWidget() {
      if (this._widget.classList.contains(_constants.CSS['w--collapsed'])) {
        this._widget.classList.remove(_constants.CSS['w--collapsed']);
        this._expandBtn.classList.remove(_constants.CSS['w_expand--active']);

        return false;
      }

      this._widget.classList.add(_constants.CSS['w--collapsed']);
      this._expandBtn.classList.add(_constants.CSS['w_expand--active']);
    }

    /**
     * Add new data to the storage and updates the html.
     * @param {object} data - new data 
     * @returns {*}
     */

  }, {
    key: "addData",
    value: function addData(data) {
      if (!_utils2.default.isObject(data)) {
        return false;
      }

      if (data.hasOwnProperty('amount')) {
        data['amount'] = parseFloat(data['amount']).toFixed(2) + '';
      }

      this._data.push(data);
      localStorage.setItem(this._storeId, JSON.stringify(this._sortData()));
      this._dataTable.innerHTML = this._generateDataRows();
      this._sumValue.innerHTML = this._calculateAmount();

      return this;
    }

    /**
     * Removes all data from widget table.
     * @returns {*}
     */

  }, {
    key: "clearData",
    value: function clearData() {
      this._data = [];
      localStorage.setItem(this._storeId, JSON.stringify(this._data));

      this._dataTable.innerHTML = this._generateDataRows();
      this._sumValue.innerHTML = this._calculateAmount();

      return this;
    }

    /**
     * Get the widget data.
     * @return {json} The JSON representation of widget data.
     */

  }, {
    key: "getData",
    value: function getData() {
      return JSON.stringify(this._data, null, 1);
    }
  }]);

  return Widget;
}();

window['Widget'] = window['Widget'] || Widget;
},{"./constants":2,"./utils":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Constants module
 */

/** CSS classes. */
var CSS = exports.CSS = {
  "w": "widget",
  "w--collapsed": "widget_collapsed",
  "w_head": "widget__header",
  "w_body": "widget__body",
  "w_footer": "widget__footer",
  "w_title": "widget__title",
  "w_expand": "widget__expand-btn",
  "w_expand--active": "widget__expand-btn_active",
  "w-tbl": "widget-table",
  "w-tbl_head": "widget-table__head",
  "w-tbl_tr": "widget-table__tr",
  "w-tbl_head-i": "widget-table__head-item",
  "w-tbl_td": "widget-table__td",
  "w-tbl_body": "widget-table__body",
  "w-form": "widget-form",
  "w-form_cell": "widget-form__cell",
  "w-form_input": "widget-form__input",
  "w-form_input_val": "widget-form__input_val",
  "w-form_symbol": "widget-form__symbol",
  "w-form_submit": "widget-form__submit",
  "w-sum": "widget-sum",
  "w-sum_text": "widget-sum__text",
  "w-sum_val": "widget-sum__value"
};

/** Text within widget. */
var TEXT = exports.TEXT = {
  "name": "Name",
  "amount": "Amount",
  "total": "Total"
};

/** Name of LocalStorage */
var LS = exports.LS = "widgetData";
},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/**
 * Utils module.
 */
var utils = {
  isObject: function isObject(obj) {
    return obj !== null && (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object";
  },
  isString: function isString(str) {
    return typeof str === "string";
  },
  isNumber: function isNumber(num) {
    return num != '' && !isNaN(parseFloat(num));
  }
};

exports.default = utils;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvV2lkZ2V0LmpzIiwic3JjL2pzL2NvbnN0YW50cy5qcyIsInNyYy9qcy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxudmFyIF91dGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xuXG52YXIgX3V0aWxzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3V0aWxzKTtcblxudmFyIF9jb25zdGFudHMgPSByZXF1aXJlKFwiLi9jb25zdGFudHNcIik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbi8qKiBDbGFzcyByZXByZXNlbnRpbmcgdGhlIFdpZGdldC4gKi9cblxudmFyIFdpZGdldCA9IGZ1bmN0aW9uICgpIHtcbiAgLyoqXHJcbiAgICogQ3JlYXRlIGEgV2lkZ2V0LlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb250YWluZXJJZCAtIElEIHNlbGVjdG9yIG9mIGVsZW1lbnQgd2hlcmUgdGhlIHdpZGdldCBpcyBwbGFjZWQuXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpdGxlIC0gTWFpbiB0aXRsZSBvZiBXaWRnZXQuXHJcbiAgICovXG5cbiAgZnVuY3Rpb24gV2lkZ2V0KGNvbnRhaW5lcklkKSB7XG4gICAgdmFyIHRpdGxlID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gXCJFeHBlbnNlc1wiIDogYXJndW1lbnRzWzFdO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFdpZGdldCk7XG5cbiAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvbnRhaW5lcklkKTtcbiAgICB0aGlzLnRpdGxlID0gdGl0bGU7XG4gICAgLy8gdG8gaGF2ZSBkaWZmZXJlbnQgc3RvcmFnZXMgZm9yIGVhY2ggd2lkZ2V0LCB3ZSBhZGQgY29udGFpbmVycyBJRFxuICAgIHRoaXMuX3N0b3JlSWQgPSBfY29uc3RhbnRzLkxTICsgXCJfXCIgKyBjb250YWluZXJJZDtcbiAgICAvLyBpZiBkYXRhIGV4aXN0cyAtIHRha2UgaXQgZnJvbSBsb2NhbCBzdG9yYWdlXG4gICAgdGhpcy5fZGF0YSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5fc3RvcmVJZCkpIHx8IFtdO1xuICAgIHRoaXMuX3NvcnRlZCA9IDE7XG4gICAgdGhpcy5fc2lnbiA9IFwiJFwiO1xuXG4gICAgLy8gbWFpbiByZW5kZXJcbiAgICB0aGlzLl9yZW5kZXIoKTtcblxuICAgIC8vIGdldCBlbGVtZW50cyBmb3IgZWFzaWVyIHVzYWdlXG4gICAgdGhpcy5fd2lkZ2V0ID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcihcIi5cIiArIF9jb25zdGFudHMuQ1NTWyd3J10pO1xuICAgIHRoaXMuX2V4cGFuZEJ0biA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIuXCIgKyBfY29uc3RhbnRzLkNTU1snd19leHBhbmQnXSk7XG4gICAgdGhpcy5fbmFtZUlucHV0ID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcihcIltuYW1lPVxcXCJ3X25hbWVcXFwiXVwiKTtcbiAgICB0aGlzLl9hbW91bnRJbnB1dCA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCJbbmFtZT1cXFwid19hbW91bnRcXFwiXVwiKTtcbiAgICB0aGlzLl9zdWJtaXRCdG4gPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiW25hbWU9XFxcIndfc3VibWl0XFxcIl1cIik7XG4gICAgdGhpcy5fZGF0YVRhYmxlID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcihcIi5cIiArIF9jb25zdGFudHMuQ1NTWyd3LXRibF9ib2R5J10pO1xuICAgIHRoaXMuX3N1bVZhbHVlID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcihcIi5cIiArIF9jb25zdGFudHMuQ1NTWyd3LXN1bV92YWwnXSk7XG4gICAgdGhpcy5fc29ydEJ0biA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS13LXNvcnRieW5hbWVdXCIpO1xuXG4gICAgLy8gYWRkIGV2ZW50IGhhbmRsZXJzIGFmdGVyIGh0bWwgaXMgcmVuZGVyZWRcbiAgICB0aGlzLl9leHBhbmRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmV4cGFuZFdpZGdldC5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gICAgdGhpcy5fc3VibWl0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fc3VibWl0SGFuZGxlci5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gICAgdGhpcy5fc29ydEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX3NvcnRIYW5kbGVyLmJpbmQodGhpcyksIGZhbHNlKTtcbiAgICB0aGlzLl93aWRnZXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uIChldikge1xuICAgICAgdmFyIGUgPSBldiB8fCB3aW5kb3cuZXZlbnQ7XG5cbiAgICAgIGlmIChlLmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgIHRoaXMuX3N1Ym1pdEhhbmRsZXIoKTtcbiAgICAgIH1cbiAgICB9LmJpbmQodGhpcyksIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxyXG4gICAqIEhhbmRsZXMgc29ydCBldmVudC5cclxuICAgKiBAcGFyYW0gZVxyXG4gICAqIEBwcml2YXRlXHJcbiAgICovXG5cblxuICBfY3JlYXRlQ2xhc3MoV2lkZ2V0LCBbe1xuICAgIGtleTogXCJfc29ydEhhbmRsZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3NvcnRIYW5kbGVyKGUpIHtcbiAgICAgIHZhciBlbCA9IGUuY3VycmVudFRhcmdldDtcblxuICAgICAgdGhpcy5fc29ydGVkID0gdGhpcy5fc29ydGVkID09PSAxID8gLTEgOiAxO1xuICAgICAgZWwuc2V0QXR0cmlidXRlKCdkYXRhLXctc29ydGJ5bmFtZScsIHRoaXMuX3NvcnRlZCk7XG4gICAgICB0aGlzLl9zb3J0RGF0YSgpO1xuICAgICAgdGhpcy5fZGF0YVRhYmxlLmlubmVySFRNTCA9IHRoaXMuX2dlbmVyYXRlRGF0YVJvd3MoKTtcbiAgICB9XG5cbiAgICAvKipcclxuICAgICAqIEV2ZW50IGhhbmRsZXIgZm9yIGFkZGluZyBuZXcgZGF0YS5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIl9zdWJtaXRIYW5kbGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9zdWJtaXRIYW5kbGVyKCkge1xuICAgICAgaWYgKCF0aGlzLl9uYW1lSW5wdXQudmFsaWRpdHkudmFsaWQgfHwgIXRoaXMuX2Ftb3VudElucHV0LnZhbGlkaXR5LnZhbGlkKSB7XG4gICAgICAgIGFsZXJ0KCdwbHogZW50ZXIgdmFsaWQgZGF0YScpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHZhciBuYW1lID0gdGhpcy5fbmFtZUlucHV0LnZhbHVlO1xuICAgICAgdmFyIGFtb3VudCA9ICcnICsgdGhpcy5fYW1vdW50SW5wdXQudmFsdWU7XG4gICAgICB2YXIgZGF0YSA9IHsgbmFtZTogbmFtZSwgYW1vdW50OiBhbW91bnQgfTtcblxuICAgICAgdGhpcy5fbmFtZUlucHV0LnZhbHVlID0gJyc7XG4gICAgICB0aGlzLl9hbW91bnRJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgdGhpcy5hZGREYXRhKGRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlcyBBbW91bnQuXHJcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIHdpZGdldCBTaWduICsgdG90YWwgYW1tb3VudC5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIl9jYWxjdWxhdGVBbW91bnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2NhbGN1bGF0ZUFtb3VudCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zaWduICsgdGhpcy5fZGF0YS5yZWR1Y2UoZnVuY3Rpb24gKHByZXYsIGN1cnIpIHtcbiAgICAgICAgcmV0dXJuIHByZXYgKyAocGFyc2VGbG9hdChjdXJyLmFtb3VudCkgfHwgMCk7XG4gICAgICB9LCAwKTtcbiAgICB9XG5cbiAgICAvKipcclxuICAgICAqIEdlbmVyYXRlcyBodG1sIHJvd3Mgd2l0aCBkYXRhLlxyXG4gICAgICogQHJldHVybnMge3N0cmluZ30gLSBodG1sIG9mIHRhYmxlIHJvd3Mgd2l0aCBkYXRhLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiX2dlbmVyYXRlRGF0YVJvd3NcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX2dlbmVyYXRlRGF0YVJvd3MoKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICByZXR1cm4gdGhpcy5fZGF0YS5tYXAoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIFwiXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJcIiArIF9jb25zdGFudHMuQ1NTWyd3LXRibF90ciddICsgXCJcXFwiPlxcbiAgICAgICAgICBcIiArIE9iamVjdC5rZXlzKGRhdGEpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgdmFyIHRleHQgPSBrZXkgPT09IFwiYW1vdW50XCIgPyBfdGhpcy5fc2lnbiArIHBhcnNlRmxvYXQoZGF0YVtrZXldKSA6IGRhdGFba2V5XTtcblxuICAgICAgICAgIHJldHVybiBcIlxcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiXCIgKyBfY29uc3RhbnRzLkNTU1sndy10YmxfdGQnXSArIFwiXFxcIj5cXG4gICAgICAgICAgICAgICAgPHNwYW4+XCIgKyB0ZXh0ICsgXCI8L3NwYW4+XFxuICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICBcIjtcbiAgICAgICAgfSkuam9pbihcIlwiKSArIFwiXFxuICAgICAgICA8L2Rpdj5cXG4gICAgICAgIFwiO1xuICAgICAgfSkuam9pbihcIlwiKTtcbiAgICB9XG5cbiAgICAvKipcclxuICAgICAqIFNvcnRzIHdpZGdldCBkYXRhLlxyXG4gICAgICogQHJldHVybnMge0FycmF5fSAtIHNvcnRlZCB3aWRnZXQgZGF0YS5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIl9zb3J0RGF0YVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfc29ydERhdGEoKSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgcmV0dXJuIHRoaXMuX2RhdGEuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICBpZiAoYS5uYW1lLnRvTG93ZXJDYXNlKCkgPCBiLm5hbWUudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgIHJldHVybiAtX3RoaXMyLl9zb3J0ZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYS5uYW1lLnRvTG93ZXJDYXNlKCkgPiBiLm5hbWUudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgIHJldHVybiBfdGhpczIuX3NvcnRlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXHJcbiAgICAgKiBSZW5kZXJzIHRoZSBodG1sIGludG8gc3BlY2lmaWVkIGNvbnRhaW5lci5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcIl9yZW5kZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX3JlbmRlcigpIHtcbiAgICAgIHZhciB0b3RhbEFtb3VudCA9IHRoaXMuX2NhbGN1bGF0ZUFtb3VudCgpO1xuICAgICAgdmFyIHJvd3MgPSB0aGlzLl9nZW5lcmF0ZURhdGFSb3dzKCk7XG5cbiAgICAgIHZhciB0ZW1wbGF0ZSA9IFwiPGRpdiBjbGFzcz1cXFwiXCIgKyBfY29uc3RhbnRzLkNTU1sndyddICsgXCJcXFwiIHRhYmluZGV4PVxcXCIwXFxcIj5cXG4gICAgICAgIDxoZWFkZXIgY2xhc3M9XFxcIlwiICsgX2NvbnN0YW50cy5DU1NbJ3dfaGVhZCddICsgXCJcXFwiPlxcbiAgICAgICAgICA8aDMgY2xhc3M9XFxcIlwiICsgX2NvbnN0YW50cy5DU1NbJ3dfdGl0bGUnXSArIFwiXFxcIj5cIiArIHRoaXMudGl0bGUgKyBcIjwvaDM+XFxuICAgICAgICAgIDxkaXYgY2xhc3M9XFxcIlwiICsgX2NvbnN0YW50cy5DU1NbJ3dfZXhwYW5kJ10gKyBcIlxcXCI+PC9kaXY+XFxuICAgICAgICA8L2hlYWRlcj5cXG4gICAgICAgIDxzZWN0aW9uIGNsYXNzPVxcXCJcIiArIF9jb25zdGFudHMuQ1NTWyd3X2JvZHknXSArIFwiXFxcIj5cXG4gICAgICAgICAgPGRpdiBjbGFzcz1cXFwiXCIgKyBfY29uc3RhbnRzLkNTU1sndy10YmwnXSArIFwiXFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJcIiArIF9jb25zdGFudHMuQ1NTWyd3LXRibF9oZWFkJ10gKyBcIlxcXCI+XFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJcIiArIF9jb25zdGFudHMuQ1NTWyd3LXRibF90ciddICsgXCJcXFwiPlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJcIiArIF9jb25zdGFudHMuQ1NTWyd3LXRibF90ZCddICsgXCJcXFwiPlxcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcIlwiICsgX2NvbnN0YW50cy5DU1NbJ3ctdGJsX2hlYWQtaSddICsgXCJcXFwiXFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS13LXNvcnRieW5hbWU9XFxcIlwiICsgdGhpcy5fc29ydGVkICsgXCJcXFwiPlwiICsgX2NvbnN0YW50cy5URVhULm5hbWUgKyBcIjwvZGl2PlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiXCIgKyBfY29uc3RhbnRzLkNTU1sndy10YmxfdGQnXSArIFwiXFxcIj5cXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJcIiArIF9jb25zdGFudHMuQ1NTWyd3LXRibF9oZWFkLWknXSArIFwiXFxcIj5cIiArIF9jb25zdGFudHMuVEVYVC5hbW91bnQgKyBcIjwvZGl2PlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcIlwiICsgX2NvbnN0YW50cy5DU1NbJ3ctdGJsX2JvZHknXSArIFwiXFxcIj5cXG4gICAgICAgICAgICAgIFwiICsgcm93cyArIFwiXFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgPC9zZWN0aW9uPlxcbiAgICAgICAgPGZvb3RlciBjbGFzcz1cXFwiXCIgKyBfY29uc3RhbnRzLkNTU1snd19mb290ZXInXSArIFwiXFxcIj5cXG4gICAgICAgICAgPGRpdiBjbGFzcz1cXFwiXCIgKyBfY29uc3RhbnRzLkNTU1sndy1mb3JtJ10gKyBcIlxcXCI+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiXCIgKyBfY29uc3RhbnRzLkNTU1sndy1mb3JtX2NlbGwnXSArIFwiXFxcIj5cXG4gICAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cXFwiXCIgKyBfY29uc3RhbnRzLkNTU1sndy1mb3JtX2lucHV0J10gKyBcIlxcXCIgXFxuICAgICAgICAgICAgICAgICAgICB0eXBlPVxcXCJ0ZXh0XFxcIlxcbiAgICAgICAgICAgICAgICAgICAgbmFtZT1cXFwid19uYW1lXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XFxcIkphbmUgRG9lXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ9XFxcInJlcXVpcmVkXFxcIlxcbiAgICAgICAgICAgICAgICAgICAgcGF0dGVybj1cXFwiW2EtekEtWi0mXVthLXpBLVotJiBdK1xcXCIvPlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcIlwiICsgX2NvbnN0YW50cy5DU1NbJ3ctZm9ybV9jZWxsJ10gKyBcIlxcXCI+XFxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwiXCIgKyBfY29uc3RhbnRzLkNTU1sndy1mb3JtX3N5bWJvbCddICsgXCJcXFwiPlwiICsgdGhpcy5fc2lnbiArIFwiPC9zcGFuPlxcbiAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVxcXCJcIiArIF9jb25zdGFudHMuQ1NTWyd3LWZvcm1faW5wdXQnXSArIFwiIFwiICsgX2NvbnN0YW50cy5DU1NbJ3ctZm9ybV9pbnB1dF92YWwnXSArIFwiXFxcIiBcXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XFxcInRleHRcXFwiXFxuICAgICAgICAgICAgICAgICAgICBuYW1lPVxcXCJ3X2Ftb3VudFxcXCJcXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVxcXCIxOS45OVxcXCJcXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkPVxcXCJyZXF1aXJlZFxcXCJcXG4gICAgICAgICAgICAgICAgICAgIHBhdHRlcm49XFxcIlxcXFxkKyguXFxcXGR7Mn0pP1xcXCIvPlxcbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwiXCIgKyBfY29uc3RhbnRzLkNTU1sndy1mb3JtX3N1Ym1pdCddICsgXCJcXFwiIG5hbWU9XFxcIndfc3VibWl0XFxcIj48L2J1dHRvbj5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgIDxkaXYgY2xhc3M9XFxcIlwiICsgX2NvbnN0YW50cy5DU1NbJ3ctc3VtJ10gKyBcIlxcXCI+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiXCIgKyBfY29uc3RhbnRzLkNTU1sndy1zdW1fdGV4dCddICsgXCJcXFwiPlwiICsgX2NvbnN0YW50cy5URVhULnRvdGFsICsgXCI8L2Rpdj4gICAgICAgICAgIFxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcIlwiICsgX2NvbnN0YW50cy5DU1NbJ3ctc3VtX3ZhbCddICsgXCJcXFwiPlwiICsgdG90YWxBbW91bnQgKyBcIjwvZGl2PlxcbiAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDwvZm9vdGVyPlxcbiAgICAgIDwvZGl2PlwiO1xuXG4gICAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcbiAgICB9XG5cbiAgICAvKipcclxuICAgICAqIEV4cGFuZHMgV2lkZ2V0LlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJleHBhbmRXaWRnZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZXhwYW5kV2lkZ2V0KCkge1xuICAgICAgaWYgKHRoaXMuX3dpZGdldC5jbGFzc0xpc3QuY29udGFpbnMoX2NvbnN0YW50cy5DU1NbJ3ctLWNvbGxhcHNlZCddKSkge1xuICAgICAgICB0aGlzLl93aWRnZXQuY2xhc3NMaXN0LnJlbW92ZShfY29uc3RhbnRzLkNTU1sndy0tY29sbGFwc2VkJ10pO1xuICAgICAgICB0aGlzLl9leHBhbmRCdG4uY2xhc3NMaXN0LnJlbW92ZShfY29uc3RhbnRzLkNTU1snd19leHBhbmQtLWFjdGl2ZSddKTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3dpZGdldC5jbGFzc0xpc3QuYWRkKF9jb25zdGFudHMuQ1NTWyd3LS1jb2xsYXBzZWQnXSk7XG4gICAgICB0aGlzLl9leHBhbmRCdG4uY2xhc3NMaXN0LmFkZChfY29uc3RhbnRzLkNTU1snd19leHBhbmQtLWFjdGl2ZSddKTtcbiAgICB9XG5cbiAgICAvKipcclxuICAgICAqIEFkZCBuZXcgZGF0YSB0byB0aGUgc3RvcmFnZSBhbmQgdXBkYXRlcyB0aGUgaHRtbC5cclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIC0gbmV3IGRhdGEgXHJcbiAgICAgKiBAcmV0dXJucyB7Kn1cclxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiYWRkRGF0YVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGREYXRhKGRhdGEpIHtcbiAgICAgIGlmICghX3V0aWxzMi5kZWZhdWx0LmlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoJ2Ftb3VudCcpKSB7XG4gICAgICAgIGRhdGFbJ2Ftb3VudCddID0gcGFyc2VGbG9hdChkYXRhWydhbW91bnQnXSkudG9GaXhlZCgyKSArICcnO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9kYXRhLnB1c2goZGF0YSk7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLl9zdG9yZUlkLCBKU09OLnN0cmluZ2lmeSh0aGlzLl9zb3J0RGF0YSgpKSk7XG4gICAgICB0aGlzLl9kYXRhVGFibGUuaW5uZXJIVE1MID0gdGhpcy5fZ2VuZXJhdGVEYXRhUm93cygpO1xuICAgICAgdGhpcy5fc3VtVmFsdWUuaW5uZXJIVE1MID0gdGhpcy5fY2FsY3VsYXRlQW1vdW50KCk7XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBhbGwgZGF0YSBmcm9tIHdpZGdldCB0YWJsZS5cclxuICAgICAqIEByZXR1cm5zIHsqfVxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJjbGVhckRhdGFcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2xlYXJEYXRhKCkge1xuICAgICAgdGhpcy5fZGF0YSA9IFtdO1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5fc3RvcmVJZCwgSlNPTi5zdHJpbmdpZnkodGhpcy5fZGF0YSkpO1xuXG4gICAgICB0aGlzLl9kYXRhVGFibGUuaW5uZXJIVE1MID0gdGhpcy5fZ2VuZXJhdGVEYXRhUm93cygpO1xuICAgICAgdGhpcy5fc3VtVmFsdWUuaW5uZXJIVE1MID0gdGhpcy5fY2FsY3VsYXRlQW1vdW50KCk7XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSB3aWRnZXQgZGF0YS5cclxuICAgICAqIEByZXR1cm4ge2pzb259IFRoZSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHdpZGdldCBkYXRhLlxyXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJnZXREYXRhXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldERhdGEoKSB7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5fZGF0YSwgbnVsbCwgMSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFdpZGdldDtcbn0oKTtcblxud2luZG93WydXaWRnZXQnXSA9IHdpbmRvd1snV2lkZ2V0J10gfHwgV2lkZ2V0OyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuLyoqXHJcbiAqIENvbnN0YW50cyBtb2R1bGVcclxuICovXG5cbi8qKiBDU1MgY2xhc3Nlcy4gKi9cbnZhciBDU1MgPSBleHBvcnRzLkNTUyA9IHtcbiAgXCJ3XCI6IFwid2lkZ2V0XCIsXG4gIFwidy0tY29sbGFwc2VkXCI6IFwid2lkZ2V0X2NvbGxhcHNlZFwiLFxuICBcIndfaGVhZFwiOiBcIndpZGdldF9faGVhZGVyXCIsXG4gIFwid19ib2R5XCI6IFwid2lkZ2V0X19ib2R5XCIsXG4gIFwid19mb290ZXJcIjogXCJ3aWRnZXRfX2Zvb3RlclwiLFxuICBcIndfdGl0bGVcIjogXCJ3aWRnZXRfX3RpdGxlXCIsXG4gIFwid19leHBhbmRcIjogXCJ3aWRnZXRfX2V4cGFuZC1idG5cIixcbiAgXCJ3X2V4cGFuZC0tYWN0aXZlXCI6IFwid2lkZ2V0X19leHBhbmQtYnRuX2FjdGl2ZVwiLFxuICBcInctdGJsXCI6IFwid2lkZ2V0LXRhYmxlXCIsXG4gIFwidy10YmxfaGVhZFwiOiBcIndpZGdldC10YWJsZV9faGVhZFwiLFxuICBcInctdGJsX3RyXCI6IFwid2lkZ2V0LXRhYmxlX190clwiLFxuICBcInctdGJsX2hlYWQtaVwiOiBcIndpZGdldC10YWJsZV9faGVhZC1pdGVtXCIsXG4gIFwidy10YmxfdGRcIjogXCJ3aWRnZXQtdGFibGVfX3RkXCIsXG4gIFwidy10YmxfYm9keVwiOiBcIndpZGdldC10YWJsZV9fYm9keVwiLFxuICBcInctZm9ybVwiOiBcIndpZGdldC1mb3JtXCIsXG4gIFwidy1mb3JtX2NlbGxcIjogXCJ3aWRnZXQtZm9ybV9fY2VsbFwiLFxuICBcInctZm9ybV9pbnB1dFwiOiBcIndpZGdldC1mb3JtX19pbnB1dFwiLFxuICBcInctZm9ybV9pbnB1dF92YWxcIjogXCJ3aWRnZXQtZm9ybV9faW5wdXRfdmFsXCIsXG4gIFwidy1mb3JtX3N5bWJvbFwiOiBcIndpZGdldC1mb3JtX19zeW1ib2xcIixcbiAgXCJ3LWZvcm1fc3VibWl0XCI6IFwid2lkZ2V0LWZvcm1fX3N1Ym1pdFwiLFxuICBcInctc3VtXCI6IFwid2lkZ2V0LXN1bVwiLFxuICBcInctc3VtX3RleHRcIjogXCJ3aWRnZXQtc3VtX190ZXh0XCIsXG4gIFwidy1zdW1fdmFsXCI6IFwid2lkZ2V0LXN1bV9fdmFsdWVcIlxufTtcblxuLyoqIFRleHQgd2l0aGluIHdpZGdldC4gKi9cbnZhciBURVhUID0gZXhwb3J0cy5URVhUID0ge1xuICBcIm5hbWVcIjogXCJOYW1lXCIsXG4gIFwiYW1vdW50XCI6IFwiQW1vdW50XCIsXG4gIFwidG90YWxcIjogXCJUb3RhbFwiXG59O1xuXG4vKiogTmFtZSBvZiBMb2NhbFN0b3JhZ2UgKi9cbnZhciBMUyA9IGV4cG9ydHMuTFMgPSBcIndpZGdldERhdGFcIjsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbi8qKlxyXG4gKiBVdGlscyBtb2R1bGUuXHJcbiAqL1xudmFyIHV0aWxzID0ge1xuICBpc09iamVjdDogZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAhPT0gbnVsbCAmJiAodHlwZW9mIG9iaiA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKG9iaikpID09PSBcIm9iamVjdFwiO1xuICB9LFxuICBpc1N0cmluZzogZnVuY3Rpb24gaXNTdHJpbmcoc3RyKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzdHIgPT09IFwic3RyaW5nXCI7XG4gIH0sXG4gIGlzTnVtYmVyOiBmdW5jdGlvbiBpc051bWJlcihudW0pIHtcbiAgICByZXR1cm4gbnVtICE9ICcnICYmICFpc05hTihwYXJzZUZsb2F0KG51bSkpO1xuICB9XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSB1dGlsczsiXX0=
