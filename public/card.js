/* The text to use when description is empty */
const NO_DESCRIPTION_TEXT = "(No description)";

export default class Card {
  constructor(id, title, color, description, storage) {
    this.storage = storage;
    // make a copy of card template
    this.cardNode = document.querySelector(".template").cloneNode(true);
    this.cardNode.classList.remove("template");
    // set id
    this.cardNode.id = id;
    // set title, description, and color
    console.log(this.cardNode)
    this.cardNode.querySelector(".title").innerText = title;
    this.cardNode.style.backgroundColor = color;
    // detect dark or light
    const textColor = this.getTextColor(this.cardNode.style.backgroundColor);
    this.cardNode.style.color = textColor;
    const textInputs = this.cardNode.querySelectorAll('textarea');
    textInputs.forEach((input) => {
      input.style.color = textColor;
    });
    if (textColor === "white") {
      this.cardNode.querySelector(":not(.template) .buttons").innerHTML =
        document.querySelector(".white-buttons").innerHTML;
    }

    this.cardNode.querySelector(".editDescription").style.backgroundColor =
      color;
    this.cardNode.querySelector(".description").innerText = description;
    // add event handler for deletion
    this.cardNode.querySelector(".delete").addEventListener("click", () => {
      this.mover.stopMoving();
      this.deleteCard();
    });
    // add event handlers for editing
    this.cardNode.querySelector(".edit").addEventListener("click", () => {
      this.editCard();
      this.editing = true;
    });
    this.editing = false;
    this.cardNode
      .querySelector(".editDescription")
      .addEventListener("focusout", () => {
        this.editCard();
      });
    // file event listenter
    this.cardNode.addEventListener("dragover", (e) => {
      e.preventDefault();
      if (
        e.dataTransfer.items &&
        e.dataTransfer.items[0].type === "text/plain"
      ) {
        this.cardNode.classList.add("dragBorder");
      }
    });
    this.cardNode.addEventListener("dragleave", () => {
      this.cardNode.classList.remove("dragBorder");
    });
    this.cardNode.addEventListener("mouseout", () => {
      this.cardNode.classList.remove("dragBorder");
    });
    this.cardNode.addEventListener("drop", this.handleDrop.bind(this));

  }

  addToCol(colElem, mover) {
    const row = document.querySelector(`#${colElem}`);
    row.append(this.cardNode);
    // add event handler for moving
    this.mover = mover;
    this.cardNode.querySelector(".startMove").addEventListener("click", () => {
      this.moveCard();
    });
  }

  setDescription(text) {
    const newDesc = text.trim() === "" ? NO_DESCRIPTION_TEXT : text;
    this.cardNode.querySelector(".description").textContent = newDesc;
    this.storage.editCardById(this.cardNode.id, newDesc);
  }

  deleteCard() {
    this.storage.deleteCardById(this.cardNode.id);
    this.cardNode.remove();
  }

  editCard() {
    // unhide textbox
    const textBox = this.cardNode.querySelector(".editDescription");
    textBox.classList.toggle("hidden");
    const description = this.cardNode.querySelector(".description");
    // set initial value and focus
    textBox.focus();
    textBox.select();
    // hide description
    description.classList.toggle("hidden");
    // set description
    if (this.editing) {
      this.setDescription(
        this.cardNode.querySelector(".editDescription").value
      );
    } else {
      textBox.value =
        description.innerText === NO_DESCRIPTION_TEXT
          ? ""
          : description.innerText;
    }
    this.editing = false;
  }

  moveCard() {
    this.cardNode.classList.add("moving");
    this.mover.startMoving(this);
  }

  handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.setDescription(event.target.result);
      };
      reader.readAsText(file);
    } else {
      alert("Please drop a text (.txt) file.");
    }
  }

  getTextColor(rgb) {
    let r = 0,
      g = 0,
      b = 0;
    // hardcoded in setup
    if (rgb === "lightblue") {
      r = 173;
      g = 216;
      b = 230;
    } else if (rgb === "khaki") {
      r = 76;
      g = 69;
      b = 57;
    } else if (rgb === "pink") {
      r = 255;
      g = 192;
      b = 203;
    } else {
      // extarct r g b
      const regex = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;
      const match = rgb.match(regex);
      if (match) {
        r = parseInt(match[1], 10);
        g = parseInt(match[2], 10);
        b = parseInt(match[3], 10);
      }
    }
    // calc luminance
    let lum = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255;
    return lum < 0.4 ? "white" : "black";
  }
}
