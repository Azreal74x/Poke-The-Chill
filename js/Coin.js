class Coin {
  constructor(posX, posY, type) {
    this.posX = posX;
    this.posY = posY;
    this.type = type;

    this.image = null;

    this.currentFrequency = 0;

    this.coinReady = false;

    this.doRender = false;

    this.targetX = 0;
    this.targetY = canvas.height - (canvas.height * 2) / 8;
    this.speed = 15;

    let spritesheetPath;
    if (type === "noChill") {
      spritesheetPath = "media/NoChillCoinSheet.png";
    } else if (type === "fGrade") {
      spritesheetPath = "media/FGradeCoinSheet.png";
    } else if (type === "moni") {
      spritesheetPath = "media/MoniCoinSheet.png";
    } else {
      spritesheetPath = "media/NoChillCoinSheet.png";
    }

    const promise = this.loadImage(spritesheetPath);

    this.promiseCoinReady = Promise.all([promise]).then(() => {
      this.scale = 2 * (canvas.width / 1000);
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

  update() {
    const dx = this.targetX - this.posX;
    const dy = this.targetY - this.posY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > this.speed) {
      this.posX += (dx / distance) * this.speed;
      this.posY += (dy / distance) * this.speed;
    } else {
      this.posX = this.targetX;
      this.posY = this.targetY;
    }
  }

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
      const scale = 2 * (canvas.width / 2000);

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
