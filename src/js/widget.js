

var Widget = (function() {
  
  const CSS = {
    "w": "widget",
    "w--collapsed": "widget_collapsed",
    "w_head": "widget__header",
    "w_title": "widget__title",
    "w_expand": "widget__expand-btn",
    "w_expand--active": "widget__expand-btn_active",
    "w_body": "widget__body",
    "w_footer": "widget__footer",
    "w-sum": "widget-sum",
    "w-sum_text": "widget-sum__text",
    "w-sum_val": "widget-sum__value"
  };
  
  class Widget {    
    constructor(container = document.body, title = "Expenses") {
      this.container = container;
      this.title = title;
      this._data = [
        {name: 'abramov', value: 5},
        {name: 'abramov2', value: 32},
        {name: 'abramov3'}
      ];      
     
      this._render();
      this._widget = this.container.querySelector(`.${CSS['w']}`);
      this._expandBtn = this.container.querySelector(`.${CSS['w_expand']}`);

      this._expandBtn.addEventListener('click', this.expandWidget.bind(this), false);
    }
    
    _calculateAmount() {
      return this._data.reduce((prev, curr) => {
        return prev + (curr.value || 0);
      }, 0);
    }
    
    _generateTemplate() {
      let amount = this._calculateAmount();
      
      let template =
        `<div class="${CSS['w']}">
        <header class="${CSS['w_head']}">
          <h3 class="${CSS['w_title']}">${this.title}</h3>
          <div class="${CSS['w_expand']}"></div>
        </header>
        <section class="widget__body">
          <div class="widget-table">
            <div class="widget-table__head">
              <div class="widget-table__tr">
                <div class="widget-table__td">
                  <div class="widget-table__head-item">Name</div>
                </div>
                <div class="widget-table__td">
                  <div class="widget-table__head-item">Amount</div>
                </div>
              </div>
            </div>
            <div class="widget-table__body">
              <div class="widget-table__tr">
                <div class="widget-table__td"><span>1</span></div>
                <div class="widget-table__td"><span>2</span></div>
              </div>
                            <div class="widget-table__tr">
                <div class="widget-table__td"><span>1</span></div>
                <div class="widget-table__td"><span>2</span></div>
              </div>
                            <div class="widget-table__tr">
                <div class="widget-table__td"><span>1</span></div>
                <div class="widget-table__td"><span>2</span></div>
              </div>
                            <div class="widget-table__tr">
                <div class="widget-table__td"><span>1</span></div>
                <div class="widget-table__td"><span>2</span></div>
              </div>
                            <div class="widget-table__tr">
                <div class="widget-table__td"><span>1</span></div>
                <div class="widget-table__td"><span>2</span></div>
              </div>
                            <div class="widget-table__tr">
                <div class="widget-table__td"><span>1</span></div>
                <div class="widget-table__td"><span>2</span></div>
              </div>
                            <div class="widget-table__tr">
                <div class="widget-table__td"><span>1</span></div>
                <div class="widget-table__td"><span>2</span></div>
              </div>
                            <div class="widget-table__tr">
                <div class="widget-table__td"><span>1</span></div>
                <div class="widget-table__td"><span>2</span></div>
              </div>
            </div>
          </div>
        </section>
        <footer class="${CSS['w_footer']}">
          <div class="widget-form">
            <div class="widget-form__cell">
              <input class="widget-form__input" 
                    type="text"
                    name="w_name"/>
            </div>
            <div class="widget-form__cell">
              <span class="widget-form__symbol"></span>
              <input class="widget-form__input widget-form__input_val" 
                    type="text"
                    name="w_value"/>
              <button class="widget-form__submit" name="w_submit"></button>
            </div>
          </div>
          <div class="widget-sum">
            <div class="widget-sum__text">Total</div>           
            <div class="widget-sum__value">${amount}</div>
          </div>
        </footer>
      </div>`;

      return template;
    }
    
    _render() {     
      this.container.innerHTML = this._generateTemplate();
    }
    
    expandWidget(e) {
      if (this._widget.classList.contains(CSS['w--collapsed'])) {
        this._widget.classList.remove(CSS['w--collapsed']);
        this._expandBtn.classList.remove(CSS['w_expand--active']);
        
        return false;
      }

      this._widget.classList.add(CSS['w--collapsed']);
      this._expandBtn.classList.add(CSS['w_expand--active']);
    }
    
    getData() {
      return JSON.stringify(this._data, null, 1);
    }
  }
  
  return Widget;
}());

