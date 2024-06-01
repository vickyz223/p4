export default class todoStorage {
  constructor() {
    this.columns = {
      todo: JSON.parse(localStorage.getItem("todo")) || [],
      doing: JSON.parse(localStorage.getItem("doing")) || [],
      done: JSON.parse(localStorage.getItem("done")) || [],
    };
  }

  // Add a card to a specified column
  addCard(column, title, description, color) {
    const id = "id" + Math.random().toString(16).slice(2);
    const card = { id, title, description, color };
    if (this.columns[column]) {
      this.columns[column].push(card);
      localStorage.setItem(column, JSON.stringify(this.columns[column]));
    } else {
      throw new Error("Invalid column name");
    }
    return id;
  }

  addCardwithID(column, title, description, color, id) {
    const card = { id, title, description, color };
    if (this.columns[column]) {
      this.columns[column].push(card);
      localStorage.setItem(column, JSON.stringify(this.columns[column]));
    } else {
      throw new Error("Invalid column name");
    }
    return id;
  }

  // Fetch cards by column
  fetchCardsByColumn(column) {
    if (this.columns[column]) {
      const storedCards = localStorage.getItem(column);
      return storedCards ? JSON.parse(storedCards) : [];
    } else {
      throw new Error("Invalid column name");
    }
  }

  // Delete all cards
  deleteAllCards() {
    Object.keys(this.columns).forEach((column) => {
      this.columns[column] = [];
      localStorage.removeItem(column);
    });
  }

  // Edit a card by ID
  editCardById(id, newDescription) {
    let cardFound = false;
    Object.keys(this.columns).forEach((column) => {
      const columnCards = this.columns[column];
      for (let i = 0; i < columnCards.length; i++) {
        if (columnCards[i].id === id) {
          console.log(newDescription);
          columnCards[i].description = newDescription;
          localStorage.setItem(column, JSON.stringify(columnCards));
          cardFound = true;
          break;
        }
      }
    });

    if (!cardFound) {
      throw new Error("Card with the specified ID not found");
    }
  }

  deleteCardById(id) {
    console.log("delete ", id);
    let cardFound = false;
    Object.keys(this.columns).forEach((column) => {
      const columnCards = this.columns[column];
      const cardIndex = columnCards.findIndex((card) => card.id === id);
      if (cardIndex !== -1) {
        columnCards.splice(cardIndex, 1);
        localStorage.setItem(column, JSON.stringify(columnCards));
        cardFound = true;
      }
    });

    if (!cardFound) {
      throw new Error("Card with the specified ID not found");
    }
  }

  reloadCards() {
    // Delete all cards from localStorage
    console.log("inside");
    this.deleteAllCards();

    // Helper function to extract card data and add to localStorage
    const reloadColumn = (colId, colName) => {
      const columnElement = document.querySelector(`#${colId}`);
      if (columnElement) {
        const cardElements = columnElement.querySelectorAll(".card");
        cardElements.forEach((cardElement) => {
          const title = cardElement.querySelector(".title").innerText;
          const description =
            cardElement.querySelector(".description").innerText;
          const color = cardElement.style.backgroundColor;
          const id = cardElement.id;
          this.addCardwithID(colName, title, description, color, id);
        });
      }
    };

    // Reload cards for each column
    reloadColumn("todo", "todo");
    reloadColumn("doing", "doing");
    reloadColumn("done", "done");
  }
}
