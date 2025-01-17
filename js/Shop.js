class Shop {
  constructor() {
    this.isVisible = false;
    this.items = [
      {
        name: "Default",
        price: 0,
        cursor: "url('media/defaultcursor.png'), auto",
        imageSrc: "media/defaultcursor.png",
      },
      {
        name: "Item 1",
        price: 1000,
        cursor: "url('media/yellowcursor.png'), auto",
        imageSrc: "media/yellowcursor.png",
      },
      {
        name: "Item 2",
        price: 5000,
        cursor: "url('media/purplecursor.png'), auto",
        imageSrc: "media/purplecursor.png",
      },
      {
        name: "Item 3",
        price: 10000,
        cursor: "url('media/orangecursor.png'), auto",
        imageSrc: "media/orangecursor.png",
      },
    ];
    this.items.forEach((item) => {
      item.image = new Image();
      item.image.src = item.imageSrc;
    });
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
    const buttonSize = canvas.width / 40;
    const buttonX = (canvas.width * 78) / 80;
    const buttonY = (canvas.height * 1) / 160;
    ctx.fillRect(buttonX, buttonY, buttonSize, buttonSize);

    ctx.fillStyle = "white";
    ctx.font = "2rem DiloWorld";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("X", buttonX + buttonSize / 2, buttonY + buttonSize / 2);

    const buttonWidth = canvas.height / 4;
    const buttonHeight = canvas.height / 4;
    const startX = (canvas.width - (canvas.height * 2) / 3) / 2;
    const startY = canvas.height / 6;
    const gap = canvas.height / 6;
    const radius = 20;

    this.items.forEach((item, index) => {
      const canAfford = m_CurrencyManager.getFGradeToken() >= item.price;
      ctx.fillStyle = canAfford ? "white" : "gray";
      const i = Math.floor(index / 2);
      const j = index % 2;
      const x = startX + j * (buttonWidth + gap);
      const y = startY + i * (buttonHeight + gap);

      // Draw rounded rectangle
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + buttonWidth - radius, y);
      ctx.quadraticCurveTo(x + buttonWidth, y, x + buttonWidth, y + radius);
      ctx.lineTo(x + buttonWidth, y + buttonHeight - radius);
      ctx.quadraticCurveTo(
        x + buttonWidth,
        y + buttonHeight,
        x + buttonWidth - radius,
        y + buttonHeight
      );
      ctx.lineTo(x + radius, y + buttonHeight);
      ctx.quadraticCurveTo(x, y + buttonHeight, x, y + buttonHeight - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.font = "1.5rem DiloWorld";

      let itemText = item.name;
      ctx.fillText(
        itemText,
        x + buttonWidth / 2,
        y + buttonHeight / 2 - canvas.height / 14
      );

      if (item.price > 0) {
        itemText = item.price + " ";
        ctx.textAlign = "center";
        ctx.fillText(itemText, x + buttonWidth / 2, y + buttonHeight / 2);

        const tokenImage = m_CurrencyManager.images[1];
        ctx.drawImage(
          tokenImage,
          x + buttonWidth / 2 + ctx.measureText(itemText).width / 2,
          y + buttonHeight / 2 - canvas.height / 75,
          canvas.height / 40,
          canvas.height / 40
        );
      }
      if (item.image) {
        const imgWidth = (item.image.width * canvas.height) / 600;
        const imgHeight = (item.image.height * canvas.height) / 600;
        const imgX = x + (buttonWidth - imgWidth) / 2;
        const imgY = y + (buttonHeight - imgHeight - canvas.height / 60);
        ctx.drawImage(item.image, imgX, imgY, imgWidth, imgHeight);
      }
    });
  }

  click(x, y) {
    if (!this.isVisible) return;

    if (
      x > (canvas.width * 78) / 80 &&
      x < (canvas.width * 78) / 80 + canvas.width / 40 &&
      y > (canvas.height * 1) / 160 &&
      y < (canvas.height * 1) / 160 + canvas.width / 40
    ) {
      this.hide();
    }

    const buttonWidth = canvas.height / 4;
    const buttonHeight = canvas.height / 4;
    const startX = (canvas.width - (canvas.height * 2) / 3) / 2;
    const startY = canvas.height / 6;
    const gap = canvas.height / 6;

    this.items.forEach((item, index) => {
      const buttonX = startX + (index % 2) * (buttonWidth + gap);
      const buttonY = startY + Math.floor(index / 2) * (buttonHeight + gap);
      if (
        x > buttonX &&
        x < buttonX + buttonWidth &&
        y > buttonY &&
        y < buttonY + buttonHeight
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
