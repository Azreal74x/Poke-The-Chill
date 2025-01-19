class Wheel {
  constructor(posX, posY) {
    this.posX = posX;
    this.posY = posY;

    this.scale = 2 * (canvas.width / 2000); // Add scale property

    this.rewards = [
      "1",
      "750",
      "5000",
      "500",
      "3000",
      "250",
      "2000",
      "50",
      "10000",
    ];
    this.colors = [
      "#B8D430",
      "#3AB745",
      "#029990",
      "#3501CB",
      "#2E2C75",
      "#673A7E",
      "#CC0071",
      "#F80120",
      "#F35B20",
    ];
    this.startAngle = 0;
    this.arc = (2 * Math.PI) / this.rewards.length;
    this.spinTimeout = null;
    this.spinAngleStart = 0;
    this.spinTime = 0;
    this.spinTimeTotal = 0;
    this.isVisible = false; // Determines if the wheel is visible

    // Store the last reward
    this.lastReward = null;

    // Temporary canvas for drawing the wheel
    this.canvas = document.createElement("canvas");
    this.canvas.width = 500 * this.scale;
    this.canvas.height = 500 * this.scale;
    this.ctx = this.canvas.getContext("2d");
  }

  drawRouletteWheel() {
    const ctx = this.ctx;
    const outsideRadius = 200 * this.scale;
    const textRadius = 160 * this.scale;
    const insideRadius = 125 * this.scale;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.rewards.length; i++) {
      const angle = this.startAngle + i * this.arc;
      ctx.fillStyle = this.colors[i % this.colors.length];

      ctx.beginPath();
      ctx.arc(
        250 * this.scale,
        250 * this.scale,
        outsideRadius,
        angle,
        angle + this.arc,
        false
      );
      ctx.arc(
        250 * this.scale,
        250 * this.scale,
        insideRadius,
        angle + this.arc,
        angle,
        true
      );
      ctx.fill();

      // Add reward text
      ctx.save();
      ctx.fillStyle = "white";
      ctx.font = `3rem DiloWorld`;
      ctx.translate(
        250 * this.scale + Math.cos(angle + this.arc / 2) * textRadius,
        250 * this.scale + Math.sin(angle + this.arc / 2) * textRadius
      );
      ctx.rotate(angle + this.arc / 2 + Math.PI / 2);
      const text = this.rewards[i];

      ctx.strokeStyle = "black";
      ctx.lineWidth = 4 * this.scale;
      ctx.strokeText(text, -ctx.measureText(text).width / 2, 0);
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    }

    // Draw pointer
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(
      250 * this.scale - 4 * this.scale,
      250 * this.scale - (outsideRadius + 5 * this.scale)
    );
    ctx.lineTo(
      250 * this.scale + 4 * this.scale,
      250 * this.scale - (outsideRadius + 5 * this.scale)
    );
    ctx.lineTo(
      250 * this.scale + 4 * this.scale,
      250 * this.scale - (outsideRadius - 5 * this.scale)
    );
    ctx.lineTo(
      250 * this.scale + 9 * this.scale,
      250 * this.scale - (outsideRadius - 5 * this.scale)
    );
    ctx.lineTo(
      250 * this.scale + 0 * this.scale,
      250 * this.scale - (outsideRadius - 13 * this.scale)
    );
    ctx.lineTo(
      250 * this.scale - 9 * this.scale,
      250 * this.scale - (outsideRadius - 5 * this.scale)
    );
    ctx.lineTo(
      250 * this.scale - 4 * this.scale,
      250 * this.scale - (outsideRadius - 5 * this.scale)
    );
    ctx.lineTo(
      250 * this.scale - 4 * this.scale,
      250 * this.scale - (outsideRadius + 5 * this.scale)
    );
    ctx.fill();

    if (this.lastReward != null) {
      ctx.save();
      ctx.fillStyle = "white"; // Set the color to ensure visibility
      ctx.font = `10rem DiloWorld`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 6 * this.scale;
      ctx.strokeText(this.lastReward, 250 * this.scale, 250 * this.scale);

      ctx.fillText(this.lastReward, 250 * this.scale, 250 * this.scale); // Centered text
      ctx.restore();
    }
  }

  spin() {
    this.spinAngleStart = Math.random() * 10 + 10;
    this.spinTime = 0;
    this.spinTimeTotal = Math.random() * 3 + 4 * 1000;
    this.isVisible = true; // Make the wheel visible
    this.rotateWheel();
  }

  rotateWheel() {
    m_WheelDoneSpinning = false;
    this.spinTime += 30;
    if (this.spinTime >= this.spinTimeTotal) {
      this.stopRotateWheel();
      return;
    }
    const spinAngle =
      this.spinAngleStart -
      this.easeOut(this.spinTime, 0, this.spinAngleStart, this.spinTimeTotal);
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
    this.lastReward = reward; // Store the reward

    // Redraw the wheel to display the reward in the center
    this.drawRouletteWheel();

    m_WheelFinishedSound.play();
    m_WheelDoneSpinning = true;

    // Hide the wheel after showing the result
    setTimeout(() => {
      m_WheelRewardSound.play();
      this.determineReward(parseInt(reward, 10)); // Call determineReward with the selected reward
      this.isVisible = false; // Hide after a short delay to display the reward
      this.lastReward = null; // Clear the last reward
      this.isActive = false;
    }, 1000); // Adjust the delay as needed
  }

  easeOut(t, b, c, d) {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
  }

  DoRenderOnce() {
    this.isActive = true;
    this.spin();
  }

  render(ctx) {
    if (this.isVisible) {
      // Draw the wheel if it's visible
      ctx.drawImage(
        this.canvas,
        this.posX - 250 * this.scale,
        this.posY - 250 * this.scale
      );
    }
  }

  determineReward(reward) {
    // Add currency based on reward
    m_CurrencyManager.AddCurrencyAmount(1, reward);
    console.log("Reward added:", reward);
  }
}
