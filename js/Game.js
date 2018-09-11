class Game {
  constructor() {
    this.DOM = {
      board: $('#board'),
      startScreen: $('#start'), 
      finishScreen: $('#finish'), 
      modal: $('#modal')
    };
    this.players = this.createPlayers();
    this.board = new Board(this.players);
    this.computer = new Computer(this.board, this.players);
  }

  get activePlayer() {
    return this.players.find(player => player.active);

  }

  init() {
    this.board.populateHtmlBoard();
  }

  createPlayers() {
    const player1 = new Player(1);
    const player2 = new Player(2);
    return [player1, player2];
  }

  chooseRandomPlayer() {
    const randomIndex = Math.floor(Math.random() * 2);
    const randomPlayer = this.players[randomIndex];
    randomPlayer.active = true;
    randomPlayer.addActiveClass();
  }

  switchPlayers() {
    this.players.forEach(player => player.active = !player.active);
    this.activePlayer.addActiveClass();
  }

  startGame() {
    this.displayNames();
    this.DOM.modal.hide();
    this.DOM.startScreen.hide();
    this.DOM.board.show();
    this.chooseRandomPlayer();

    if(this.activePlayer.isComputer){
      this.computerMove();
    }
  }

  // Starts a new game with the previously chosen players
  newGame() {
    this.resetGame();
    this.chooseRandomPlayer();
    this.DOM.board.show();

    if(this.activePlayer.isComputer){
      this.computerMove();
    }
  }

  // Resets the board and allows user to choose new players before starting the next game
  restartGame() {
    this.resetGame();
    $('#player2Input').show();
    $('#player1').children('h2').text('Player 1');
    $('#player2').children('h2').text('Player 2'); 
    this.players[0].name = 'Player 1';
    this.players[1].name = 'Player 2';
    this.players[1].isComputer = false;

    this.DOM.startScreen.show();
  }

  resetGame() {
    this.DOM.finishScreen.removeClass('screen-win-one screen-win-two screen-win-draw');
    $('.box').removeClass('box-filled-1 box-filled-2').css('cursor', 'pointer');;
    $('.players').removeClass('active');

    this.players.forEach(player => player.active = false);
    this.board.boxes.forEach((box, index) => box.symbol = index);

    this.DOM.finishScreen.hide();
  }

  // Collect and display players names (or default names) above players' symbols during gameplay
  displayNames() {
    const player1Name = $('#player1Input').val();
    const player2Name = $('#player2Input').val();
    if(player1Name) {
      $('#player1').children('h2').text(player1Name);
      this.players[0].name = player1Name;
    }
    if(player2Name) {
      $('#player2').children('h2').text(player2Name);
      this.players[1].name = player2Name;
    }
    $('#player1Input').val('');
    $('#player2Input').val('');
  }
  
  selectBox(target) {
    const selectedBox = this.board.findSelectedBox(target);

    if(selectedBox.isEmpty && !this.activePlayer.isComputer) {
      this.updateGameState(this.activePlayer, selectedBox);
    }
  }

  updateGameState(player, box) {
    const { boxClass, symbol } = player;
    const { boxes } = this.board;
    box.addBoxClass(boxClass);
    box.mark(symbol);

    if (!this.checkForWinner(boxes, player)) {

      if(this.checkForDraw(boxes)) {
        this.DOM.board.hide();
        this.DOM.finishScreen.addClass('screen-win-tie').show().find('.message').text('Draw');
      } else {
        this.switchPlayers();
        if(this.activePlayer.isComputer) {
          window.setTimeout(this.computerMove.bind(this), 2000);
        }
      }

    } else {
      const { screenWinClass, winMessage } = player;
      this.DOM.board.hide();
      this.DOM.finishScreen.addClass(screenWinClass).show().find('.message').text(winMessage);
    }
  }

  checkForWinner(boxes, owner) {
    return  (boxes[0].symbol == owner.symbol && boxes[1].symbol == owner.symbol && boxes[2].symbol == owner.symbol) ||
            (boxes[3].symbol == owner.symbol && boxes[4].symbol == owner.symbol && boxes[5].symbol == owner.symbol) ||
            (boxes[6].symbol == owner.symbol && boxes[7].symbol == owner.symbol && boxes[8].symbol == owner.symbol) ||
            (boxes[0].symbol == owner.symbol && boxes[3].symbol == owner.symbol && boxes[6].symbol == owner.symbol) ||
            (boxes[1].symbol == owner.symbol && boxes[4].symbol == owner.symbol && boxes[7].symbol == owner.symbol) ||
            (boxes[2].symbol == owner.symbol && boxes[5].symbol == owner.symbol && boxes[8].symbol == owner.symbol) ||
            (boxes[0].symbol == owner.symbol && boxes[4].symbol == owner.symbol && boxes[8].symbol == owner.symbol) ||
            (boxes[2].symbol == owner.symbol && boxes[4].symbol == owner.symbol && boxes[6].symbol == owner.symbol)
  }

  checkForDraw(boxes) {
    return boxes.filter(box => box.symbol === 'O' || box.symbol === 'X').length === 9;
  }

  computerMove() {
    const selectedBoxIndex = this.computer.selectBox();
    const selectedBox = this.board.boxes[selectedBoxIndex];
    this.updateGameState(this.players[1], selectedBox);
  }
}