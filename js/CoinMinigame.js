class CoinMinigame {
  constructor(duration) {
    this.duration = duration; // Duration of the minigame in seconds
    this.coins = [];
    this.coinsClicked = 0;
    this.isActive = false;
    this.timer = 0;
    this.image = null;
    this.imageReady = false;

    this.holdTimer = 0; //time to hold final position before disappearing
    this.holdDuration = duration * 1000; //hold time takes milliseconds so we convert

    // Load the image
    this.loadImage("images/minigame.png").then(() => {
      this.imageReady = true;
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

  start() {
    console.log("CoinMinigame started");
    this.isActive = true;
    this.coinsClicked = 0;
    this.coins = []; // Reset coins array
    this.timer = 0; // Reset timer
    this.holdTimer = Date.now(); // Reset hold timer

    // Spawn the first coin
    this.spawnCoin();
  }

  spawnCoin() {
    if (!this.isActive) return;
    //console.log("Spawning coin");

    const sideLength = canvas.height / 3;
    const minX = (canvas.width - sideLength) / 2;
    const minY = 0;
    const posX = minX + Math.random() * sideLength;
    const posY = minY + Math.random() * sideLength;

    this.coins.push({ posX, posY });
    //console.log("Coin spawned at:", posX, posY);

    // Spawn a new coin every second
    setTimeout(() => this.spawnCoin(), 1000);
  }

  update(dt) {

    if (this.isActive) {
      //console.log("coin minigame is active");
    }
    else {
      //console.log("coin minigame is disabled");
    }

    if (!this.isActive) return;
/*    this.timer -= dt;
    if (this.timer <= 0) {
      console.log("time has passed, end called");
      this.end();
    }*/


    //check if hold time has passed before stopping
    if (Date.now() - this.holdTimer >= this.holdDuration) {
      this.end();
    }
  }

  render() {
    if (!this.isActive || !this.imageReady) return;

    console.log("Rendering coins:", this.coins.length); // Log number of coins
    this.coins.forEach((coin) => {
      ctx.drawImage(this.image, coin.posX, coin.posY);
    });
  }

  click(x, y) {
    if (!this.isActive) return;
    //console.log("Click detected at:", x, y);
    this.coins = this.coins.filter((coin) => {
      if (
        x > coin.posX &&
        x < coin.posX + this.image.width &&
        y > coin.posY &&
        y < coin.posY + this.image.height
      ) {
        this.coinsClicked++;
        //console.log("Coin clicked at:", coin.posX, coin.posY);
        return false;
      }
      return true;
    });
  }

  end() {
    console.log("CoinMinigame ended");
    this.isActive = false;

    const reward = this.coinsClicked * 100; // Reward 100 currency per coin clicked
    m_CurrencyManager.AddCurrencyAmount(1, reward);
    console.log(
      `Minigame ended. Coins clicked: ${this.coinsClicked}, Reward: ${reward} no chill tokens`
    );

    this.coins = []; // Clear coins array
    this.coinsClicked = 0; // Reset coin clicks
    this.holdTimer = 0; // Reset the hold timer
  }
}
