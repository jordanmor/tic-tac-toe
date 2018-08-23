// Start and Finish screens
$('body').prepend(`<div class="screen screen-start" id="start">
                    <header>
                      <h1>Tic Tac Toe</h1>
                      <h2 class="start">Start Game</h2>
                      <a href="#" class="button">1 player</a>
                      <a href="#" class="button ml">2 players</a>
                    </header>
                  </div>
                  <div class="screen screen-win" id="finish">
                    <header>
                        <h1>Tic Tac Toe</h1>
                        <p class="message"></p>
                        <a href="#" class="button">New Game</a>
                        <a href="#" class="button reset">Choose New Players</a>
                    </header>
                  </div>`
);

// Displays player's name above player symbol during gameplay
$('#player1').prepend('<h2>Player 1</h2>');
$('#player2').prepend('<h2>Player 2</h2>');

// Modal
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
    this.gamePlay = new GamePlay(); // Creates an instance of the Gameplay component

    this.$buttons.on('click', e => this.handleBtnClick(e) ); // Event listener handles all btn clicks
    $('.close').on('click', () => this.closeModal() ); // Close modal
  }
  // Initializes game when first accessed or on browser reload/refresh
  init() {
    this.$board.hide();
    this.$finish.hide();
    this.$modal.hide();
  }
  // This method chooses a random player to start each game
  getRandomPlayer() {
    const randomNum = Math.floor(Math.random() * 2) + 1;
    const { player1, player2 } = this.gamePlay; // Use destructuring to access player objects
    return randomNum === 1 ? player1 : player2;
  }
  // Starts a game with the user's chosen player options
  startGame(randomlyChosenPlayer) {
    const { player2 } = this.gamePlay;
    randomlyChosenPlayer.domElement.addClass('active');
    this.displayNames();
    this.$modal.hide();
    this.$start.hide();
    this.$board.show();
    // If the player chosen randomly to start the game is the computer, computer moves first
    if(randomlyChosenPlayer === player2 && randomlyChosenPlayer.isComputer){
      this.gamePlay.computerMove();
    }
  }
  // Starts a new game with the previously chosen players
  newGame(randomlyChosenPlayer) {
    this.resetClasses();
    const { player2 } = this.gamePlay;
    this.gamePlay.boardSpaces = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    randomlyChosenPlayer.domElement.addClass('active');
    this.$boxes.css('cursor', 'pointer');
    this.$finish.hide();
    this.$board.show();

    if(randomlyChosenPlayer === player2 && randomlyChosenPlayer.isComputer){
      this.gamePlay.computerMove();
    }
  }
  // Resets the board and allows user to choose new players before starting the next game
  restartGame() {
    this.resetClasses();
    const { player1, player2 } = this.gamePlay;
    this.gamePlay.boardSpaces = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    player2.input.show();
    player1.domElement.children('h2').text('Player 1');
    player2.domElement.children('h2').text('Player 2'); 
    player1.name = 'Player 1';
    player2.name = 'Player 2';
    player2.isComputer = false;
    this.$boxes.css('cursor', 'pointer');
    this.$finish.hide();
    this.$start.show();
  }
  
  resetClasses() {
    const { player1, player2 } = this.gamePlay;
    this.$boxes.removeClass('box-filled-1 box-filled-2');
    this.$finish.removeClass('screen-win-one screen-win-two screen-win-draw');
    player1.domElement.removeClass('active');
    player2.domElement.removeClass('active');
  }

  // Collect and display players names (or default names) above players' symbols during gameplay
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
    // Switch handles all game buttons according to each button's text value 
    const randomPlayer = this.getRandomPlayer();
    switch(buttonText) {
      case '1 player':
        const { player2 } = this.gamePlay;
        player2.input.hide();
        this.$modal.show();
        // Choosing the 1 player game makes the 2nd player the computer opponent
        player2.isComputer = true;
        player2.name = 'Computer'; // Player 2 renamed "Computer"
        player2.domElement.children('h2').text('Computer');
        break;
      case '2 players':
        this.$modal.show();
        break;
      case 'Start Game':
        this.startGame(randomPlayer);
        break;
      case 'New Game':
        this.newGame(randomPlayer);
        break;
      case 'Choose New Players':
        this.restartGame();
    }
  }

  closeModal() {
    const { player2 } = this.gamePlay;
    this.$modal.hide();
    player2.input.show();
    player2.isComputer = false;
    player2.name = 'Player 2';
    player2.domElement.children('h2').text('Player 2');
  }
}

// -- GAMEPLAY COMPONENT -- //

class GamePlay {
  constructor() {
    this.player1 = new Player(1);
    this.player2 = new Player(2);
    this.gameBoard = new GameBoard(this.player1, this.player2); // New instance of GameBoard component
    this.$boxes = this.gameBoard.boxes;
    this.$board = $('#board');
    this.boardSpaces = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    this.$finish = $('#finish');

    this.$boxes.on('click', e => this.selectBox(e)); // Event listener handles all gameboard box selections
  }
  
  selectBox(e) {
    const selectedBox = e.target;
    const currentPlayer = this.findCurrentPlayer();
    const boxIsEmpty = this.gameBoard.isBoxEmpty(selectedBox);
    // Player can select a box only if it is empty and current player is not computer
    if(boxIsEmpty && !currentPlayer.isComputer) {
      // If box is empty, current player adds symbol to box ...
      $(selectedBox).addClass(currentPlayer.boxClass);
      // Function checkForWinningMove then determines if that move results in a win, draw, or the next player's turn
      const selectedBoxIndex = $(selectedBox).index();
      this.boardSpaces[selectedBoxIndex] = currentPlayer.symbol;
      const result = this.checkForWinningMove(this.boardSpaces, currentPlayer);
        if (result === 'win') {
          this.handleWin(currentPlayer);
        } else if(result === 'draw') {
          this.handleDraw();
        } else {
          this.nextPlayersTurn(currentPlayer);
          // If player 2 is the computer, the computer takes it's turn
          if(this.player2.isComputer) {
            // SetTimeout used to give the appearance that the computer is thinking about the next move
            // Binding this to it's intended method is necessary when that method is used as a callback
            window.setTimeout(this.computerMove.bind(this), 2000);
          }
        }
    }
  }

  findCurrentPlayer() {
    return this.player1.isActive ? this.player1 : this.player2;
  }
  // Handles players turns by switching the active class to the next player
  nextPlayersTurn(currentPlayer) {
    currentPlayer.domElement.removeClass('active');
    currentPlayer.domElement.siblings().addClass('active');
  }

  checkForWinningMove(board, player) {
      return checkForWinner(board, player.symbol) ? 'win' : checkForDraw(board) ? 'draw' : false;
  }

  // Displays the winning players win message on the finish screen
  handleWin(currentPlayer) {
    const { screenWinClass, winMessage } = currentPlayer;
    this.$board.hide();
    this.$finish.addClass(screenWinClass).show().find('.message').text(winMessage);
  }

  handleDraw() {
    this.$board.hide();
    this.$finish.addClass('screen-win-tie').show().find('.message').text('Draw');
  }

  computerMove() {
    const selectedBoxIndex = computerSelectsBox(this.boardSpaces);
    this.boardSpaces[selectedBoxIndex] = this.player2.symbol;
    const selectedBox = this.$boxes.eq(selectedBoxIndex);
    $(selectedBox).addClass(this.player2.boxClass);
    const result = this.checkForWinningMove(this.boardSpaces, this.player2);
    if (result === 'win') {
      this.handleWin(this.player2);
    } else if(result === 'draw') {
      this.handleDraw();
    } else {
      this.nextPlayersTurn(this.player2);
    }
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

  get symbol() {
    return this.playerNum === 1 ? 'O' : 'X';
  }
  // Use getter to dynamically retrieve the values below 
  get isActive() {
    return this.domElement.hasClass('active');
  }
  // Finish screen will display the winning player's stored name
  get winMessage() {
    return `${this.name} Wins!`;
  }

  get screenWinClass() {
    return this.playerNum === 1 ? 'screen-win-one' : 'screen-win-two';
  }

  get bgImage() {
    return this.playerNum === 1 ? 'url(img/o.svg)' : 'url(img/x.svg)';
  }
}

// -- BOARD COMPONENT -- //

class GameBoard {
  constructor(player1, player2) { // Player variables passed down from GamePlay component
    this.boxes = $('.box');
    this.bgImages = { player1: player1.bgImage, player2: player2.bgImage };
    this.player2 = player2;

    this.boxes.on('mouseover', e => this.handleMouseOver(e) );
    this.boxes.on('mouseleave', e => this.handleMouseLeave(e) );
  }

  handleMouseOver(e) {
    const currentBox = e.target;
    const boxIsEmpty = this.isBoxEmpty(currentBox);
    const currentPlayer = $('.active').attr('id');
    /* When user mouses over a box, the current player's background image only displays
        if the box is empty and ,if in single player mode, it is not the computer's turn*/
    if (boxIsEmpty) {
      if (this.player2.isComputer && this.player2.isActive) {
        currentBox.style.cursor = 'default';
      } else {
        currentBox.style.cursor = 'pointer';
        currentBox.style.backgroundImage = this.bgImages[currentPlayer];
      }
    } else {
      currentBox.style.cursor = 'default';
    }
  }

  handleMouseLeave(e) {
    const currentBox = e.target;
    const boxIsEmpty = this.isBoxEmpty(currentBox);
    currentBox.style.backgroundImage = "";
    if(boxIsEmpty) {
      currentBox.style.cursor = 'pointer';
    }
  }
  // Checks that the current box does not have either of the box-filled classes
  isBoxEmpty(currentBox) {
    return !$(currentBox).is('.box-filled-1, .box-filled-2');
  }
}

/*=============-=============-=============-=============
                        FUNCTIONS
===============-=============-=============-===========*/

// Winning combinations use the board indices
function checkForWinner(board, player){
  return  (board[0] == player && board[1] == player && board[2] == player) ||
          (board[3] == player && board[4] == player && board[5] == player) ||
          (board[6] == player && board[7] == player && board[8] == player) ||
          (board[0] == player && board[3] == player && board[6] == player) ||
          (board[1] == player && board[4] == player && board[7] == player) ||
          (board[2] == player && board[5] == player && board[8] == player) ||
          (board[0] == player && board[4] == player && board[8] == player) ||
          (board[2] == player && board[4] == player && board[6] == player)
}

function checkForDraw(board) {
  return board.filter(s => s === 'O' || s === 'X').length === 9;
}

function computerSelectsBox(board) {

  const player1 = "O";
  const computer = "X";

  function minimax(board, player){
    
    // Returns the available spots on the board
    const emptyIndices = board => board.filter(s => s != "O" && s != "X");
    
    const availableSpots = emptyIndices(board);

    // Checks for the terminal states such as win, lose, and tie and returns a value accordingly
    if (checkForWinner(board, player1)){
      return {score:-10};
    }
    else if (checkForWinner(board, computer)){
      return {score:10};
    }
    else if (availableSpots.length === 0){
      return {score:0};
    }

    /* Loop through available spots. Create an object for each spot and store 
    the index of that spot as a number in the object's index key */
    const moves = availableSpots.map(currentSpot => {
      const move = {};
      move.index = board[currentSpot];
      board[currentSpot] = player;
    
      // Collect the score resulting from calling minimax on the opponent of the current player
      if (player == computer){
        const result = minimax(board, player1);
        move.score = result.score;
      } else {
        const result = minimax(board, computer);
        move.score = result.score;
      }

      // Reset the current spot to empty
      board[currentSpot] = move.index;
    
      return move;
    });

    // If computer's turn, loop over the moves and choose the move with the highest score
    let bestMove;
    if(player === computer){
      let bestScore = -10000;
      for(let i = 0; i < moves.length; i++){
        if(moves[i].score > bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {  // else loop over the moves and choose the move with the lowest score
      let bestScore = 10000;
      for(let i = 0; i < moves.length; i++){
        if(moves[i].score < bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  } // -- End of minimax function

  // Computer chooses the best available spot
  const bestSpot = minimax(board, computer);
  return bestSpot.index;
}

/*=============-=============-=============-=============
                        GAME INIT
===============-=============-=============-===========*/

const game = new GameUI();
game.init();