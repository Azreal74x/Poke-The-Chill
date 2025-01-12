class EnemySpawner {
  constructor() {
    this.enemies = [];
  }

  spawnEnemy() {
    var enemyNames = [
      ["Default"],
      ["Moni", "Teacher", "ShowGuy"]
    ];

    //First gets a random number between 0 and m_TierLevel.
    //Then gets another random number between 0 and length of that tier.
    //All enemy spawn rates are the same
    const randomTier = Math.floor(Math.random() * (m_TierLevel + 1));
    const tierEnemies = enemyNames[randomTier];
    const randomEnemyIndex = Math.floor(Math.random() * tierEnemies.length);
    const enemyName = tierEnemies[randomEnemyIndex];
    const enemy = new EnemyTypes(
        canvas.width / 2,
        canvas.height / 2,
        enemyName,
        randomTier
    );
    this.enemies.push(enemy);
    return enemy;
  }

  update(dt) {
    this.enemies = this.enemies.filter((enemy) => {
      if (enemy.enemyIsDead) {
        this.lastDefeatedEnemy = enemy;
        return false;
      }
      return true;
    });
    this.enemies.forEach((enemy) => enemy.update(dt));

    if (this.lastDefeatedEnemy) {
      const radius =
        Math.min(this.lastDefeatedEnemy.width, this.lastDefeatedEnemy.height) *
        0.25;
      const angle = Math.random() * 2 * Math.PI;
      const offsetX = radius * Math.cos(angle);
      const offsetY = radius * Math.sin(angle);

      let coinPosX, coinPosY;
      if (Math.random() < 0.5) {
        coinPosX = this.lastDefeatedEnemy.posX + offsetX;
        coinPosY = this.lastDefeatedEnemy.posY + offsetY;
      } else {
        coinPosX = this.lastDefeatedEnemy.posX - offsetX;
        coinPosY = this.lastDefeatedEnemy.posY - offsetY;
      }

      // Ensure the coin doesn't spawn outside the screen
      coinPosX = Math.max(0, Math.min(canvas.width - m_Coin.width, coinPosX));
      coinPosY = Math.max(0, Math.min(canvas.height - m_Coin.height, coinPosY));

      m_Coin.DoRenderOnce(coinPosX, coinPosY);
      this.lastDefeatedEnemy = null;
    }
  }

  render() {
    this.enemies.forEach((enemy) => enemy.render());
  }
}
