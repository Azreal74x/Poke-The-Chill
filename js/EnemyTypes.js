class EnemyTypes extends Enemy {
    static lifePoints = [
        [3],
        [5, 8, 10]
    ];
    static rewards = [
        [250],
        [100, 500, 0]
    ];
    //1 for noChill, 2 for fGrade, 3 for moni token and 0 for wheel game
    static currencyRewards = [
        [0],
        [3, 2, 0]
    ]
    static enemyNames = [
        ["Default"],
        ["Moni", "Teacher", "ShowGuy"]
    ];

  constructor(posX, posY, enemyName, tierLevel) {
    // Put the life points, rewards and enemy names in order to match it properly.

    var tierEnemies = EnemyTypes.enemyNames[tierLevel];
    var index = tierEnemies.indexOf(enemyName);
    if (index === -1) {
      throw new Error("Invalid enemy name");
    }
    //console.log("Enemy index:", index);
    super(posX, posY, EnemyTypes.lifePoints[tierLevel][index], EnemyTypes.rewards[tierLevel][index], EnemyTypes.currencyRewards[tierLevel][index], enemyName);
    /*console.log(
      "Enemy created with lifePoints:",
        EnemyTypes.lifePoints[tierLevel][index],
      "and rewards:",
        EnemyTypes.rewards[tierLevel][index]
    );*/
  }
}
