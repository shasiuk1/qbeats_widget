"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Widget = function () {

  var CSS = {
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

  var TEXT = {
    "name": "Name",
    "amount": "Amount",
    "total": "Total"
  };

  var SIGN = "$";

  var LS = "widgetData";

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

  var Widget = function () {
    function Widget(containerId) {
      var title = arguments.length <= 1 || arguments[1] === undefined ? "Expenses" : arguments[1];

      _classCallCheck(this, Widget);

      this.container = document.getElementById(containerId);
      this.title = title;
      this._storeId = LS + "_" + containerId;
      this._data = JSON.parse(localStorage.getItem(this._storeId)) || [];
      this._sorted = true;

      this._render();

      this._widget = this.container.querySelector("." + CSS['w']);
      this._expandBtn = this.container.querySelector("." + CSS['w_expand']);
      this._nameInput = this.container.querySelector("[name=\"w_name\"]");
      this._amountInput = this.container.querySelector("[name=\"w_amount\"]");
      this._submitBtn = this.container.querySelector("[name=\"w_submit\"]");
      this._dataTable = this.container.querySelector("." + CSS['w-tbl_body']);
      this._sumValue = this.container.querySelector("." + CSS['w-sum_val']);
      this._sortBtn = this.container.querySelector("[data-w-datasorted]");

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

    _createClass(Widget, [{
      key: "_sortHandler",
      value: function _sortHandler(e) {
        var el = e.currentTarget;

        this._sorted = !this._sorted;
        this._sortData();
        this._dataTable.innerHTML = this._generateDataRows();
        el.setAttribute('data-w-datasorted', this._sorted);
      }
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
    }, {
      key: "_calculateAmount",
      value: function _calculateAmount() {
        return SIGN + this._data.reduce(function (prev, curr) {
          return prev + (parseFloat(curr.amount) || 0);
        }, 0);
      }
    }, {
      key: "_generateDataRows",
      value: function _generateDataRows() {
        return this._data.map(function (data) {
          return "\n        <div class=\"" + CSS['w-tbl_tr'] + "\">\n          " + Object.keys(data).map(function (key) {
            var text = key === "amount" ? SIGN + parseFloat(data[key]) : data[key];

            return "\n              <div class=\"" + CSS['w-tbl_td'] + "\">\n                <span>" + text + "</span>\n              </div>\n            ";
          }).join("") + "\n        </div>\n        ";
        }).join("");
      }
    }, {
      key: "_sortData",
      value: function _sortData() {
        if (this._sorted) {
          this._data.sort(function (a, b) {
            return b.amount - a.amount;
          });
        } else {
          this._data.sort(function (a, b) {
            return a.amount - b.amount;
          });
        }

        return this._data;
      }
    }, {
      key: "_render",
      value: function _render() {
        var totalAmount = this._calculateAmount();
        var rows = this._generateDataRows();

        var template = "<div class=\"" + CSS['w'] + "\" tabindex=\"0\">\n        <header class=\"" + CSS['w_head'] + "\">\n          <h3 class=\"" + CSS['w_title'] + "\">" + this.title + "</h3>\n          <div class=\"" + CSS['w_expand'] + "\"></div>\n        </header>\n        <section class=\"" + CSS['w_body'] + "\">\n          <div class=\"" + CSS['w-tbl'] + "\">\n            <div class=\"" + CSS['w-tbl_head'] + "\">\n              <div class=\"" + CSS['w-tbl_tr'] + "\">\n                <div class=\"" + CSS['w-tbl_td'] + "\">\n                  <div class=\"" + CSS['w-tbl_head-i'] + "\"\n                        data-w-datasorted=\"" + this._sorted + "\">" + TEXT.name + "</div>\n                </div>\n                <div class=\"" + CSS['w-tbl_td'] + "\">\n                  <div class=\"" + CSS['w-tbl_head-i'] + "\">" + TEXT.amount + "</div>\n                </div>\n              </div>\n            </div>\n            <div class=\"" + CSS['w-tbl_body'] + "\">\n              " + rows + "\n            </div>\n          </div>\n        </section>\n        <footer class=\"" + CSS['w_footer'] + "\">\n          <div class=\"" + CSS['w-form'] + "\">\n            <div class=\"" + CSS['w-form_cell'] + "\">\n              <input class=\"" + CSS['w-form_input'] + "\" \n                    type=\"text\"\n                    name=\"w_name\"\n                    placeholder=\"Jane Doe\"\n                    required=\"required\"\n                    pattern=\"[a-zA-Z-&][a-zA-Z-& ]+\"/>\n            </div>\n            <div class=\"" + CSS['w-form_cell'] + "\">\n              <span class=\"" + CSS['w-form_symbol'] + "\">" + SIGN + "</span>\n              <input class=\"" + CSS['w-form_input'] + " " + CSS['w-form_input_val'] + "\" \n                    type=\"text\"\n                    name=\"w_amount\"\n                    placeholder=\"19.99\"\n                    required=\"required\"\n                    pattern=\"\\d+(.\\d{2})?\"/>\n              <button class=\"" + CSS['w-form_submit'] + "\" name=\"w_submit\"></button>\n            </div>\n          </div>\n          <div class=\"" + CSS['w-sum'] + "\">\n            <div class=\"" + CSS['w-sum_text'] + "\">" + TEXT.total + "</div>           \n            <div class=\"" + CSS['w-sum_val'] + "\">" + totalAmount + "</div>\n          </div>\n        </footer>\n      </div>";

        this.container.innerHTML = template;
      }
    }, {
      key: "expandWidget",
      value: function expandWidget() {
        if (this._widget.classList.contains(CSS['w--collapsed'])) {
          this._widget.classList.remove(CSS['w--collapsed']);
          this._expandBtn.classList.remove(CSS['w_expand--active']);

          return false;
        }

        this._widget.classList.add(CSS['w--collapsed']);
        this._expandBtn.classList.add(CSS['w_expand--active']);
      }
    }, {
      key: "addData",
      value: function addData(data) {
        if (!utils.isObject(data)) {
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
    }, {
      key: "clearData",
      value: function clearData() {
        this._data = [];
        localStorage.setItem(this._storeId, JSON.stringify(this._data));

        this._dataTable.innerHTML = this._generateDataRows();
        this._sumValue.innerHTML = this._calculateAmount();

        return this;
      }
    }, {
      key: "getData",
      value: function getData() {
        return JSON.stringify(this._data, null, 1);
      }
    }]);

    return Widget;
  }();

  return Widget;
}();