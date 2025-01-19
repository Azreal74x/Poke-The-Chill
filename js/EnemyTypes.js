class EnemyTypes extends Enemy {
  static enemyNames = [
    ["Default"],
    ["Moni", "Enrique", "Show"],
    ["Football", "Old", "Sergio"],
    ["Nerd", "Fan", "Buff"],
    ["Rat", "Emo", "Kebab"],
    ["Pikachu", "Cute", "Shooter"],
  ];

  static lifePoints = [
    [3], // Approx damage 1
    [8, 10, 10], // Approx damage 2
    [20, 30, 10], // Approx damage 3 with buff 4.5
    [50, 55, 60], // Approx damage 5 with buff 7.5
    [75, 83, 91], // Approx damage 6 with buff 8
    [100, 125, 150],
  ];

  static rewards = [
    [100], // Approx multiplier 1
    [150, 250, 0], // Approx multiplier 1.5
    [400, 600, 250], // Approx multiplier 3 with buff 4.5
    [1000, 1500, 2000], // Approx multiplier 5 with buff 7.5
    [3000, 3500, 4000], // Approx multiplier 6 with buff 8
    [10000, 20000, 30000],
  ];

  //1 for noChill, 2 for fGrade, 3 for moni token and 0 for wheel game
  static currencyRewards = [
    [1],
    [3, 2, 0],
    [1, 1, 2],
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ];

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
