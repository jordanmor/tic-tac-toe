const game = new Game();
game.init();

const $modal = $('.modal');
const $boxes = $('.boxes');

$('.button').on('click', function(e) {
  const buttonText = e.target.textContent;
  // Switch handles all game buttons according to each button's text value 
  switch(buttonText) {
    case '1 player':
      $('#player2Input').hide();
      game.players[1].isComputer = true;
      game.players[1].name = 'Computer';
      $('#player2').children('h2').text('Computer');
      $modal.show();
      break;
    case '2 players':
      $modal.show();
      break;
    case 'Start Game':
      game.startGame();
      break;
    case 'New Game':
      game.newGame();
      break;
    case 'Choose New Players':
      game.restartGame();
  }
});

$boxes.on('click', function(e) {
  game.selectBox(e);
});

$boxes.on('mouseover', 'li', function(e) {
  game.board.handleMouseOver(e.target);
});

$boxes.on('mouseleave', 'li', function(e) {
  game.board.handleMouseLeave(e.target);
});