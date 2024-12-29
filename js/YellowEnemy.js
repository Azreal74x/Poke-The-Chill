class YellowEnemy extends Enemy{
	constructor(posX, posY){
		var lifePoints = 25;
		var pointValue = 1000;
		var enemyName = "Yellow";
		super(posX, posY, lifePoints, pointValue, enemyName);
	}
}