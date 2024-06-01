import Card from "./card.js";
import Mover from "./mover.js";
import todoStorage from "./storage.js";

export default class App {
  constructor() {
    // localStorage
    this.storage = new todoStorage();
    // mover
    this.mover = new Mover(this.storage);
    // event listeners for form
    const form = document.querySelector("#addCard");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.submitForm();
    });
    const colorButton = document.querySelector("#cardColor");
    colorButton.addEventListener("keypress", (e) => {
      if (
        e.key === "Enter" &&
        document.querySelector("#cardTitle").value !== ""
      ) {
        this.submitForm();
      }
    });
    // get initial theme
    this.currTheme = this.getTheme();
    document.querySelector("html").setAttribute("data-theme", this.currTheme);
    // add event listener for theme
    const darkButton = document.querySelector("#darkMode");
    darkButton.addEventListener("click", () => {
      this.currTheme = this.currTheme === "dark" ? "light" : "dark";
      document.querySelector("html").setAttribute("data-theme", this.currTheme);
      // update in local storage
      localStorage.setItem("theme", this.currTheme);
    });

    this.redisplayCards();
  }

  addCard(col, title, color, description = "(No description)") {
    console.log(col, title, color);
    this.mover.stopMoving();
    const id = this.storage.addCard(col, title, description, color);
    const newCard = new Card(id, title, color, description, this.storage);
    newCard.addToCol(col, this.mover);
    return newCard;
  }

  addCardVisual(id, col, title, color, description = "(No description)") {
    // this.mover.stopMoving();
    const newCard = new Card(id, title, color, description, this.storage);
    newCard.addToCol(col, this.mover);
    return newCard;
  }

  submitForm() {
    const titleField = document.querySelector("#cardTitle");
    const colorField = document.querySelector("#cardColor");
    // add card and clear fields
    this.addCard("todo", titleField.value, colorField.value);
    titleField.value = "";
    colorField.value = "";
  }

  getTheme() {
    const localTheme = localStorage.getItem("theme");
    if (localTheme !== null) {
      return localTheme;
    }
    const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");
    if (systemSettingDark.matches) {
      return "dark";
    } else {
      return "light";
    }
  }

  redisplayCards() {
    const toDoCards = this.storage.fetchCardsByColumn("todo");
    const doingCards = this.storage.fetchCardsByColumn("doing");
    const doneCards = this.storage.fetchCardsByColumn("done");

    toDoCards.forEach((card) =>
      this.addCardVisual(
        card.id,
        "todo",
        card.title,
        card.color,
        card.description
      )
    );
    doingCards.forEach((card) =>
      this.addCardVisual(
        card.id,
        "doing",
        card.title,
        card.color,
        card.description
      )
    );
    doneCards.forEach((card) =>
      this.addCardVisual(
        card.id,
        "done",
        card.title,
        card.color,
        card.description
      )
    );
  }

  // Reload all cards from the webpage to the database
  reloadCards() {
    // Delete all cards from localStorage
    this.deleteAllCards();

    // Helper function to extract card data and add to localStorage
    const reloadColumn = (colId, colName) => {
      const columnElement = document.querySelector(`#${colId} .cards`);
      if (columnElement) {
        const cardElements = columnElement.querySelectorAll(".card");
        cardElements.forEach((cardElement) => {
          const title = cardElement.querySelector(".title").innerText;
          const description =
            cardElement.querySelector(".description").innerText;
          const color = cardElement.dataset.color;
          this.addCard(colName, title, color, description);
        });
      }
    };

    // Reload cards for each column
    reloadColumn("todo", "todo");
    reloadColumn("doing", "doing");
    reloadColumn("done", "done");
  }
}
