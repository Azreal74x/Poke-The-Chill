class CurrencyManager {
  constructor(posX, posY, noChillAmount, fGradeAmount, moniAmount, scale) {

    this.posX = posX;
    this.posY = posY;

    this.noChillAmount = noChillAmount;
    this.fGradeAmount = fGradeAmount;
    this.moniAmount = moniAmount;

    this.scale = scale;
    //this.text = text;

    this.areImagesLoaded = false;

    this.images = []; //store imgs
    this.positions = []; //store y positions

    //img path, index, yPos
    const promise1 = this.loadImage("images/NoChillToken.png", 0, 0);
    const promise2 = this.loadImage("images/FGradeToken.png", 1, 100);
    const promise3 = this.loadImage("images/MoniToken.png", 2, 200);

    //wait for promise to be completed
    this.promiseReady = Promise.all([promise1, promise2, promise3]).then(() => {
      this.scale = 3;
      this.areImagesLoaded = true;
    });
  }

  loadImage(src, index, posYOffset) {
    const image = new Image();
    image.src = src;

    return new Promise((resolve) => {
      image.onload = () => {
        this.images[index] = image; //store img at index
        this.positions[index] = {
          x: this.posX,
          y: this.posY + posYOffset, //add offset to y pos
        };
        resolve();
      };
    });
  }

  AddCurrencyAmount(currency, amount) {
    if (currency === 1) {
      this.noChillAmount += amount;
    }
    else if (currency === 2) {
      this.fGradeAmount += amount;
    }
    else if (currency === 3) {
      this.moniAmount += amount;
    }
  }

  RemoveCurrencyAmount(currency, amount) {
    if (currency === 1 && amount <= this.noChillAmount) {
      this.noChillAmount -= amount;
    }
    else if (currency === 2 && amount <= this.fGradeAmount) {
      this.fGradeAmount -= amount;
    }
    else if (currency === 3 && amount <= this.moniAmount) {
      this.moniAmount -= amount;
    }
    else {
      console.log("could not remove from currency");
    }
  }

  reset() {

  }

  start() {

  }

  update(dt) {

  }

  render() {
    if (this.areImagesLoaded) {
      this.images.forEach((image, index) => {
        const position = this.positions[index];

        //draw the imgs
        ctx.drawImage(
          image,
          position.x,
          position.y,
          image.width * this.scale,
          image.height * this.scale
        );

        //set correct amounts
        let amount = 0;
        if (index === 0) amount = Math.floor(this.noChillAmount);
        if (index === 1) amount = Math.floor(this.fGradeAmount);
        if (index === 2) amount = Math.floor(this.moniAmount);

        //draw text next to imgs
        ctx.font = "50px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(
          `${amount}`, //displayed text               
          position.x + (image.width * this.scale) + 10, //x pos next to the imgs
          position.y + (image.height * this.scale) / 2 + 15  //y pos centered with the imgs
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