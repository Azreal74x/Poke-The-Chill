class EnemyTypes extends Enemy {
  //default, moni, enrique, sergio, showguy, football, oldguy, nerd
  static lifePoints = [[5], [15, 20, 20], [25, 30, 35], [40, 45, 50], [55, 60]];
  static rewards = [[50], [100, 80, 0], [100, 120, 80], [250, 300, 350], [500, 600]];
  //1 for noChill, 2 for fGrade, 3 for moni token and 0 for wheel game
  static currencyRewards = [[1], [3, 2, 0], [1, 1, 2], [1, 1, 1], [1, 1]];
  static enemyNames = [["Default"],
  ["Moni", "Enrique", "Show"],
  ["Football", "Old", "Sergio"],
  ["Nerd", "Fan", "Buff"],
  ["Rat", "Emo", "Kebab"],
  ["Pikachu", "Shooter"]];

  constructor(posX, posY, enemyName, tierLevel) {
    // Put the life points, rewards and enemy names in order to match it properly.

    var tierEnemies = EnemyTypes.enemyNames[tierLevel];
    var index = tierEnemies.indexOf(enemyName);
    if (index === -1) {
      throw new Error("Invalid enemy name!");
    }

    super(
      posX,
      posY,
      EnemyTypes.lifePoints[tierLevel][index],
      EnemyTypes.rewards[tierLevel][index],
      EnemyTypes.currencyRewards[tierLevel][index],
      enemyName
    );
  }
}
