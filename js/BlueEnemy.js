class BlueEnemy extends Enemy{
	constructor(posX, posY){
		var lifePoints = 5;
		var pointValue = 250;
		var enemyName = "Blue";
		super(posX, posY, lifePoints, pointValue, enemyName);
	}
}