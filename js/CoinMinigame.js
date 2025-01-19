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

    // Load the image
    this.loadImage("media/NoChillToken.png").then(() => {
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
    m_BackgroundMusic.pause();
    m_BoostMusic.play();
    this.isActive = true;
    this.coinsClicked = 0;
    this.coins = [];
    this.timer = 0;
    this.holdTimer = Date.now();

    this.spawnCoin();
  }

  spawnCoin() {
    if (!this.isActive) return;

    const widthFraction = 2 / 6;
    const heightFraction = 8 / 10;
    const sideWidth = canvas.width * widthFraction - 150;
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
      ctx.drawImage(
        this.image,
        coin.posX,
        coin.posY,
        (this.image.width * 1.5 * canvas.width) / 2000,
        (this.image.height * 1.5 * canvas.width) / 2000
      );
    });
  }

  click(x, y) {
    if (!this.isActive) return;

    const scaledWidth = (this.image.width * 1.5 * canvas.width) / 2000;
    const scaledHeight = (this.image.height * 1.5 * canvas.width) / 2000;

    this.coins = this.coins.filter((coin) => {
      if (
        x > coin.posX &&
        x < coin.posX + scaledWidth &&
        y > coin.posY &&
        y < coin.posY + scaledHeight
      ) {
        this.coinsClicked++;
        m_SingleCoinSound.currentTime = 0; //remove if u dont want the sound to be cut off
        m_SingleCoinSound.play();
        return false;
      }
      return true;
    });
  }

  end() {
    this.isActive = false;
    m_BackgroundMusic.play();
    m_CoinMinigameRewardSound.play();
    const latestEnemyReward = m_CurrentEnemy.GetReward();
    let reward = 0;
    if (m_CurrentEnemy.enemyName === "Show") {
      reward = this.coinsClicked * scoreMultiplier * 100;
    } else {
      reward = this.coinsClicked * (latestEnemyReward / 4) * scoreMultiplier;
    }
    m_CurrencyManager.AddCurrencyAmount(1, reward);

    if (this.coinsClicked === 10) {
      console.log(
        `Coin minigame ended. Coins clicked: ALL OF THEM!, Reward: ${reward} no chill tokens.`
      );
    } else {
      console.log(
        `Coin minigame ended. Coins clicked: ${this.coinsClicked}, Reward: ${reward} no chill tokens.`
      );
    }

    this.coins = [];
    this.coinsClicked = 0;
    this.holdTimer = 0;
  }
}
