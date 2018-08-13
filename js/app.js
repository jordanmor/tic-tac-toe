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

  newGame() {
    this.resetGame();
    this.$finish.hide();
    this.$start.show();
  }

  startGame() {
    const { player2 } = this.gamePlay;
    this.$modal.hide();
    this.$start.hide();
    this.$board.show();
    // this.$player1.addClass('active');
    player2.domElement.addClass('active');
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
        this.startGame();  
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
    this.gameBoard = new GameBoard();
    this.$boxes = this.gameBoard.boxes;

    this.$boxes.on('click', e => this.selectSquare(e));
  }

  selectSquare(e) {
    const selectedBox = e.target;
    const currentPlayer = this.findCurrentPlayer();
    const boxIsEmpty = this.gameBoard.isBoxEmpty(selectedBox);

    if(boxIsEmpty) {
      $(selectedBox).addClass(currentPlayer.boxClass);
      this.nextPlayersTurn(currentPlayer);
    }
  }

  findCurrentPlayer() {
    return this.player1.isActive ? this.player1 : this.player2;
  }

  nextPlayersTurn(currentPlayer) {
    currentPlayer.domElement.removeClass('active');
    currentPlayer.domElement.siblings().addClass('active');
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
  constructor() {
    this.boxes = $('.box');
    this.bgImages = { player1: 'url(../img/o.svg)', player2: 'url(../img/x.svg)' };

    this.boxes.on('mouseover', e => this.handleMouseOver(e) );
    this.boxes.on('mouseleave', e => this.handleMouseLeave(e) );
  }

  handleMouseOver(e) {
    const currentBox = e.target;
    const boxIsEmpty = this.isBoxEmpty(currentBox);
    const activePlayer = $('.active').attr('id');

    if (boxIsEmpty) currentBox.style.backgroundImage = this.bgImages[activePlayer];
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
                        GAME INIT
===============-=============-=============-===========*/

const game = new GameUI();
game.init();