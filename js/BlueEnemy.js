class BlueEnemy extends Enemy{
	constructor(posX, posY){
		var lifePoints = 5;
		var reward = 250;
		var enemyName = "Blue";
		super(posX, posY, lifePoints, reward, enemyName);
	}
}