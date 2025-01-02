class Enemy {
  constructor(posX, posY, lifePoints, pointValue, enemyName) {
    //positions
    this.posX = posX;
    this.posY = posY;

    this.lifePoints = lifePoints;
    this.pointValue = pointValue;
    this.enemyName = enemyName;

    //spritesheet
    //image thatg render on each frame
    this.image = null;
    // an array containing all images that the gameobject will use
    this.images = [];
    //this variable will control the speed in which the animation works
    this.currentFrequency = 0;
    //this var will con tain the spritesheets that is currently being player
    this.currentSpriteSheet = null;
    //when this is true we will play the damaged sprintsheed once
    this.beingDamaged = false;
    //var to control that everything within the enemy
    this.enemyReady = false;
    // Control boolean
    this.enemyIsDead = false;

    //we create a promise with each image we need
    // format of src = images/'enemyName' + "Enemy" + 'type'.png;

    var idleSpritesheetPath = "images/" + enemyName + "Enemy.png";
    var damagedSpritesheetPath = "images/" + enemyName + "EnemyDamaged.png";

    const promise1 = this.loadImage(idleSpritesheetPath, 0);
    const promise2 = this.loadImage(damagedSpritesheetPath, 1);

    // wait for the promises to be completed
    this.promiseEnemyReady = Promise.all([promise1, promise2]).then(() => {
      this.scale = 1;
      this.width = this.image.width;
      this.height = this.image.height;

      this.idleSpriteSheet = {
        img: this.images[0],
        frequency: 5,
        curerentFrame: -1,
        totalFrames: this.images[0].width / this.images[0].height,
        x: 0,
        y: 0, //---------------------totalFrames-----------//
        width: this.images[0].height * this.scale, // Each frame is a square, so width = height * scale
        height: this.images[0].height * this.scale, // Changed
      };

      this.damageSpriteSheet = {
        img: this.images[1],
        frequency: 5,
        curerentFrame: -1,
        totalFrames: this.images[1].width / this.images[1].height,
        x: 0,
        y: 0, //---------------------totalFrames-----------//
        width: this.images[1].height * this.scale, // Each frame is a square, so width = height * scale
        height: this.images[1].height * this.scale, // Changed
      };

      this.enemyReady = true;
    });
  }

  loadImage(src, index) {
    const image = new Image();
    image.src = src;
    return new Promise((resolve) => {
      image.onload = () => {
        //on "images" i insert the each one of thne images of the spritesheets(image)
        this.images.splice(index, 0, image);
        if (index == 0) {
          //if the index was set to 0, it means is the "initial" image
          this.image = image;
        }
        resolve();
      };
    });
  }

  reset() {}

  start() {}

  update(dt) {}

  GetDamage() {
    if (this.lifePoints > 0 && !this.beingDamaged) {
      this.lifePoints--;
      this.beingDamaged = true;
      if (this.lifePoints == 0) {
        this.enemyIsDead = true;
      }
    }
  }

  render() {
    if (this.enemyReady) {
      //we set the idle spritesheet as the default one
      var whichSpriteSheet = this.idleSpriteSheet;
      //unless it is being damaged, then we changge the spritesheet
      if (this.beingDamaged) {
        whichSpriteSheet = this.damageSpriteSheet;
      }
      //we assign the decided spritesheet to the main variable
      this.currentSpriteSheet = whichSpriteSheet;

      // If the current is bigger, we change the frame
      if (this.currentFrequency > this.currentSpriteSheet.frequency) {
        this.currentFrequency = 0;
        // We set the new frame
        this.currentSpriteSheet.curerentFrame++;
        // If we surpass the amount of frames
        if (
          this.currentSpriteSheet.curerentFrame >=
          this.currentSpriteSheet.totalFrames
        ) {
          this.currentSpriteSheet.curerentFrame = 0;
          if (this.beingDamaged) {
            this.beingDamaged = false;
          }
          // If by the end of the damage animation, the lifepoints are
          // ALSO 0, then, the enemy is no longer "ready"
          if (this.lifePoints == 0) {
            this.enemyReady = false;
            m_Explosion.DoRenderOnce(
              this.posX + this.currentSpriteSheet.width / 2,
              this.posY + this.currentSpriteSheet.height / 2
            );
          }
        }
      } else {
        this.currentFrequency++;
      }

      ctx.drawImage(
        // Which spritesheet to render
        this.currentSpriteSheet.img,
        // Start point in x
        (this.currentSpriteSheet.img.width /
          this.currentSpriteSheet.totalFrames) *
          this.currentSpriteSheet.curerentFrame,
        // Start point in y
        0,
        // Final X coordinates relative to the origin
        this.currentSpriteSheet.img.width / this.currentSpriteSheet.totalFrames,
        // Final X coordinates relative to the origin
        this.currentSpriteSheet.img.height,
        // Now where we draw it
        this.posX,
        this.posY,
        this.currentSpriteSheet.width,
        this.currentSpriteSheet.height
      );
    }
  }
}
