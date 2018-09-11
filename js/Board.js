class Board {
  constructor(players) {
    this.boxes = this.createBoxes();
    this.players = players;
  }

  createBoxes() {
    const boxes = [];
    for (let i = 0; i < 9; i++) {
      boxes.push(new Box(i));
    }
    return boxes;
  }

  populateHtmlBoard() {
    this.boxes.forEach(box => box.populateBox());
  }

  findSelectedBox(target) {
    return this.boxes.find(box => box.id === target.id);
  }

  handleMouseOver(target) {
    const selectedBox = this.findSelectedBox(target);
    const activePlayer = this.players.find(player => player.active);
    const boxElement = document.getElementById(selectedBox.id);

    if (selectedBox.isEmpty) {
      if (activePlayer.isComputer) {
        boxElement.style.cursor = 'default';
      } else {
        boxElement.style.cursor = 'pointer';
        boxElement.style.backgroundImage = activePlayer.bgImage;
      }
    } else {
      boxElement.style.cursor = 'default';
    }
  }

  handleMouseLeave(target) {
    const selectedBox = this.findSelectedBox(target);
    const boxElement = document.getElementById(selectedBox.id);

    boxElement.style.backgroundImage = "";
    if(selectedBox.isEmpty) {
      boxElement.style.cursor = 'pointer';
    }
  }
}