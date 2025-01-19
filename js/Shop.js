class Shop {
  constructor() {
    this.isVisible = false;
    this.items = [
      {
        name: "White",
        price: 0,
        cursor: "url('media/cursors/DefaultCursor.png') 12 4, auto",
        imageSrc: "media/cursors/DefaultCursor.png",
      },
      {
        name: "Pink",
        price: 1000,
        cursor: "url('media/cursors/PinkCursor.png') 12 4, auto",
        imageSrc: "media/cursors/PinkCursor.png",
      },
      {
        name: "Pickle",
        price: 2000,
        cursor: "url('media/cursors/PickleCursor.png') 6 6, auto",
        imageSrc: "media/cursors/PickleCursor.png",
      },
      {
        name: "Sausage",
        price: 5000,
        cursor: "url('media/cursors/SausageCursor.png') 12 6, auto",
        imageSrc: "media/cursors/SausageCursor.png",
      },
      {
        name: "Super Tuna",
        price: 10000,
        cursor: "url('media/cursors/SuperTunaCursor.png') 4 20, auto",
        imageSrc: "media/cursors/SuperTunaCursor.png",
      },
      {
        name: "Coquette Pickle",
        price: 25000,
        cursor: "url('media/cursors/CoquettePickleCursor.png') 6 6, auto",
        imageSrc: "media/cursors/CoquettePickleCursor.png",
      },
    ];
    this.items.forEach((item) => {
      item.image = new Image();
      item.image.src = item.imageSrc;
    });
    this.selectedItem = this.items[0]; // Tracks the currently selected item
  }

  show() {
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
  }

  render() {
    if (!this.isVisible) return;

    ctx.save();

    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    const buttonSize = canvas.width / 40;
    const buttonX = (canvas.width * 78) / 80;
    const buttonY = (canvas.height * 1) / 160;
    ctx.fillRect(buttonX, buttonY, buttonSize, buttonSize);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.fillStyle = "white";
    ctx.font = "2rem DiloWorld";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeText("X", buttonX + buttonSize / 2, buttonY + buttonSize / 2);
    ctx.fillText("X", buttonX + buttonSize / 2, buttonY + buttonSize / 2);

    const buttonWidth = canvas.width / 7; // Adjust width for 3 columns
    const buttonHeight = canvas.height / 4; // Adjust height for 2 rows
    const startX = (canvas.width - buttonWidth * 3) / 2; // Center items horizontally
    const startY = canvas.height / 6; // Vertical starting point
    const gap = canvas.width / 30; // Gap between items
    const radius = 20;

    this.items.forEach((item, index) => {
      const canAfford = m_CurrencyManager.getFGradeToken() >= item.price;
      ctx.fillStyle = canAfford ? "#384454" : "#7f8285";
      const i = Math.floor(index / 3); // 3 items per row
      const j = index % 3; // Column index within the row
      const x = startX + j * (buttonWidth + gap);
      const y = startY + i * (buttonHeight + gap);

      if (this.selectedItem === item) {
        ctx.strokeStyle = "#ae7d42"; // Gold color for the outline
        ctx.lineWidth = 8; // Thicker outline
        ctx.strokeRect(x - 5, y - 5, buttonWidth + 10, buttonHeight + 10); // Expand outline
      }

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

      if (this.selectedItem === item) {
        ctx.strokeStyle = "#ae7d42"; // Gold color for the outline
        ctx.lineWidth = 8; // Thicker outline

        // Draw a fully rounded outline
        ctx.beginPath();
        ctx.moveTo(x + radius - 5, y - 5); // Start at the top-left with offset for the outline
        ctx.lineTo(x + buttonWidth - radius + 5, y - 5); // Top-right horizontal line
        ctx.quadraticCurveTo(
          x + buttonWidth + 5,
          y - 5,
          x + buttonWidth + 5,
          y + radius - 5
        ); // Top-right corner
        ctx.lineTo(x + buttonWidth + 5, y + buttonHeight - radius + 5); // Right vertical line
        ctx.quadraticCurveTo(
          x + buttonWidth + 5,
          y + buttonHeight + 5,
          x + buttonWidth - radius + 5,
          y + buttonHeight + 5
        ); // Bottom-right corner
        ctx.lineTo(x + radius - 5, y + buttonHeight + 5); // Bottom horizontal line
        ctx.quadraticCurveTo(
          x - 5,
          y + buttonHeight + 5,
          x - 5,
          y + buttonHeight - radius + 5
        ); // Bottom-left corner
        ctx.lineTo(x - 5, y + radius - 5); // Left vertical line
        ctx.quadraticCurveTo(x - 5, y - 5, x + radius - 5, y - 5); // Top-left corner
        ctx.closePath();
        ctx.stroke(); // Apply the stroke for the outline
      }

      ctx.strokeStyle = "black";
      ctx.lineWidth = 5;
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.font = "2.5rem DiloWorld";

      let itemText = item.name;
      ctx.strokeText(
        itemText,
        x + buttonWidth / 2,
        y + buttonHeight / 2 - canvas.height / 14
      );
      ctx.fillText(
        itemText,
        x + buttonWidth / 2,
        y + buttonHeight / 2 - canvas.height / 14
      );

      if (item.image) {
        const imgWidth = (item.image.width * canvas.height) / 600;
        const imgHeight = (item.image.height * canvas.height) / 600;
        const imgX = x + (buttonWidth - imgWidth) / 2;
        const imgY = y + (buttonHeight - imgHeight - canvas.height / 12);
        ctx.drawImage(item.image, imgX, imgY, imgWidth, imgHeight);
      }

      if (item.price > 0) {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 5;
        itemText = item.price + " ";
        ctx.textAlign = "center";
        ctx.strokeText(
          itemText,
          x + buttonWidth / 2,
          y + buttonHeight - canvas.height / 20
        );
        ctx.fillText(
          itemText,
          x + buttonWidth / 2,
          y + buttonHeight - canvas.height / 20
        );

        const tokenImage = m_CurrencyManager.images[1];
        ctx.drawImage(
          tokenImage,
          x + buttonWidth / 2 + ctx.measureText(itemText).width / 2,
          y + buttonHeight - canvas.height / 20 - canvas.height / 60,
          canvas.height / 35,
          canvas.height / 35
        );
      }
    });

    ctx.restore();
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

    const buttonWidth = canvas.width / 7;
    const buttonHeight = canvas.height / 4;
    const startX = (canvas.width - buttonWidth * 3) / 2;
    const startY = canvas.height / 6;
    const gap = canvas.width / 30;

    this.items.forEach((item, index) => {
      const buttonX = startX + (index % 3) * (buttonWidth + gap);
      const buttonY = startY + Math.floor(index / 3) * (buttonHeight + gap);
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
          this.selectedItem = item; // Mark as selected after purchase
          canvas.style.cursor = item.cursor;
        } else if (item.price === 0) {
          canvas.style.cursor = item.cursor;
          this.selectedItem = item; // Mark this item as selected
        } else {
          console.log("Not enough F Grade Tokens to purchase " + item.name);
        }
      }
    });
  }
}

const m_Shop = new Shop();
