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
    this.width = 5.5 * scale * (canvas.width / 1000);
    this.height = 1 * scale * (canvas.width / 1000);

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
      m_ButtonClickSound.currentTime = 0;
      m_ButtonClickSound.play();
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

    // Draw rounded rectangle
    const radius = 10;
    ctx.beginPath();
    ctx.moveTo(this.posX + radius, this.posY);
    ctx.lineTo(this.posX + this.width - radius, this.posY);
    ctx.quadraticCurveTo(
      this.posX + this.width,
      this.posY,
      this.posX + this.width,
      this.posY + radius
    );
    ctx.lineTo(this.posX + this.width, this.posY + this.height - radius);
    ctx.quadraticCurveTo(
      this.posX + this.width,
      this.posY + this.height,
      this.posX + this.width - radius,
      this.posY + this.height
    );
    ctx.lineTo(this.posX + radius, this.posY + this.height);
    ctx.quadraticCurveTo(
      this.posX,
      this.posY + this.height,
      this.posX,
      this.posY + this.height - radius
    );
    ctx.lineTo(this.posX, this.posY + radius);
    ctx.quadraticCurveTo(this.posX, this.posY, this.posX + radius, this.posY);
    ctx.closePath();
    ctx.fill();

    if (!this.showText && this.image) {
      const imgX = this.posX + (this.width - this.image.width) / 2;
      const imgY = this.posY + (this.height - this.image.height) / 2;
      ctx.drawImage(this.image, imgX, imgY);
    }

    if (this.showText) {
      ctx.fillStyle = "black";
      ctx.font = "2rem DiloWorld";
      ctx.textAlign = "left";

      const textX = this.posX + canvas.width / 100;
      const textY = this.posY + canvas.width / 60;
      ctx.fillText(this.text, textX, textY);
    }

    if (this.image && this.showText) {
      const textWidth = ctx.measureText(this.price + " ").width;
      ctx.drawImage(
        this.image,
        this.posX + canvas.width / 70 + textWidth,
        this.posY + canvas.width / 44,
        canvas.width / 100,
        canvas.width / 100
      );
    }

    if (this.price !== 0) {
      ctx.fillText(
        this.price + " ",
        this.posX + canvas.width / 70,
        this.posY + canvas.width / 30,
        this.width
      );
    }

    if (this.showValue) {
      ctx.fillStyle = "black";
      ctx.font = "1.25rem DiloWorld";
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
        this.posX + this.width - canvas.width / 200,
        this.posY + this.height / 2 + canvas.width / 300
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
