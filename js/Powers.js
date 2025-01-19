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

    this.isActive = false;

    // Load images for enabled and disabled states
    this.enabledImage = new Image();
    this.disabledImage = new Image();

    if (this.text === "Balkan Anger") {
      this.enabledImage.src = "media/buttons/Balkan.png";
      this.disabledImage.src = "media/buttons/BalkanDisabled.png";
    } else if (this.text === "Communist Gain") {
      this.enabledImage.src = "media/buttons/Communist.png";
      this.disabledImage.src = "media/buttons/CommunistDisabled.png";
    }

    this.moniTokenImage = new Image();
    this.moniTokenImage.src = "media/MoniToken.png";

    this.tempMessage = ""; // Temporary message text
    this.tempMessageTimer = null; // Timer for clearing the message
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

    // Set the temporary message based on the power-up type
    if (this.text === "Balkan Anger") {
      this.tempMessage = "Balkan Anger! Double Damage!";
      this.showTempMessage(); // Show the message temporarily

      const originalDamageScore = damageScore;
      damageScore *= 2;

      setTimeout(() => {
        damageScore = parseFloat(
          (
            originalDamageScore +
            (damageScore - originalDamageScore * 2)
          ).toFixed(2)
        );
        this.canBeBought = true;
        this.isActive = false;
        m_BackgroundMusic.play();
      }, 10000);
    } else if (this.text === "Communist Gain") {
      this.tempMessage = "Communist Gain! Double Rewards!";
      this.showTempMessage(); // Show the message temporarily

      const originalScoreMultiplier = scoreMultiplier;
      scoreMultiplier *= 2;

      setTimeout(() => {
        scoreMultiplier = parseFloat(
          (
            originalScoreMultiplier +
            (scoreMultiplier - originalScoreMultiplier * 2)
          ).toFixed(2)
        );
        this.canBeBought = true;
        this.isActive = false;
        m_BackgroundMusic.play();
      }, 10000);
    }
  }

  showTempMessage() {
    // Display the message for 1 second
    if (this.tempMessageTimer) {
      clearTimeout(this.tempMessageTimer);
    }

    this.tempMessageTimer = setTimeout(() => {
      this.tempMessage = "";
    }, 2000);
  }

  render() {
    // Render the temporary message at the top of the screen
    if (this.tempMessage) {
      ctx.fillStyle = "#f2bb5f";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 5;
      ctx.font = "3rem DiloWorld";
      ctx.textAlign = "center";

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 15;

      ctx.strokeText(this.tempMessage, centerX, centerY);
      ctx.fillText(this.tempMessage, centerX, centerY);
    }

    // Select the appropriate image based on `canBeBought` state
    const bgImage = this.canBeBought ? this.enabledImage : this.disabledImage;

    // Draw the background image
    if (bgImage.complete) {
      ctx.drawImage(bgImage, this.posX, this.posY, this.width, this.height);
    }

    // Render the text
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.font = "2.5rem DiloWorld";
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

    // Render the price with MoniToken icon
    ctx.strokeText(
      this.price,
      this.posX + this.width + canvas.width / 300,
      this.posY + this.height / 2 + canvas.width / 75
    );

    ctx.fillText(
      this.price,
      this.posX + this.width + canvas.width / 300,
      this.posY + this.height / 2 + canvas.width / 75
    );

    const textWidth = ctx.measureText(this.price).width;
    ctx.drawImage(
      this.moniTokenImage,
      this.posX + this.width + canvas.width / 200 + textWidth,
      this.posY + this.height / 2,
      canvas.width / 70,
      canvas.width / 70
    );
  }
}