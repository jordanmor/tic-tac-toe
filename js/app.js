"use strict"

$('body').prepend(`<div class="screen screen-start" id="start">
                    <header>
                      <h1>Tic Tac Toe</h1>
                      <h2 class="start">Start Game</h2>
                      <a href="#" class="button">1 player</a>
                      <a href="#" class="button">2 players</a>
                    </header>
                  </div>
                  <div class="screen screen-win" id="finish">
                    <header>
                        <h1>Tic Tac Toe</h1>
                        <p class="message"></p>
                        <a href="#" class="button">New Game</a>
                    </header>
                  </div>`
);

$('#player1').prepend('<h2>Player 1</h2>');
$('#player2').prepend('<h2>Player 2</h2>');

$('#board').after(`<div id="modal" class="modal">
                    <div class="modal-content">
                      <span class="close">&times;</span>
                      <div class="modal-content-inner">
                        <input type="text" id="player1Input" placeholder="Player 1"/>
                        <input type="text" id="player2Input" placeholder="Player 2"/>
                      </div>
                      <button class="button">Start Game</button>
                    </div>
                  </div>`
);

/*=============-=============-=============-=============
                        COMPONENTS
===============-=============-=============-===========*/

// -- GAME UI COMPONENT -- //

class GameUI {
  constructor() {
    this.$buttons = $('.button');
    this.$board = $('#board');
    this.$boxes = $('.box');
    this.$start = $('#start');
    this.$finish = $('#finish');
    this.$modal = $('#modal');
    this.gamePlay = new GamePlay();

    this.$buttons.on('click', e => this.handleBtnClick(e) );
    $('.close').on('click', () => this.closeModal() );
  }

  init() {
    this.$board.hide();
    this.$finish.hide();
    this.$modal.hide();
  }

  getRandomPlayer() {
    const randomNum = Math.floor(Math.random() * 2) + 1;
    const { player1, player2 } = this.gamePlay;
    return randomNum === 1 ? player1 : player2;
  }

  startGame(player) {
    player.domElement.addClass('active');
    this.displayNames();
    this.$modal.hide();
    this.$start.hide();
    this.$board.show();
  }

  newGame() {
    this.resetGame();
    this.$finish.hide();
    this.$start.show();
  }

  resetGame() {
    const { player1, player2 } = this.gamePlay;
    this.$boxes.removeClass('box-filled-1 box-filled-2');
    this.$finish.removeClass('screen-win-one screen-win-two screen-win-draw');
    player2.input.show();
    player1.domElement.removeClass('active').children('h2').text('Player 1');
    player2.domElement.removeClass('active').children('h2').text('Player 2'); 
    player1.name = 'Player 1';
    player2.name = 'Player 2';
  }

  displayNames() {
    const { player1, player2 } = this.gamePlay;
    const player1Name = player1.input.val();
    const player2Name = player2.input.val();
    if(player1Name) {
      player1.domElement.children('h2').text(player1Name);
      player1.name = player1Name;
    }
    if(player2Name) {
      player2.domElement.children('h2').text(player2Name);
      player2.name = player2Name;
    }
    player1.input.val('');
    player2.input.val('');
  }

  handleBtnClick(e) {
    const buttonText = e.target.textContent;
    
    switch(buttonText) {
      case '1 player':
        this.$modal.show();
        break;
      case '2 players':
        this.$modal.show();
        break;
      case 'Start Game':
        const randomPlayer = this.getRandomPlayer();
        this.startGame(randomPlayer);
        break;
      case 'New Game':
        this.newGame();
    }
  }

  closeModal() {
    this.$modal.hide();
  }
}

// -- GAMEPLAY COMPONENT -- //

class GamePlay {
  constructor() {
    this.player1 = new Player(1);
    this.player2 = new Player(2);
    this.gameBoard = new GameBoard(this.player1, this.player2);
    this.$boxes = this.gameBoard.boxes;
    this.$board = $('#board');
    this.$finish = $('#finish');

    this.$boxes.on('click', e => this.selectSquare(e));
  }

  selectSquare(e) {
    const selectedBox = e.target;
    const currentPlayer = this.findCurrentPlayer();
    const boxIsEmpty = this.gameBoard.isBoxEmpty(selectedBox);

    if(boxIsEmpty) {
      $(selectedBox).addClass(currentPlayer.boxClass);
      const result = checkForWinner(currentPlayer);
        if (result === 'win') {
          this.handleWin(currentPlayer);
        } else if(result === 'draw') {
          this.handleDraw();
        } else {
          this.nextPlayersTurn(currentPlayer);
        }
    }
  }

  findCurrentPlayer() {
    return this.player1.isActive ? this.player1 : this.player2;
  }

  nextPlayersTurn(currentPlayer) {
    currentPlayer.domElement.removeClass('active');
    currentPlayer.domElement.siblings().addClass('active');
  }

  handleWin(currentPlayer) {
    const { screenWinClass, winMessage } = currentPlayer;
    this.$board.hide();
    this.$finish.addClass(screenWinClass).show().find('.message').text(winMessage);
  }

  handleDraw() {
    this.$board.hide();
    this.$finish.addClass('screen-win-tie').show().find('.message').text('Draw');
  }
}

// -- PLAYER COMPONENT -- //

class Player {
  constructor(playerNum) {
    this.playerNum = playerNum;
    this.domElement = $(`#player${playerNum}`);
    this.input = $(`#player${playerNum}Input`);
    this.name = `Player ${playerNum}`;
    this.boxClass = `box-filled-${playerNum}`;
    this.isComputer = false;
  }

  get isActive() {
    return this.domElement.hasClass('active');
  }

  get winMessage() {
    return `${this.name} Wins!`;
  }

  get screenWinClass() {
    return this.playerNum === 1 ? 'screen-win-one' : 'screen-win-two';
  }

  get bgImage() {
    return this.playerNum === 1 ? 'url(../img/o.svg)' : 'url(../img/x.svg)';
  }
}

// -- BOARD COMPONENT -- //

class GameBoard {
  constructor(player1, player2) {
    this.boxes = $('.box');
    this.bgImages = { player1: player1.bgImage, player2: player2.bgImage };

    this.boxes.on('mouseover', e => this.handleMouseOver(e) );
    this.boxes.on('mouseleave', e => this.handleMouseLeave(e) );
  }

  handleMouseOver(e) {
    const currentBox = e.target;
    const boxIsEmpty = this.isBoxEmpty(currentBox);
    const currentPlayer = $('.active').attr('id');

    if (boxIsEmpty) currentBox.style.backgroundImage = this.bgImages[currentPlayer];
  }

  handleMouseLeave(e) {
    const currentBox = e.target;
    $(currentBox).css('background-image', '');
  }

  isBoxEmpty(currentBox) {
    return !$(currentBox).is('.box-filled-1, .box-filled-2');
  }
}

/*=============-=============-=============-=============
                        FUNCTIONS
===============-=============-=============-===========*/

function checkForWinner(player) {

  const winningCombos = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]];
  const { boxClass } = player;
  const $boxes = $('.box');

  const createPlayerCombo = (boxClass) => {
    return $.makeArray($boxes.map( (index, box) =>  {
      if ($(box).hasClass(boxClass)) return index + 1;
    }));
  }

  const compareCombos = (playerCombo, winningCombos) => {
    return winningCombos.filter(combo => playerCombo.filter(number => combo.includes(number)).length === 3).length;
  }

  const checkForDraw = () => {
    return $boxes.filter( (index, box) => $(box).hasClass('box-filled-1') || $(box).hasClass('box-filled-2')).length === 9;
  }

  const playerCombo = createPlayerCombo(boxClass);

  if( compareCombos(playerCombo, winningCombos) ) {
    return 'win';
  } else {
    return checkForDraw() ? 'draw' : false;
  }
}

/*=============-=============-=============-=============
                        GAME INIT
===============-=============-=============-===========*/

const game = new GameUI();
game.init();