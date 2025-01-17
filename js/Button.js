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

    this.scale = scale;
    this.width = 5 * scale;
    this.height = 1 * scale;

    this.price = price;
    this.priceMultiplier = 1.1; // Multiplier of 10%
    this.canBeBought = false;
    this.text = text;
    this.image = null;
    this.showText = showText;
    this.showValue = showValue;
    this.currentPriceIndex = 0;
    this.prices = prices;
    this.isDisabled = false;
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
      this.canBeBought = false;
      m_CurrencyManager.RemoveCurrencyAmount(1, this.price);
      if (this.prices !== null) {
        this.price = this.prices[this.currentPriceIndex];
        this.currentPriceIndex++;
      } else {
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
    if (this.isDisabled) {
      ctx.fillStyle = "#2d2d2d";
    } else if (this.canBeBought) {
      ctx.fillStyle = "Yellow";
    } else if (this.canBeBought !== null) {
      ctx.fillStyle = "Gray";
    }

    ctx.fillRect(this.posX, this.posY, this.width, this.height);

    if (!this.showText && this.image) {
      const imgX = this.posX + (this.width - this.image.width) / 2;
      const imgY = this.posY + (this.height - this.image.height) / 2;
      ctx.drawImage(this.image, imgX, imgY);
    }

    if (this.showText) {
      ctx.fillStyle = "black";
      ctx.font = "30px Arial";
      ctx.textAlign = "left";

      const textX = this.posX + 30;
      const textY = this.posY + 30;
      ctx.fillText(this.text, textX, textY);
    }

    if (this.image && this.showText) {
      const textWidth = ctx.measureText(this.price + " ").width;
      ctx.drawImage(
        this.image,
        this.posX + 30 + textWidth,
        this.posY + 40,
        20,
        20
      );
    }

    if (this.price !== 0) {
      ctx.fillText(
        this.price + " ",
        this.posX + 30,
        this.posY + 60,
        this.width
      );
    }

    if (this.showValue) {
      ctx.fillStyle = "black";
      ctx.font = "20px Arial";
      ctx.textAlign = "right";
      let currentValue;
      if (this.text === "Click Multiplier") {
        currentValue = damageScore;
      } else if (this.text === "No Chill Multiplier") {
        currentValue = scoreMultiplier;
      } else if (this.text === "Auto Click Damage") {
        currentValue = autoClickDamage;
      } else if (this.text === "Tier Up") {
        currentValue = m_TierLevel;
      } else {
        currentValue = "";
      }
      ctx.fillText(
        "x" + currentValue,
        this.posX + this.width - 10,
        this.posY + this.height / 2 + 10
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
