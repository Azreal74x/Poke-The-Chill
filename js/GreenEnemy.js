class GreenEnemy extends Enemy{
	constructor(posX, posY){
		var lifePoints = 3;
		var reward = 100;
		var enemyName = "Green";
		super(posX, posY, lifePoints, reward, enemyName);
	}
}