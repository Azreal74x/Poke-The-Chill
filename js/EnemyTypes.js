class EnemyTypes extends Enemy {
  constructor(posX, posY, enemyName) {
    var lifePoints = [3, 5, 8, 10];
    var pointValue = [250, 500, 750, 1000];
    var enemyNames = ["Blue", "Green", "Red", "Yellow"];
    var index = enemyNames.indexOf(enemyName);
    if (index === -1) {
      throw new Error("Invalid enemy name");
    }
    console.log("Enemy index:", index);
    super(posX, posY, lifePoints[index], pointValue[index], enemyName);
    console.log(
      "Enemy created with lifePoints:",
      lifePoints[index],
      "and pointValue:",
      pointValue[index]
    );
  }
}
