class CoinMinigame {
  constructor(duration) {
    this.duration = duration;
    this.coins = [];
    this.coinsClicked = 0;
    this.isActive = false;
    this.timer = 0;
    this.image = null;
    this.imageReady = false;

    this.holdTimer = 0;
    this.holdDuration = duration * 1000;

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
    this.coins = [];
    this.timer = 0;
    this.holdTimer = Date.now();

    this.spawnCoin();
  }

  spawnCoin() {
    if (!this.isActive) return;

    const sideLength = canvas.height / 3;
    const minX = (canvas.width - sideLength) / 2;
    const minY = 0;
    const posX = minX + Math.random() * sideLength;
    const posY = minY + Math.random() * sideLength;

    this.coins.push({ posX, posY });

    setTimeout(() => this.spawnCoin(), 1000);
  }

  update(dt) {
    if (!this.isActive) return;

    if (Date.now() - this.holdTimer >= this.holdDuration) {
      this.end();
    }
  }

  render() {
    if (!this.isActive || !this.imageReady) return;

    this.coins.forEach((coin) => {
      ctx.drawImage(this.image, coin.posX, coin.posY);
    });
  }

  click(x, y) {
    if (!this.isActive) return;

    this.coins = this.coins.filter((coin) => {
      if (
        x > coin.posX &&
        x < coin.posX + this.image.width &&
        y > coin.posY &&
        y < coin.posY + this.image.height
      ) {
        this.coinsClicked++;

        return false;
      }
      return true;
    });
  }

  end() {
    console.log("CoinMinigame ended");
    this.isActive = false;

    const reward = this.coinsClicked * 100;
    m_CurrencyManager.AddCurrencyAmount(1, reward);
    console.log(
      `Minigame ended. Coins clicked: ${this.coinsClicked}, Reward: ${reward} no chill tokens`
    );

    this.coins = [];
    this.coinsClicked = 0;
    this.holdTimer = 0;
  }
}
