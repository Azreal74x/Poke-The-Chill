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

    this.moniTokenImage = new Image();
    this.moniTokenImage.src = "images/MoniToken.png";
  }

  update(dt) {
    this.canBeBought = m_CurrencyManager.getMoniToken() >= this.price;
  }

  buttonPressed() {
    if (this.canBeBought && !this.isActive) {
      this.canBeBought = false;
      m_CurrencyManager.RemoveCurrencyAmount(3, this.price);
      this.activatePower();
    }
  }

  activatePower() {
    this.isActive = true;
    if (this.text === "Balkan Anger (Double Damage)") {
      damageScore *= 2;

      // Set a timer to revert the damage score back after 30 seconds
      setTimeout(() => {
        damageScore /= 2;
        this.canBeBought = true; // Re-enable the button after the effect ends
        this.isActive = false;
      }, 30000);
    } else if (this.text === "Communist Gain (Double Tokens)") {
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
      this.posX + this.width / 2,
      this.posY + this.height / 2,
      this.width / 2,
      0,
      2 * Math.PI
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
      this.price,
      this.posX + this.width + 10,
      this.posY + this.height / 2 + 20
    );
    const textWidth = ctx.measureText(this.price).width;
    ctx.drawImage(
      this.moniTokenImage,
      this.posX + this.width + 10 + textWidth + 5,
      this.posY + this.height / 2,
      25,
      25
    );
  }
}
