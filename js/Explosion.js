class Explosion {

  constructor(posX, posY) {
    // Positions
    this.posX = posX;
    this.posY = posY;

    // Spritesheet stuff
    // Image that will get rendered on each frame
    this.image = null;
    // This variable will control the speed in which the animation works
    this.currentFrequency = 0;
    // Var to control when we explode
    this.explosionReady = false;
    // If true we play the animation;
    this.doRender = false;

    //we create a promise with the image we need
    var spritesheetPath = "media/Explosion.png";
    const promise = this.loadImage(spritesheetPath);
    // wait for the promise to be completed
    this.promiseExplosionReady = Promise.all([promise]).then(() => {
      this.scale = 5;
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
        height: this.image.height * this.scale // Changed

      }
      this.explosionReady = true;
    });

  }

  loadImage(src) {
    const image = new Image();
    image.src = src;
    return new Promise((resolve) => {
      image.onload = () => {
        this.image = image;
        resolve();
      }
    });

  }

  reset() {

  }

  start() {

  }

  update(dt) {

  }

  DoRenderOnce(enemyCenterX, enemyCenterY) {
    if (this.explosionReady && !this.doRender) {
      this.doRender = true;
      this.posX = enemyCenterX - this.spriteSheet.width / 2;
      this.posY = enemyCenterY - this.spriteSheet.height / 2;
    }
  }

  render() {
    if (this.explosionReady && this.doRender) {
      m_ExplosionSound.play();
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
      }
      else {
        this.currentFrequency++;
      }

      ctx.drawImage(
        // Spritesheet image
        this.spriteSheet.img,
        // Source X in the spritesheet // changed
        this.spriteSheet.img.width / this.spriteSheet.totalFrames * this.spriteSheet.curerentFrame,
        // Source Y
        0,
        // Source width and height (original frame dimensions) changed
        this.spriteSheet.img.width / this.spriteSheet.totalFrames,
        this.spriteSheet.img.height,
        // Destination X and Y
        this.posX,
        this.posY,
        // Destination width and height (scaled dimensions)
        this.spriteSheet.width,
        this.spriteSheet.height
      );

    }
  }
}