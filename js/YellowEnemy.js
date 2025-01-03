class YellowEnemy extends Enemy{
	constructor(posX, posY){
		var lifePoints = 25;
		var reward = 1000;
		var enemyName = "Yellow";
		super(posX, posY, lifePoints, reward, enemyName);
	}
}