class RedEnemy extends Enemy{
	constructor(posX, posY){
		var lifePoints = 10;
		var reward = 500;
		var enemyName = "Red";
		super(posX, posY, lifePoints, reward, enemyName);
	}
}