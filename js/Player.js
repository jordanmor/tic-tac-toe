class Player {
  constructor(id) {
    this.id = `player${id}`;
    this.name = `Player ${id}`;
    this.boxClass = `box-filled-${id}`;
    this.active = false;
    this.isComputer = false;
  }

  get symbol() {
    return this.id === 'player1' ? 'O' : 'X';
  }
 
  get winMessage() {
    return `${this.name} Wins!`;
  }

  get screenWinClass() {
    return this.id === 'player1' ? 'screen-win-one' : 'screen-win-two';
  }

  get bgImage() {
    return this.id === 'player1' ? 'url(img/o.svg)' : 'url(img/x.svg)';
  }

  addActiveClass() {
    $('.players').removeClass('active');
    $(`#${this.id}`).addClass('active');
  }
}