class Button {
  constructor(
    posX,
    posY,
    scale,
    text,
    price,
    imageSrc = null,
    showText = true,
    showValue = false,
    prices = null
  ) {
    this.posX = posX;
    this.posY = posY;

    this.scale = scale * (canvas.width / 1000);
    this.width = 5.75 * scale * (canvas.width / 2000);
    this.height = 1.25 * scale * (canvas.width / 2000);

    this.price = price;
    this.priceMultiplier = 1.1; // 10% multiplier
    this.canBeBought = false;
    this.text = text;
    this.image = null; // This can be your �coin� or �icon� image
    this.showText = showText;
    this.showValue = showValue;
    this.currentPriceIndex = 0;
    this.prices = prices;
    this.isDisabled = false;

    // =============== LOAD BACKGROUND IMAGES ===============
    this.bgEnabledImage = new Image();
    this.bgEnabledImage.src = "media/buttons/Button.png"; // or any "enabled" background

    this.bgDisabledImage = new Image();
    this.bgDisabledImage.src = "media/buttons/ButtonDisabled.png"; // or "disabled" background

    // If you want a third �hover� or �canBuy� image,
    // create and load it here, e.g.:
    // this.bgCanBuyImage = new Image();
    // this.bgCanBuyImage.src = "media/ButtonCanBuy.png";

    // =============== LOAD ICON IMAGE (e.g. coin) ===============
    if (imageSrc) {
      this.loadImage(imageSrc);
    }
  }

  loadImage(src) {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      this.image = image;
    };
  }

  update(dt) {
    if (!this.isDisabled) {
      this.canBeBought = m_CurrencyManager.getNoChillToken() >= this.price;
    }
  }

  buttonPressed() {
    if (this.canBeBought) {
      m_ButtonClickSound.currentTime = 0;
      m_ButtonClickSound.play();
      this.canBeBought = false;

      m_CurrencyManager.RemoveCurrencyAmount(1, this.price);

      if (this.prices !== null) {
        // If you have a fixed array of prices
        this.price = this.prices[this.currentPriceIndex];
        this.currentPriceIndex++;
      } else {
        // Otherwise multiply by the multiplier
        this.price = parseInt(this.price * this.priceMultiplier);
      }
      return true;
    }
    return false;
  }

  disable() {
    this.isDisabled = true;
    this.canBeBought = false;
  }

  render() {
    // ======================= CHOOSE BACKGROUND IMAGE =======================
    let bgImage;

    // First check if it's disabled
    if (this.isDisabled) {
      bgImage = this.bgDisabledImage;
    } else {
      // Not disabled, so check if it can be bought
      if (this.canBeBought) {
        // Optionally use a separate �canBuy� image if you have it:
        // bgImage = this.bgCanBuyImage;
        // or just use the �enabled� background
        bgImage = this.bgEnabledImage;
      } else {
        // Not disabled but also can�t be bought
        bgImage = this.bgDisabledImage;
      }
    }

    // =============== DRAW THE BACKGROUND ===============
    // Make sure the image is loaded before drawing (bgImage.complete).
    if (bgImage && bgImage.complete) {
      ctx.drawImage(bgImage, this.posX, this.posY, this.width, this.height);
    }

    // =============== DRAW ICON OR EXTRA IMAGE (IF NEEDED) ===============
    // If !showText, you said you draw the �icon� big in the button, etc.
    // Keep that logic the same; just do it after drawing the background.
    if (!this.showText && this.image) {
      ctx.drawImage(this.image, this.posX, this.posY, this.width, this.height);
    }

    // =============== DRAW THE TEXT ===============
    if (this.showText) {
      ctx.fillStyle = "white";
      ctx.font = "2.5rem DiloWorld";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 5;
      ctx.textAlign = "left";

      // Title text
      const textX = this.posX + canvas.width / 100 + 15;
      const textY = this.posY + canvas.width / 43;
      ctx.strokeText(this.text, textX, textY);
      ctx.fillText(this.text, textX, textY);

      // If you want a coin image right next to the price
      if (this.image) {
        const textWidth = ctx.measureText(this.price + " ").width;
        ctx.drawImage(
          this.image,
          this.posX + canvas.width / 70 + textWidth,
          this.posY + canvas.width / 37,
          canvas.width / 70,
          canvas.width / 70
        );
      }

      // Price text
      if (this.price !== 0) {
        ctx.strokeText(
          this.price + " ",
          this.posX + canvas.width / 60,
          this.posY + canvas.width / 25,
          this.width
        );
        ctx.fillText(
          this.price + " ",
          this.posX + canvas.width / 60,
          this.posY + canvas.width / 25,
          this.width
        );
      }
    }

    // =============== DRAW THE �VALUE� (IF showValue === true) ===============
    if (this.showValue) {
      ctx.fillStyle = "white";
      ctx.font = "2.25rem DiloWorld";
      ctx.textAlign = "right";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 5;

      let currentValue = "";
      if (this.text === "Click Damage") {
        currentValue = damageScore;
      } else if (this.text === "No Chill Reward") {
        currentValue = scoreMultiplier;
      } else if (this.text === "Auto Click Damage") {
        currentValue = autoClickDamage;
      } else if (this.text === "Tier Up") {
        currentValue = m_TierLevel + 1;
      }

      // �x� + the current value
      ctx.strokeText(
        "x" + currentValue,
        this.posX + this.width - canvas.width / 200 - 28,
        this.posY + this.height / 2 + canvas.width / 300 + 10
      );
      ctx.fillText(
        "x" + currentValue,
        this.posX + this.width - canvas.width / 200 - 28,
        this.posY + this.height / 2 + canvas.width / 300 + 10
      );
    }
  }

  remove() {
    this.posX = null;
    this.posY = null;
    this.scale = null;
    this.width = null;
    this.height = null;
    this.price = null;
    this.priceMultiplier = null;
    this.canBeBought = null;
    this.text = null;
    this.image = null;
    this.prices = null;
    this.currentPriceIndex = null;
  }
}
