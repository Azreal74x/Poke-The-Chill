class EnemySpawner {
  constructor() {
    this.enemies = [];
  }

  spawnEnemy() {
    const random = Math.random();
    let enemyName;

    if (random < 0.5) {
      enemyName = "Default";
    } else if (random < 0.25) {
      enemyName = "Moni";
    } else if (random < 0.3) {
      enemyName = "Teacher";
    } else {
      enemyName = "ShowGuy";
    }

    const enemy = new EnemyTypes(
      canvas.width / 2,
      canvas.height / 2,
      enemyName
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
