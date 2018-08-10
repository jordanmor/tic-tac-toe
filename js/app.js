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

$('#board').hide();
// $('#finish').addClass('screen-win-one');
$('#finish').hide();
$('#modal').hide();
// $('#start').hide();