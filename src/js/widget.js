

var Widget = (function() {
  
  const css = {
    "w": "widget",
    "w--collapsed": "widget_collapsed",
    "w_head": "widget__header",
    "w_title": "widget__title",
    "w_expand": "widget__expand-btn",
    "w_expand--active": "widget__expand-btn_active",
    "w_body": "widget__body",
    "w_footer": "widget__footer",
    "w-sum": "widget-sum",
    "w-sum_title": "widget-sum__title",
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
      this._widget = this.container.querySelector(`.${css['w']}`);
      this._expandBtn = this.container.querySelector(`.${css['w_expand']}`);

      this._expandBtn.addEventListener('click', this.expandWidget.bind(this), false);
    }
    
    _calculateAmmount() {
      return this._data.reduce((prev, curr) => {
        return prev + (curr.value || 0);
      }, 0);
    }
    
    _generateTemplate() {
      let ammount = this._calculateAmmount();
      
      let template =
        `<div class="${css['w']}">
        <header class="${css['w_head']}">
          <h3 class="${css['w_title']}">${this.title}</h3>
          <div class="${css['w_expand']}"></div>
        </header>
        <div class="${css['w_body']}">
          <footer class="${css['w_footer']}">
            <div class="${css['w-sum']}">
              <div class="${css['w-sum_title']}">Total:</div>
              <div class="${css['w-sum_val']}">${ammount}</div>
            </div>
          </footer>
        </div>
      </div>`;

      return template;
    }
    
    _render() {     
      this.container.innerHTML = this._generateTemplate();
    }
    
    expandWidget(e) {
      if (this._widget.classList.contains(css['w--collapsed'])) {
        this._widget.classList.remove(css['w--collapsed']);
        this._expandBtn.classList.remove(css['w_expand--active']);
        return false;
      }

      this._widget.classList.add(css['w--collapsed']);
      this._expandBtn.classList.add(css['w_expand--active']);
    }
    
    getData() {
      return JSON.stringify(this._data, null, 1);
    }
  }
  
  return Widget;
})();

