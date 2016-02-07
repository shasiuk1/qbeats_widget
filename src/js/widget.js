

var Widget = (function() {
  
  const css = {
    "w": "widget",
    "w_head": "widget__header",
    "w_title": "widget__title",
    "w_expand": "widget__expand-btn",
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
        {name: 'abramov', value: '54'},
        {name: 'abramov2', value: '134'}
      ];
      
      this.container.addEventListener('click', function(e){
        if (e.target.classList.contains('widget__expand-btn')) {
          e.target.classList.toggle('ff')
        }
      }, false);
      
      this._render();
    }
    
    _generateTemplate() {
      let template =
        `<div class="${css['w']}">
        <header class="${css['w_head']}">
          <h3 class="${css['w_title']}">${this.title}</h3>
          <div class="${css['w_expand']}"></div>
        </header>
        <div class="${css['w_body']}">
          <footer class="${css['w_footer']}">
            <div class="${css['w-sum']}">
              <div class="${css['w-sum_title']}">Total</div>
              <div class="${css['w-sum_val']}">$50</div>
            </div>
          </footer>
        </div>
      </div>`;

      return template;
    }
    
    _render() {
     
      this.container.innerHTML = this._generateTemplate();
    }
    
    getData() {
      return JSON.stringify(this._data, null, 1);
    }
  }
  
  return Widget;
})();

