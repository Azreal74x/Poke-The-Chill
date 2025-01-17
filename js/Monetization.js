class Monetization {
  constructor() {
    this.isVisible = false;
    this.monetizationImage = new Image();
    this.monetizationImage.src = "images/monetization.png"; // Update the path to your image
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
    ctx.fillStyle = "rgba(87, 79, 79, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      this.monetizationImage,
      canvas.width / 2 - this.monetizationImage.width / 2,
      canvas.height / 2 - this.monetizationImage.height / 2
    );

    // Draw the close button
    ctx.fillStyle = "red";
    ctx.fillRect(canvas.width - 60, 10, 50, 50);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("X", canvas.width - 45, 45);
  }

  click(x, y) {
    if (!this.isVisible) return;

    // Check if the close button is clicked
    if (x > canvas.width - 60 && x < canvas.width - 10 && y > 10 && y < 60) {
      this.hide();
    }
  }
}

const m_Monetization = new Monetization();
