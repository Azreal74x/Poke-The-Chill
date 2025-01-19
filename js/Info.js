class Info {
  constructor() {
    this.isVisible = false;
    this.infoImage = new Image();
    this.infoImage.src = "media/InfoPage.png";
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

    const scale = (0.5 * canvas.width) / 6000;
    const imageWidth = this.infoImage.width * scale;
    const imageHeight = this.infoImage.height * scale;
    const imageX = (canvas.width - imageWidth) / 2;
    const imageY = (canvas.height - imageHeight) / 2;

    ctx.drawImage(this.infoImage, imageX, imageY, imageWidth, imageHeight);

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

const m_Info = new Info();
