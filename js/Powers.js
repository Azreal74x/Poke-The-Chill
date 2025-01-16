class Power {
  constructor(posX, posY, scale, text, price) {
    this.posX = posX;
    this.posY = posY;

    this.scale = scale;
    this.width = 2 * scale;
    this.height = 2 * scale;

    this.price = price;
    this.canBeBought = false;
    this.text = text;
  }

  update(dt) {
    this.canBeBought = m_CurrencyManager.getMoniToken() >= this.price;
  }

  buttonPressed() {
    if (this.canBeBought && !this.isActive) {
      this.canBeBought = false;
      m_CurrencyManager.RemoveCurrencyAmount("moni", this.price);
      this.activatePower();
    }
  }

  activatePower() {
    this.isActive = true;
    if (this.text === "Balkan Anger (Double Damage)") {
      // Double the damage score
      damageScore *= 2;

      // Set a timer to revert the damage score back after 30 seconds
      setTimeout(() => {
        damageScore /= 2;
        this.canBeBought = true; // Re-enable the button after the effect ends
        this.isActive = false;
      }, 30000);
    } else if (this.text === "Communist Gain (Double Tokens)") {
      // Double the income
      scoreMultiplier *= 2;

      // Set a timer to revert the income back after 30 seconds
      setTimeout(() => {
        scoreMultiplier /= 2;
        this.canBeBought = true; // Re-enable the button after the effect ends
        this.isActive = false;
      }, 30000);
    }
  }

  render() {
    if (this.isActive) {
      ctx.fillStyle = "Red";
    } else if (this.canBeBought) {
      ctx.fillStyle = "Blue";
    } else {
      ctx.fillStyle = "Gray";
    }

    ctx.beginPath();
    ctx.arc(
      this.posX + this.width / 2, // x coordinate of the center
      this.posY + this.height / 2, // y coordinate of the center
      this.width / 2, // radius
      0, // start angle
      2 * Math.PI // end angle
    );
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";

    ctx.fillText(
      this.text,
      this.posX + this.width + 10,
      this.posY + this.height / 2 - 10
    );

    ctx.fillText(
      "Price: " + this.price + " Moni Tokens",
      this.posX + this.width + 10,
      this.posY + this.height / 2 + 10
    );
  }
}
