class Power {
  constructor(posX, posY, scale, text, price) {
    this.posX = posX;
    this.posY = posY;

    this.scale = scale * (canvas.width / 1000);
    this.width = 2 * scale;
    this.height = 2 * scale;

    this.price = price;
    this.canBeBought = false;
    this.text = text;

    this.moniTokenImage = new Image();
    this.moniTokenImage.src = "media/MoniToken.png";
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
    m_BackgroundMusic.pause();
    m_BoostMusic.play();
    this.isActive = true;

    if (this.text === "Balkan Anger (Double Damage)") {
      const originalDamageScore = damageScore;
      damageScore *= 2;

      // Set a timer to revert the damage score back after 30 seconds
      setTimeout(() => {
        damageScore = parseFloat(
          (
            originalDamageScore +
            (damageScore - originalDamageScore * 2)
          ).toFixed(2)
        );
        this.canBeBought = true; // Re-enable the button after the effect ends
        this.isActive = false;
        m_BackgroundMusic.play();
      }, 10000);
    } else if (this.text === "Communist Gain (Double Tokens)") {
      const originalScoreMultiplier = scoreMultiplier;
      scoreMultiplier *= 2;

      // Set a timer to revert the income back after 30 seconds
      setTimeout(() => {
        scoreMultiplier = parseFloat(
          (
            originalScoreMultiplier +
            (scoreMultiplier - originalScoreMultiplier * 2)
          ).toFixed(2)
        );
        this.canBeBought = true; // Re-enable the button after the effect ends
        this.isActive = false;
        m_BackgroundMusic.play();
      }, 10000);
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

    ctx.fillStyle = "darkblue";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.font = "1.75rem DiloWorld";
    ctx.textAlign = "left";

    ctx.strokeText(
      this.text,
      this.posX + this.width + canvas.width / 300,
      this.posY + this.height / 2 - canvas.width / 300
    );

    ctx.fillText(
      this.text,
      this.posX + this.width + canvas.width / 300,
      this.posY + this.height / 2 - canvas.width / 300
    );

    ctx.strokeText(
      this.price,
      this.posX + this.width + canvas.width / 300,
      this.posY + this.height / 2 + canvas.width / 100
    );

    ctx.fillText(
      this.price,
      this.posX + this.width + canvas.width / 300,
      this.posY + this.height / 2 + canvas.width / 100
    );
    const textWidth = ctx.measureText(this.price).width;
    ctx.drawImage(
      this.moniTokenImage,
      this.posX + this.width + canvas.width / 200 + textWidth,
      this.posY + this.height / 2,
      canvas.width / 80,
      canvas.width / 80
    );
  }
}
