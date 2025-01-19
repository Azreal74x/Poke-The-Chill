class EnemySpawner {
  constructor() {
    this.enemies = [];
  }

  spawnEnemy() {
    //First gets a random number between 0 and m_TierLevel.
    //Then gets another random number between 0 and length of that tier.
    //All enemy spawn rates are the same
    const randomTier = Math.floor(Math.random() * (m_TierLevel + 1));
    const tierEnemies = EnemyTypes.enemyNames[randomTier];
    const randomEnemyIndex = Math.floor(Math.random() * tierEnemies.length);
    const enemyName = tierEnemies[randomEnemyIndex];
    const enemy = new EnemyTypes(
      canvas.width / 2 - canvas.width / 4.5,
      canvas.height / 2 - canvas.width / 5.5,
      enemyName,
      randomTier
    );
    this.enemies.push(enemy);
    return enemy;
  }

  update(dt) {
    /*this.enemies = this.enemies.filter((enemy) => {
      if (enemy.enemyIsDead) {
        this.lastDefeatedEnemy = enemy;
        return false;
      }
      return true;
    });*/

    this.enemies.forEach((enemy) => enemy.update(dt));

    if (this.lastDefeatedEnemy) {
      this.lastDefeatedEnemy = null;
    }
  }

  render() {
    this.enemies.forEach((enemy) => enemy.render());
  }
}
