class EnemyTypes extends Enemy {
  constructor(posX, posY, enemyName, tierLevel) {
    // Put the life points, rewards and enemy names in order to match it properly.
    var lifePoints = [
        [3],
        [5, 8, 10]
    ];
    var rewards = [
        [250],
        [100, 500, 0]
    ];
    var enemyNames = [
        ["Default"],
        ["Moni", "Teacher", "ShowGuy"]
    ];
    var tierEnemies = enemyNames[tierLevel];
    var index = tierEnemies.indexOf(enemyName);
    if (index === -1) {
      throw new Error("Invalid enemy name");
    }
    //console.log("Enemy index:", index);
    super(posX, posY, lifePoints[tierLevel][index], rewards[tierLevel][index], enemyName);
    /*console.log(
      "Enemy created with lifePoints:",
        lifePoints[tierLevel][index],
      "and rewards:",
        rewards[tierLevel][index]
    );*/
  }
}
