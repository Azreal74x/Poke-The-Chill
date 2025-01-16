class Button {
  constructor(posX, posY, scale, text, price) {
    this.posX = posX;
    this.posY = posY;

    this.scale = scale;
    this.width = 5 * scale;
    this.height = 1 * scale;

    this.price = price;
    this.priceMultiplier = 1.1; // Multiplier of 10%
    this.canBeBought = false;
    this.text = text;
  }

  update(dt) {
    this.canBeBought = m_CurrencyManager.getNoChillToken() >= this.price;
  }

  buttonPressed() {
    if (this.canBeBought) {
      this.canBeBought = false;
      m_CurrencyManager.RemoveCurrencyAmount(1, this.price);
      this.price = parseInt(this.price * this.priceMultiplier);
      // Apply the effect
      return true;
    }
    return false;
  }

  render() {
    if (this.canBeBought) {
      ctx.fillStyle = "Yellow";
    } else if (this.canBeBought !== null) {
      ctx.fillStyle = "Gray";
    }
    ctx.fillRect(this.posX, this.posY, this.width, this.height);

    ctx.fillStyle = "black";
    ctx.font = "30px, Arial";
    ctx.fillText(this.text, this.posX + 30, this.posY + 30, this.width);

    if (this.price !== 0) {
      ctx.fillText(
        "price: " + this.price + " credits",
        this.posX + 30,
        this.posY + 60,
        this.width
      );
    }
  }

  remove() {
    // Set the button properties to null to stop updating and rendering it
    this.posX = null;
    this.posY = null;
    this.scale = null;
    this.width = null;
    this.height = null;
    this.price = null;
    this.priceMultiplier = null;
    this.canBeBought = null;
    this.text = null;
  }
}
