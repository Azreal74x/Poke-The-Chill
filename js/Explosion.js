class Explosion {
  constructor(posX, posY) {
    this.posX = posX;
    this.posY = posY;

    this.image = null;
    this.currentFrequency = 0;
    this.explosionReady = false;
    this.doRender = false;

    var spritesheetPath = "media/Explosion.png";
    const promise = this.loadImage(spritesheetPath);

    this.promiseExplosionReady = Promise.all([promise]).then(() => {
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
      };
    });
  }

  reset() {}

  start() {}

  update(dt) {}

  DoRenderOnce(enemyCenterX, enemyCenterY) {
    if (this.explosionReady && !this.doRender) {
      this.doRender = true;
      this.posX = enemyCenterX - this.spriteSheet.width / 2;
      this.posY = enemyCenterY - this.spriteSheet.height / 2;
    }
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

      ctx.drawImage(
        this.spriteSheet.img,
        (this.spriteSheet.img.width / this.spriteSheet.totalFrames) *
          this.spriteSheet.curerentFrame,
        0,
        this.spriteSheet.img.width / this.spriteSheet.totalFrames,
        this.spriteSheet.img.height,
        this.posX,
        this.posY,
        this.spriteSheet.width,
        this.spriteSheet.height
      );
    }
  }
}
