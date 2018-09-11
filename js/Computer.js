class Computer {
  constructor(board) {
    this.board = board;
  }

  selectBox() {

    const player1 = "O";
    const computer = "X";
    const board = this.board.boxes.map(box => box.symbol);

    function checkForWin(board, player) {
      return  (board[0] == player && board[1] == player && board[2] == player) ||
              (board[3] == player && board[4] == player && board[5] == player) ||
              (board[6] == player && board[7] == player && board[8] == player) ||
              (board[0] == player && board[3] == player && board[6] == player) ||
              (board[1] == player && board[4] == player && board[7] == player) ||
              (board[2] == player && board[5] == player && board[8] == player) ||
              (board[0] == player && board[4] == player && board[8] == player) ||
              (board[2] == player && board[4] == player && board[6] == player)
    }
      
    function minimax(board, player){
      
      // Returns the available spots on the board
      const emptyIndices = board => board.filter(s => s != "O" && s != "X");
      
      const availableSpots = emptyIndices(board);
  
      // Checks for the terminal states such as win, lose, and tie and returns a value accordingly
      if (checkForWin(board, player1)){
        return {score:-10};
      }
      else if (checkForWin(board, computer)){
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

}