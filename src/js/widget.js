class Widget {
  constructor(container = document.body) {
    this.container = container;
    this.render();
  }
  
  render() {
    this.container.innerHTML = "init!";
  }
}
