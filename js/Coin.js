class Coin {
  constructor(posX, posY, type) {
    // Positions
    this.posX = posX;
    this.posY = posY;
    this.type = type;

    // Spritesheet stuff
    // Image that will get rendered on each frame
    this.image = null;
    // This variable will control the speed in which the animation works
    this.currentFrequency = 0;
    // Var to control when we explode
    this.coinReady = false;
    // If true we play the animation;
    this.doRender = false;

    //we create a promise with the image we need
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
    // wait for the promise to be completed
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
        width: this.image.height * this.scale, // Each frame is a square, so width = height * scale
        height: this.image.height * this.scale, // Changed
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
    //start hold timer
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
      // If the current is bigger, we change the frame
      if (this.currentFrequency > this.spriteSheet.frequency) {
        this.currentFrequency = 0;
        // We set the new frame
        this.spriteSheet.curerentFrame++;
        // If we surpass the amount of frames
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
      const scale = 1.5; // Scale factor to make the coin 1.5 times bigger

      ctx.drawImage(
        // Spritesheet image
        this.spriteSheet.img,
        // Source X in the spritesheet // changed
        (this.spriteSheet.img.width / this.spriteSheet.totalFrames) *
          this.spriteSheet.curerentFrame,
        // Source Y
        0,
        // Source width and height (original frame dimensions)
        frameWidth,
        frameHeight,
        // Destination X and Y
        this.posX,
        this.posY,
        // Destination width and height (scaled dimensions)
        frameWidth * scale,
        frameHeight * scale
      );
    }
  }
}
