class Box {
  constructor(index) {
    this.id = `box-${index}`;
    this.symbol = index;
  };

  get isEmpty() {
    return this.symbol !== 'O' && this.symbol !== 'X';
  }

  populateBox() {
    const htmlSpace = `<li id=${this.id} class="box"></li>`;
    $('.boxes').append(htmlSpace);
  }

  addBoxClass(boxClass) {
    $(`#${this.id}`).addClass(boxClass);
  }

  mark(symbol) {
    this.symbol = symbol;
  }
}