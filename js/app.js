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
    this.$modal.hide();
    this.$start.hide();
    this.$board.show();
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

const game = new GameUI();
game.init();