class Wheel {
  constructor(posX, posY) {
    this.posX = posX;
    this.posY = posY;
    this.rewards = [
      "50", "750", "5000", "7", "3000",
      "1000", "250", "500", "10000",
    ];
    this.colors = [
      "#B8D430", "#3AB745", "#029990", "#3501CB", "#2E2C75",
      "#673A7E", "#CC0071", "#F80120", "#F35B20",
    ];
    this.startAngle = 0;
    this.arc = (2 * Math.PI) / this.rewards.length;
    this.spinTimeout = null;
    this.spinAngleStart = 0;
    this.spinTime = 0;
    this.spinTimeTotal = 0;
    this.isVisible = false; // Determines if the wheel is visible

    // Temporary canvas for drawing the wheel
    this.canvas = document.createElement("canvas");
    this.canvas.width = 500;
    this.canvas.height = 500;
    this.ctx = this.canvas.getContext("2d");
  }

  drawRouletteWheel() {
    const ctx = this.ctx;
    const outsideRadius = 200;
    const textRadius = 160;
    const insideRadius = 125;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.rewards.length; i++) {
      const angle = this.startAngle + i * this.arc;
      ctx.fillStyle = this.colors[i % this.colors.length];

      ctx.beginPath();
      ctx.arc(250, 250, outsideRadius, angle, angle + this.arc, false);
      ctx.arc(250, 250, insideRadius, angle + this.arc, angle, true);
      ctx.fill();

      // Add reward text
      ctx.save();
      ctx.fillStyle = "black";
      ctx.font = "bold 14px Helvetica, Arial";
      ctx.translate(
        250 + Math.cos(angle + this.arc / 2) * textRadius,
        250 + Math.sin(angle + this.arc / 2) * textRadius
      );
      ctx.rotate(angle + this.arc / 2 + Math.PI / 2);
      const text = this.rewards[i];
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    }

    // Draw pointer
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
    ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
    ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
    ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
    ctx.fill();
  }

  spin() {
    this.spinAngleStart = Math.random() * 10 + 10;
    this.spinTime = 0;
    this.spinTimeTotal = Math.random() * 3 + 4 * 1000;
    this.isVisible = true; // Make the wheel visible
    this.rotateWheel();
  }

  rotateWheel() {
    this.spinTime += 30;
    if (this.spinTime >= this.spinTimeTotal) {
      this.stopRotateWheel();
      return;
    }
    const spinAngle =
      this.spinAngleStart - this.easeOut(this.spinTime, 0, this.spinAngleStart, this.spinTimeTotal);
    this.startAngle += (spinAngle * Math.PI) / 180;
    this.drawRouletteWheel();
    this.spinTimeout = setTimeout(() => this.rotateWheel(), 30);
  }

  stopRotateWheel() {
    clearTimeout(this.spinTimeout);
    const degrees = (this.startAngle * 180) / Math.PI + 90;
    const arcd = (this.arc * 180) / Math.PI;
    const index = Math.floor((360 - (degrees % 360)) / arcd);
    const reward = this.rewards[index];
    console.log("Landed on reward:", reward);
    this.determineReward(parseInt(reward, 10)); // Call determineReward with the selected reward
    this.isVisible = false; // Hide the wheel after it stops spinning
  }

  easeOut(t, b, c, d) {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
  }

  DoRenderOnce() {
    this.spin();
  }

  render(ctx) {
    // Render the wheel only if it is visible
    if (this.isVisible) {
      ctx.drawImage(this.canvas, this.posX - 250, this.posY - 250);
    }
  }

  determineReward(reward) {
    // Add currency based on reward
    m_CurrencyManager.AddCurrencyAmount(1, reward);

    if (!m_CoinMinigame.isActive) {
      m_CoinMinigame.start();
    }

    console.log("Reward determined:", reward);
  }
}
