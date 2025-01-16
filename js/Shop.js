class Shop {
  constructor() {
    this.isVisible = false;
    this.items = [
      {
        name: "Item 1",
        price: 100,
        cursor: "url('images/yellowcursor.png'), auto",
      },
      {
        name: "Item 2",
        price: 200,
        cursor: "url('images/purplecursor.png'), auto",
      },
      {
        name: "Item 3",
        price: 300,
        cursor: "url('images/orangecursor.png'), auto",
      },
    ];
  }

  show() {
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
  }

  render() {
    if (!this.isVisible) return;

    // Draw the shop window
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the close button
    ctx.fillStyle = "red";
    ctx.fillRect(canvas.width - 60, 10, 50, 50);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("X", canvas.width - 45, 45);

    // Draw the items
    this.items.forEach((item, index) => {
      const canAfford = m_CurrencyManager.getFGradeToken() >= item.price;
      ctx.fillStyle = canAfford ? "white" : "gray";
      ctx.fillRect(150, 150 + index * 100, canvas.width - 300, 80);
      ctx.fillStyle = "black";
      ctx.textAlign = "left"; // Align text to the left
      let itemText = item.name;
      if (item.price > 0) {
        itemText += " - " + item.price + " credits";
      }
      ctx.fillText(itemText, 160, 200 + index * 100);
    });
  }

  click(x, y) {
    if (!this.isVisible) return;

    // Check if the close button is clicked
    if (x > canvas.width - 60 && x < canvas.width - 10 && y > 10 && y < 60) {
      this.hide();
    }

    // Check if an item is clicked
    this.items.forEach((item, index) => {
      if (
        x > 150 &&
        x < canvas.width - 150 &&
        y > 150 + index * 100 &&
        y < 230 + index * 100
      ) {
        console.log(item.name + " clicked");
        // Handle item purchase logic here
        // Ensure the price is not reset to 0
        if (item.price > 0) {
          // Deduct the price from the user's currency
          m_CurrencyManager.RemoveCurrencyAmount("fGrade", item.price);
          item.price = 0;

          document.body.style.cursor = item.cursor;
        }
      }
    });
  }
}

const m_Shop = new Shop();
