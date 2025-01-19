class Monetization {
  constructor() {
    this.isVisible = false;
    this.monetizationImage = new Image();
    this.monetizationImage.src = "media/MonetizationShop.png";
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

    ctx.fillStyle = "rgba(87, 79, 79, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      this.monetizationImage,
      canvas.width / 2 - this.monetizationImage.width / 2,
      canvas.height / 2 - this.monetizationImage.height / 2
    );

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
  }
}

const m_Monetization = new Monetization();
