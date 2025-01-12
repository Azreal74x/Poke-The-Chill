class Wheel {
  constructor(posX, posY) {
    // Positions
    this.posX = posX;
    this.posY = posY;

    // Spritesheet stuff
    // Image that will get rendered on each frame
    this.image = null;
    // Var to control when we turn
    this.turnReady = false;
    // If true we play the animation;
    this.doRender = false;
    // Rotation angle
    this.rotationAngle = 0;
    // Total rotation amount
    this.totalRotation = 0;
    // Target rotation amount
    this.targetRotation = 0;

    //we create a promise with the image we need
    var spritesheetPath = "images/Wheel.png";
    const promise = this.loadImage(spritesheetPath);
    // wait for the promise to be completed
    this.promiseTurnReady = Promise.all([promise]).then(() => {
      this.scale = 1; // Adjusted scale to fit the screen
      this.width = this.image.width / 10; // 10 pieces
      this.height = this.image.height;

      // Calculate the size of the square
      const squareSize = window.innerHeight;

      this.spriteSheet = {
        img: this.image,
        totalFrames: 10, // 10 pieces
        width: squareSize, // Each frame is a piece, so width = square size
        height: squareSize, // Changed to square size
      };
      this.turnReady = true;
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

  DoRenderOnce() {
    if (this.turnReady && !this.doRender) {
      this.doRender = true;
      this.posX = (window.innerWidth - this.spriteSheet.width) / 2;
      this.posY = (window.innerHeight - this.spriteSheet.height) / 2;
      // Set a random target rotation between 20 and 30 parts (each part is 1/10th of a full rotation)
      this.targetRotation =
        (Math.floor(Math.random() * 11) + 20) * ((2 * Math.PI) / 10);
      this.totalRotation = 0;
    }
  }

  render() {
    if (this.turnReady && this.doRender) {
      // Increase rotation angle
      const rotationStep = Math.PI / 15; // Rotate by 1 degree
      this.rotationAngle += rotationStep;
      this.totalRotation += rotationStep;

      // Save the current context
      ctx.save();

      // Move to the center of the wheel
      ctx.translate(
        this.posX + this.spriteSheet.width / 2,
        this.posY + this.spriteSheet.height / 2
      );

      // Rotate the context
      ctx.rotate(this.rotationAngle);

      // Draw the wheel
      ctx.drawImage(
        // Spritesheet image
        this.spriteSheet.img,
        // Source X in the spritesheet
        0,
        // Source Y
        0,
        // Source width and height (original frame dimensions)
        this.spriteSheet.img.width,
        this.spriteSheet.img.height,
        // Destination X and Y (adjusted for rotation)
        -this.spriteSheet.width / 2,
        -this.spriteSheet.height / 2,
        // Destination width and height (scaled dimensions)
        this.spriteSheet.width,
        this.spriteSheet.height
      );

      // Restore the context to its original state
      ctx.restore();

      // Stop rendering after reaching the target rotation
      if (this.totalRotation >= this.targetRotation) {
        this.rotationAngle = 0;
        this.doRender = false;
        this.determineReward(); // Determine reward based on final position
      }
    }
  }

  determineReward() {
    // Calculate the final angle
    const finalAngle = this.totalRotation % (2 * Math.PI);
    // Determine the segment (each segment is 36 degrees or PI/5 radians)
    const segment = Math.floor(finalAngle / (Math.PI / 5));
    // Calculate the reward based on the segment and multiply by 100
    const reward = (segment + 1) * 1000; // Rewards are 1000, 2000, ..., 10000
    m_CurrencyManager.AddCurrencyAmount("noChill", reward);
    console.log(`Wheel reward: ${reward} no chill tokens`);
    m_CoinMinigame.start();
  }
}
