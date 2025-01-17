class Shop {
  constructor() {
    this.isVisible = false;
    this.items = [
      {
        name: "Default",
        price: 0,
        cursor: "url('media/defaultcursor.png'), auto",
      },
      {
        name: "Item 1",
        price: 1000,
        cursor: "url('media/yellowcursor.png'), auto",
      },
      {
        name: "Item 2",
        price: 5000,
        cursor: "url('media/purplecursor.png'), auto",
      },
      {
        name: "Item 3",
        price: 10000,
        cursor: "url('media/orangecursor.png'), auto",
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

    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(canvas.width - 60, 10, 50, 50);
    ctx.fillStyle = "white";
    ctx.font = "30px DiloWorld";
    ctx.fillText("X", canvas.width - 45, 45);

    this.items.forEach((item, index) => {
      const canAfford = m_CurrencyManager.getFGradeToken() >= item.price;
      ctx.fillStyle = canAfford ? "white" : "gray";

      // Draw rounded rectangle for item button
      const radius = 10;
      const x = 150;
      const y = 150 + index * 100;
      const width = canvas.width - 300;
      const height = 80;

      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
      );
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "black";
      ctx.textAlign = "left";
      let itemText = item.name;
      if (item.price > 0) {
        itemText += " - " + item.price + " ";
        ctx.fillText(itemText, 160, 200 + index * 100);

        const tokenImage = m_CurrencyManager.images[1];
        const textWidth = ctx.measureText(itemText).width;
        ctx.drawImage(tokenImage, 160 + textWidth, 180 + index * 100, 20, 20);
      } else {
        ctx.fillText(itemText, 160, 200 + index * 100);
      }
    });
  }

  click(x, y) {
    if (!this.isVisible) return;

    if (x > canvas.width - 60 && x < canvas.width - 10 && y > 10 && y < 60) {
      this.hide();
    }

    this.items.forEach((item, index) => {
      if (
        x > 150 &&
        x < canvas.width - 150 &&
        y > 150 + index * 100 &&
        y < 230 + index * 100
      ) {
        console.log(item.name + " clicked");
        if (m_CurrencyManager.getFGradeToken() >= item.price) {
          m_CurrencyManager.RemoveCurrencyAmount(2, item.price);
          item.price = 0;

          canvas.style.cursor = item.cursor;
        } else if (item.price === 0) {
          canvas.style.cursor = item.cursor;
        } else {
          console.log("Not enough F Grade Tokens to purchase " + item.name);
        }
      }
    });
  }
}

const m_Shop = new Shop();
