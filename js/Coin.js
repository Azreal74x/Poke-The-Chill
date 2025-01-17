class Coin {
  constructor(posX, posY, type) {
    this.posX = posX;
    this.posY = posY;
    this.type = type;

    this.image = null;

    this.currentFrequency = 0;

    this.coinReady = false;

    this.doRender = false;

    let spritesheetPath;
    if (type === "noChill") {
      spritesheetPath = "images/noChill_coin.png";
    } else if (type === "fGrade") {
      spritesheetPath = "images/fGrade_coin.png";
    } else if (type === "moni") {
      spritesheetPath = "images/moni_coin.png";
    } else {
      spritesheetPath = "images/coins.png";
    }

    const promise = this.loadImage(spritesheetPath);

    this.promiseCoinReady = Promise.all([promise]).then(() => {
      this.scale = 1;
      this.width = this.image.width / 2;
      this.height = this.image.height / 2;

      this.spriteSheet = {
        img: this.image,
        frequency: 1,
        curerentFrame: -1,
        totalFrames: this.image.width / this.image.height,
        x: 0,
        y: 0,
        width: this.image.height * this.scale,
        height: this.image.height * this.scale,
      };
      this.coinReady = true;
    });
  }

  loadImage(src) {
    const image = new Image();
    image.src = src;
    return new Promise((resolve) => {
      image.onload = () => {
        this.image = image;
        resolve();
      };
    });
  }

  reset() {}

  start() {
    if (this.holdTimer === 0) {
      this.holdTimer = Date.now();
    }
  }

  update(dt) {}

  DoRenderOnce(posX, posY) {
    this.posX = posX - 400;
    this.posY = posY;
    this.doRender = true;
  }

  render() {
    if (this.coinReady && this.doRender) {
      if (this.currentFrequency > this.spriteSheet.frequency) {
        this.currentFrequency = 0;

        this.spriteSheet.curerentFrame++;

        if (this.spriteSheet.curerentFrame >= this.spriteSheet.totalFrames) {
          this.spriteSheet.curerentFrame = 0;
          this.doRender = false;
          return;
        }
      } else {
        this.currentFrequency++;
      }

      const frameWidth =
        this.spriteSheet.img.width / this.spriteSheet.totalFrames;
      const frameHeight = this.spriteSheet.img.height;
      const scale = 1.5;

      ctx.drawImage(
        this.spriteSheet.img,

        (this.spriteSheet.img.width / this.spriteSheet.totalFrames) *
          this.spriteSheet.curerentFrame,

        0,

        frameWidth,
        frameHeight,

        this.posX,
        this.posY,

        frameWidth * scale,
        frameHeight * scale
      );
    }
  }
}
