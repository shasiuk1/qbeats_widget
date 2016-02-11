import utils from "./utils";
import {CSS, TEXT, LS} from "./constants";

/** Class representing the Widget. */
class Widget {
  /**
   * Create a Widget.
   * @param {string} containerId - ID selector of element where the widget is placed.
   * @param {string} title - Main title of Widget.
   */
  constructor(containerId, title = "Expenses") {
    this.container = document.getElementById(containerId);
    this.title = title;
    // to have different storages for each widget, we add containers ID
    this._storeId = `${LS}_${containerId}`;
    // if data exists - take it from local storage
    this._data = JSON.parse(localStorage.getItem(this._storeId)) || [];
    this._sorted = 1;
    this._sign = "$";
    
    // main render
    this._render();
    
    // get elements for easier usage
    this._widget = this.container.querySelector(`.${CSS['w']}`);
    this._expandBtn = this.container.querySelector(`.${CSS['w_expand']}`);
    this._nameInput = this.container.querySelector(`[name="w_name"]`);
    this._amountInput = this.container.querySelector(`[name="w_amount"]`);
    this._submitBtn = this.container.querySelector(`[name="w_submit"]`);
    this._dataTable = this.container.querySelector(`.${CSS['w-tbl_body']}`);
    this._sumValue = this.container.querySelector(`.${CSS['w-sum_val']}`);
    this._sortBtn = this.container.querySelector(`[data-w-sortbyname]`);
    
    // add event handlers after html is rendered
    this._expandBtn.addEventListener('click', this.expandWidget.bind(this), false);
    this._submitBtn.addEventListener('click', this._submitHandler.bind(this), false);
    this._sortBtn.addEventListener('click', this._sortHandler.bind(this), false);
    this._widget.addEventListener('keydown', function (ev) {
      let e = ev || window.event;

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
  _sortHandler(e) {
    let el = e.currentTarget;

    this._sorted = this._sorted === 1 ? -1 : 1;
    el.setAttribute('data-w-sortbyname', this._sorted);
    this._sortData();
    this._dataTable.innerHTML = this._generateDataRows();
  }

  /**
   * Event handler for adding new data.
   * @private
   */
  _submitHandler() {
    if (!this._nameInput.validity.valid || !this._amountInput.validity.valid) {
      alert('plz enter valid data');
      return false;
    }

    let name = this._nameInput.value;
    let amount = '' + this._amountInput.value;
    let data = {name, amount};

    this._nameInput.value = '';
    this._amountInput.value = '';
    this.addData(data);
  }

  /**
   * Calculates Amount.
   * @returns {string} - widget Sign + total ammount.
   * @private
   */
  _calculateAmount() {
    return this._sign + this._data.reduce((prev, curr) => {
        return prev + (parseFloat(curr.amount) || 0);
      }, 0);
  }

  /**
   * Generates html rows with data.
   * @returns {string} - html of table rows with data.
   * @private
   */
  _generateDataRows() {
    return this._data.map((data) =>
      `
        <div class="${CSS['w-tbl_tr']}">
          ${Object.keys(data).map((key) => {
        let text = key === "amount" ? this._sign + parseFloat(data[key]) : data[key];

        return `
              <div class="${CSS['w-tbl_td']}">
                <span>${text}</span>
              </div>
            `;
      }).join("")}
        </div>
        `
    ).join("");
  }

  /**
   * Sorts widget data.
   * @returns {Array} - sorted widget data.
   * @private
   */
  _sortData() {
    return this._data.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -this._sorted;
      }

      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return this._sorted;
      }

      return 0;
    });
  }

  /**
   * Renders the html into specified container.
   * @private
   */
  _render() {
    let totalAmount = this._calculateAmount();
    let rows = this._generateDataRows();

    let template =
      `<div class="${CSS['w']}" tabindex="0">
        <header class="${CSS['w_head']}">
          <h3 class="${CSS['w_title']}">${this.title}</h3>
          <div class="${CSS['w_expand']}"></div>
        </header>
        <section class="${CSS['w_body']}">
          <div class="${CSS['w-tbl']}">
            <div class="${CSS['w-tbl_head']}">
              <div class="${CSS['w-tbl_tr']}">
                <div class="${CSS['w-tbl_td']}">
                  <div class="${CSS['w-tbl_head-i']}"
                        data-w-sortbyname="${this._sorted}">${TEXT.name}</div>
                </div>
                <div class="${CSS['w-tbl_td']}">
                  <div class="${CSS['w-tbl_head-i']}">${TEXT.amount}</div>
                </div>
              </div>
            </div>
            <div class="${CSS['w-tbl_body']}">
              ${rows}
            </div>
          </div>
        </section>
        <footer class="${CSS['w_footer']}">
          <div class="${CSS['w-form']}">
            <div class="${CSS['w-form_cell']}">
              <input class="${CSS['w-form_input']}" 
                    type="text"
                    name="w_name"
                    placeholder="Jane Doe"
                    required="required"
                    pattern="[a-zA-Z-&][a-zA-Z-& ]+"/>
            </div>
            <div class="${CSS['w-form_cell']}">
              <span class="${CSS['w-form_symbol']}">${this._sign}</span>
              <input class="${CSS['w-form_input']} ${CSS['w-form_input_val']}" 
                    type="text"
                    name="w_amount"
                    placeholder="19.99"
                    required="required"
                    pattern="\\d+(.\\d{2})?"/>
              <button class="${CSS['w-form_submit']}" name="w_submit"></button>
            </div>
          </div>
          <div class="${CSS['w-sum']}">
            <div class="${CSS['w-sum_text']}">${TEXT.total}</div>           
            <div class="${CSS['w-sum_val']}">${totalAmount}</div>
          </div>
        </footer>
      </div>`;

    this.container.innerHTML = template;
  }

  /**
   * Expands Widget.
   */
  expandWidget() {
    if (this._widget.classList.contains(CSS['w--collapsed'])) {
      this._widget.classList.remove(CSS['w--collapsed']);
      this._expandBtn.classList.remove(CSS['w_expand--active']);

      return false;
    }

    this._widget.classList.add(CSS['w--collapsed']);
    this._expandBtn.classList.add(CSS['w_expand--active']);
  }

  /**
   * Add new data to the storage and updates the html.
   * @param {object} data - new data 
   * @returns {*}
   */
  addData(data) {
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

  /**
   * Removes all data from widget table.
   * @returns {*}
   */
  clearData() {
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
  getData() {
    return JSON.stringify(this._data, null, 1);
  }
}

window['Widget'] = window['Widget'] || Widget;
