(function() {

  // Start and Finish screens
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
      this.gamePlay = new GamePlay(); // creates an instance of the Gameplay component

      this.$buttons.on('click', e => this.handleBtnClick(e) ); // event listener handles all btn clicks
      $('.close').on('click', () => this.closeModal() ); // close modal
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
      const { player1, player2 } = this.gamePlay; // use destructuring to access player objects
      return randomNum === 1 ? player1 : player2;
    }

    startGame(player) {
      const { player2 } = this.gamePlay;
      player.domElement.addClass('active');
      this.displayNames();
      this.$modal.hide();
      this.$start.hide();
      this.$board.show();
      // if the player chosen randomly to start the game is the computer, computer moves first
      if(player === player2 && player.isComputer){
        this.gamePlay.computerMove();
      }
    }

    newGame() {
      this.resetGame();
      this.$finish.hide();
      this.$start.show();
    }
    // each game starts with values set back to default values
    resetGame() {
      const { player1, player2 } = this.gamePlay;
      this.$boxes.removeClass('box-filled-1 box-filled-2');
      this.$finish.removeClass('screen-win-one screen-win-two screen-win-draw');
      player2.input.show();
      player1.domElement.removeClass('active').children('h2').text('Player 1');
      player2.domElement.removeClass('active').children('h2').text('Player 2'); 
      player1.name = 'Player 1';
      player2.name = 'Player 2';
      player2.isComputer = false;
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
      switch(buttonText) {
        case '1 player':
          const { player2 } = this.gamePlay;
          player2.input.hide();
          this.$modal.show();
          // choosing the 1 player game makes the 2nd player the computer opponent
          player2.isComputer = true;
          player2.name = 'Computer'; // Player 2 renamed "Computer"
          player2.domElement.children('h2').text('Computer');
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
      this.gameBoard = new GameBoard(this.player1, this.player2); // new instance of GameBoard component
      this.$boxes = this.gameBoard.boxes;
      this.$board = $('#board');
      this.$finish = $('#finish');

      this.$boxes.on('click', e => this.selectBox(e)); // event listener handles all gameboard box selections
    }
    
    selectBox(e) {
      const selectedBox = e.target;
      const currentPlayer = this.findCurrentPlayer();
      const boxIsEmpty = this.gameBoard.isBoxEmpty(selectedBox);
      // Player can select a box only if it is empty and current player is not computer
      if(boxIsEmpty && !currentPlayer.isComputer) {
        // If box is empty, current player adds symbol to box
        $(selectedBox).addClass(currentPlayer.boxClass);
        // Function checkForWinner then determines if that move results in a win, draw, or the next player's turn
        const result = checkForWinner(currentPlayer);
          if (result === 'win') {
            this.handleWin(currentPlayer);
          } else if(result === 'draw') {
            this.handleDraw();
          } else {
            this.nextPlayersTurn(currentPlayer);
            // If player 2 is the computer, the computer takes it's turn
            if(this.player2.isComputer) {
              // SetTimeout used to give the appearance that the computer is thinking about the next move
              window.setTimeout(this.computerMove.bind(this), 3000);
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
      const selectedBox = computerSelectsBox();
      $(selectedBox).addClass(this.player2.boxClass);
      const result = checkForWinner(this.player2);
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
    // use getter to dynamically retrieve the values below 
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
      return this.playerNum === 1 ? 'url(../img/o.svg)' : 'url(../img/x.svg)';
    }
  }

  // -- BOARD COMPONENT -- //

  class GameBoard {
    constructor(player1, player2) { // player variables passed down from GamePlay component
      this.boxes = $('.box');
      this.bgImages = { player1: player1.bgImage, player2: player2.bgImage };

      this.boxes.on('mouseover', e => this.handleMouseOver(e) );
      this.boxes.on('mouseleave', e => this.handleMouseLeave(e) );
    }

    handleMouseOver(e) {
      const currentBox = e.target;
      const boxIsEmpty = this.isBoxEmpty(currentBox);
      const currentPlayer = $('.active').attr('id');
      // current player's background image displays when user mouses over an empty box
      if (boxIsEmpty) currentBox.style.backgroundImage = this.bgImages[currentPlayer];
    }

    handleMouseLeave(e) {
      const currentBox = e.target;
      $(currentBox).css('background-image', '');
    }
    // checks if the current box does not have either of the box-filled classes
    isBoxEmpty(currentBox) {
      return !$(currentBox).is('.box-filled-1, .box-filled-2');
    }
  }

  /*=============-=============-=============-=============
                          FUNCTIONS
  ===============-=============-=============-===========*/

  function checkForWinner(player) {
    // array holds all possible combinations of box spaces that result in a game win
    const winningCombos = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]];
    const { boxClass } = player;
    const $boxes = $('.box');
    /* createPlayerCombo function looks at all gameboard boxes and returns 
      all the indexes of the boxes with the current players boxClass name */
    const createPlayerCombo = (boxClass) => {
      return $.makeArray($boxes.map( (index, box) =>  {
        if ($(box).hasClass(boxClass)) return index + 1; // add one so the box index numbers count from 1 - 9
      }));
    }
    /* compareCombos compares each array of winning combos to the combination of box numbers the current player 
      has selected so far. If three of the current player's selected boxes match one of the winning combos, 
      this function will return a length value of 1 (the winning combo array) and therefore, a truthy value. 
      If there is no match, the length value of the array will equal 0, and therefore will return falsy. */
    const compareCombos = (playerCombo, winningCombos) => {
      return winningCombos.filter(combo => playerCombo.filter(number => combo.includes(number)).length === 3).length;
    }
    /* if the compareCombos function return falsy, the checkForDraw function will check if
      all 9 boxes have been selected with a boxClass, which means the game has ended in a draw */
    const checkForDraw = () => {
      return $boxes.filter( (index, box) => $(box).hasClass('box-filled-1') || $(box).hasClass('box-filled-2')).length === 9;
    }

    const playerCombo = createPlayerCombo(boxClass); // player combo created

    if( compareCombos(playerCombo, winningCombos) ) {
      return 'win';
    } else {
      return checkForDraw() ? 'draw' : false;
    }
  }

  function computerSelectsBox() {
    const $boxes = $('.box');
    
    // create an array of the indices of all unselected boxes
    function findUnselectedBoxes() {
        return $.makeArray($boxes.map( (index, box) =>  {
            if (!$(box).hasClass('box-filled-1') && !$(box).hasClass('box-filled-2')) return index;
        }));
    }
    
    // computer makes a choice from an array of the remaining unselected boxes using a generated random index
    function pickRandomIndex() {
        const unselectedBoxesArray = findUnselectedBoxes();
        const randomIndex = Math.floor(Math.random() * unselectedBoxesArray.length);
        return unselectedBoxesArray[randomIndex];
    }

    const randomUnselectedBoxIndex = pickRandomIndex();
    const $chosenBox = $boxes.eq(randomUnselectedBoxIndex);
    return $chosenBox; // function returns the box element the computer has randomly chosen
  }

  /*=============-=============-=============-=============
                          GAME INIT
  ===============-=============-=============-===========*/

  const game = new GameUI();
  game.init();

})();