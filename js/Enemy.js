class Enemy {
  constructor(posX, posY, lifePoints, reward, currencyReward, enemyName) {
    this.posX = posX;
    this.posY = posY;

    this.lifePoints = lifePoints;
    this.reward = reward;
    this.currencyReward = currencyReward;
    this.enemyName = enemyName;

    this.image = null;
    this.images = [];
    this.currentFrequency = 0;
    this.currentSpriteSheet = null;
    this.beingDamaged = false;
    this.enemyReady = false;
    this.enemyIsDead = false;

    //we create a promise with each image we need
    // format of src = images/'enemyName' + "Enemy" + 'type'.png;

    var idleSpritesheetPath = "media/spriteSheets/" + enemyName + "Enemy.png";
    var damagedSpritesheetPath =
      "media/spriteSheets/" + enemyName + "EnemyDamaged.png";

    const promise1 = this.loadImage(idleSpritesheetPath, 0);
    const promise2 = this.loadImage(damagedSpritesheetPath, 1);

    this.promiseEnemyReady = Promise.all([promise1, promise2]).then(() => {
      // Set the scale to resize the sprite
      this.scale = 0.55 * (canvas.width / 2000); // Adjust the scale value (e.g., 0.5 for half size)

      // Use scaled dimensions for the sprite
      this.width = this.image.width; // Original width of the image
      this.height = this.image.height; // Original height of the image

      // Correct frame width and height calculations
      this.idleSpriteSheet = {
        img: this.images[0],
        frequency: 5,
        curerentFrame: -1,
        totalFrames: Math.floor(this.images[0].width / this.images[0].height), // Total frames (horizontal frames)
        x: 0,
        y: 0,
        width:
          (this.images[0].width /
            Math.floor(this.images[0].width / this.images[0].height)) *
          this.scale, // Correct frame width scaled
        height: this.images[0].height * this.scale, // Correct frame height scaled
      };

      this.damageSpriteSheet = {
        img: this.images[1],
        frequency: 5,
        curerentFrame: -1,
        totalFrames: Math.floor(this.images[1].width / this.images[1].height), // Total frames (horizontal frames)
        x: 0,
        y: 0,
        width:
          (this.images[1].width /
            Math.floor(this.images[1].width / this.images[1].height)) *
          this.scale, // Correct frame width scaled
        height: this.images[1].height * this.scale, // Correct frame height scaled
      };

      this.enemyReady = true;
    });
  }

  loadImage(src, index) {
    const image = new Image();
    image.src = src;
    return new Promise((resolve) => {
      image.onload = () => {
        //on "images" i insert each one of the images of the spritesheets(image)
        this.images.splice(index, 0, image);
        if (index == 0) {
          //if the index was set to 0, it means it is the "initial" image
          this.image = image;
        }
        resolve();
      };
    });
  }

  reset() {}

  start() {}

  update(dt) {
    if (!this.enemyReady) {
      return; // Skip update if the enemy is not ready
    }
    //console.log("we are updating");
    if (
      this.currentSpriteSheet == this.idleSpriteSheet &&
      m_BoostMusic &&
      !m_BoostMusic.paused
    ) {
      //console.log("AYO TURN IT UP");
      this.idleSpriteSheet.frequency = 1;
    } else {
      this.idleSpriteSheet.frequency = 10;
    }
  }

  GetReward() {
    return this.reward;
  }

  GetCurrencyReward() {
    return this.currencyReward;
  }

  GetDamage(damageScore) {
    console.log(
      this.enemyName + " enemy was hit with " + damageScore + " damage."
    );
    if (this.lifePoints > 0 && !this.beingDamaged) {
      this.lifePoints -= damageScore;
      this.beingDamaged = true;
      if (this.lifePoints <= 0) {
        this.enemyIsDead = true;
      }
    }
  }

  render() {
    if (this.enemyReady) {
      //we set the idle spritesheet as the default one
      var whichSpriteSheet = this.idleSpriteSheet;
      //unless it is being damaged, then we change the spritesheet
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
          // If by the end of the damage animation, the lifepoints are also 0, then, the enemy is no longer "ready"
          if (this.lifePoints <= 0) {
            this.enemyReady = false;
            m_Explosion.DoRenderOnce(
              this.posX + this.currentSpriteSheet.width / 2,
              this.posY + this.currentSpriteSheet.height / 2
            );

            let coinType;
            if (this.enemyName === "Sergio" || this.enemyName === "Enrique") {
              coinType = "fGrade";
            } else if (this.enemyName === "Moni") {
              coinType = "moni";
            } else {
              coinType = "noChill";
            }

            m_Coin = new Coin(
              this.posX + this.currentSpriteSheet.width / 2,
              this.posY + this.currentSpriteSheet.height / 2,
              coinType
            );
            if (this.enemyName != "Show") {
              m_Coin.DoRenderOnce(
                this.posX + this.currentSpriteSheet.width / 2,
                this.posY + this.currentSpriteSheet.height / 2
              );
            }
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
