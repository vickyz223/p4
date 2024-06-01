/* Text to add to the move here button */
const MOVE_HERE_TEXT = "— Move here —";

export default class Mover {
  constructor(storage) {
    this.templateButton = document.createElement("button");
    this.templateButton.textContent = MOVE_HERE_TEXT;
    this.templateButton.classList.add("moveHere");
    this.buttons = [];
    this.storage = storage;
  }

  startMoving(card) {
    this.stopMoving();
    card.cardNode.classList.add("moving");
    const columns = ["#todo", "#doing", "#done"];
    const addMoveButtons = (column, card) => {
      const cards = column.querySelectorAll(".card");
      cards.forEach((existingCard) => this.addMoveButton(existingCard, card));
      this.addMoveButton(column, card, true);
    };
    this.addMoveButton = (target, card, append = false) => {
      const btn = this.templateButton.cloneNode(true);
      btn.addEventListener("click", () => {
        if (
          (append && target !== card.cardNode.nextSibling) ||
          (!append && target !== card.cardNode)
        ) {
          card.cardNode.remove();
          if (append) {
            target.append(card.cardNode);
          } else {
            target.before(card.cardNode);
          }
          card.cardNode.classList.remove("moving");
          this.stopMoving();
        } else {
          card.cardNode.classList.remove("moving");
          this.stopMoving();
        }
      });
      if (append) {
        target.append(btn);
      } else {
        target.before(btn);
      }
    };
    columns.forEach((columnId) => {
      const column = document.querySelector(columnId);
      addMoveButtons(column, card);
    });
  }

  stopMoving() {
    console.log("stopmoving");
    const buttons = document.querySelectorAll(".moveHere");
    const moved = document.getElementsByClassName("moving");
    if (moved.length > 0) {
      moved[0].classList.remove("moving");
    }
    for (const button of buttons) {
      button.remove();
    }
    this.storage.reloadCards();
  }

  //TODO
}
