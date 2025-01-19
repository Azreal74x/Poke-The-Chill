class CurrencyManager {
  constructor(posX, posY, noChillAmount, fGradeAmount, moniAmount, scale) {
    this.posX = posX;
    this.posY = posY;

    this.noChillAmount = noChillAmount;
    this.fGradeAmount = fGradeAmount;
    this.moniAmount = moniAmount;

    this.scale = scale * (canvas.width / 2000);

    this.areImagesLoaded = false;

    this.images = [];
    this.positions = [];

    //img path, index, yPos
    const promise1 = this.loadImage("media/NoChillToken.png", 0, 0);
    const promise2 = this.loadImage(
      "media/FGradeToken.png",
      1,
      canvas.height / 10
    );
    const promise3 = this.loadImage(
      "media/MoniToken.png",
      2,
      canvas.height / 5
    );

    this.promiseReady = Promise.all([promise1, promise2, promise3]).then(() => {
      this.scale = 1 * (canvas.width / 2000);
      this.areImagesLoaded = true;
    });
  }

  loadImage(src, index, posYOffset) {
    const image = new Image();
    image.src = src;

    return new Promise((resolve) => {
      image.onload = () => {
        this.images[index] = image;
        this.positions[index] = {
          x: this.posX,
          y: this.posY + posYOffset,
        };
        resolve();
      };
    });
  }

  AddCurrencyAmount(currency, amount) {
    if (currency === 1) {
      this.noChillAmount += amount;
    } else if (currency === 2) {
      this.fGradeAmount += amount;
    } else if (currency === 3) {
      this.moniAmount += amount;
    }
  }

  RemoveCurrencyAmount(currency, amount) {
    if (currency === 1 && amount <= this.noChillAmount) {
      this.noChillAmount -= amount;
    } else if (currency === 2 && amount <= this.fGradeAmount) {
      this.fGradeAmount -= amount;
    } else if (currency === 3 && amount <= this.moniAmount) {
      this.moniAmount -= amount;
    } else {
      console.log("Amount could not be removed from currency.");
    }
  }

  reset() {}

  start() {}

  update(dt) {}

  render() {
    if (this.areImagesLoaded) {
      this.images.forEach((image, index) => {
        const position = this.positions[index];

        ctx.drawImage(
          image,
          position.x,
          position.y,
          image.width * this.scale,
          image.height * this.scale
        );

        let amount = 0;
        if (index === 0) amount = Math.floor(this.noChillAmount);
        if (index === 1) amount = Math.floor(this.fGradeAmount);
        if (index === 2) amount = Math.floor(this.moniAmount);

        //draw text next to imgs
        ctx.font = "4rem DiloWorld";
        ctx.fillStyle = "white";
        ctx.textAlign = "left";

        ctx.strokeStyle = "black";
        ctx.lineWidth = 5 * this.scale;
        ctx.strokeText(
          `${amount}`,
          position.x + image.width * this.scale + image.width / 3,
          position.y + (image.height * this.scale) / 2 + canvas.height / 60
        );

        ctx.fillText(
          `${amount}`,
          position.x + image.width * this.scale + image.width / 3,
          position.y + (image.height * this.scale) / 2 + canvas.height / 60
        );
      });
    }
  }

  getNoChillToken() {
    return this.noChillAmount;
  }

  getMoniToken() {
    return this.moniAmount;
  }

  getFGradeToken() {
    return this.fGradeAmount;
  }
}
