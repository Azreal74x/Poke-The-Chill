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

    const widthFraction = 1 / 2;
    const heightFraction = 8 / 10;
    const sideWidth = canvas.width * widthFraction;
    const sideHeight = canvas.height * heightFraction;
    const minX = (canvas.width - sideWidth) / 2;
    const minY = (canvas.height - sideHeight) / 10;
    let posX, posY;
    let isOverlapping;

    do {
      posX = minX + Math.random() * sideWidth;
      posY = minY + Math.random() * sideHeight;
      isOverlapping = this.coins.some(
        (coin) =>
          Math.abs(coin.posX - posX) < this.image.width &&
          Math.abs(coin.posY - posY) < this.image.height
      );
    } while (isOverlapping);

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

    const latestEnemyReward = m_CurrentEnemy.GetReward();
    const reward =
      this.coinsClicked * (latestEnemyReward / 4) * scoreMultiplier;
    m_CurrencyManager.AddCurrencyAmount(1, reward);
    console.log(
      `Minigame ended. Coins clicked: ${this.coinsClicked}, Reward: ${reward} no chill tokens.`
    );

    this.coins = [];
    this.coinsClicked = 0;
    this.holdTimer = 0;
  }
}
