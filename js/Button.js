class Button{
	constructor(posX,posY,scale,text,price){
		this.posX = posX;
		this.posY = posY;

		this.scale = scale;
		this.width = 5 * scale;
		this.height = 1 * scale;

		this.price = price;
		this.priceMultiplier = 1.1; // Multiplier of 10%  
		this.canBeBought = false;
		this.text = text;
	}

	update(dt){
		if(m_GameScore >= this.price){
			this.canBeBought = true;
		}
		else{
			this.canBeBought = false;
		}
	}

	buttonPressed(){
		if(this.canBeBought){
			this.canBeBought = false;
			m_GameScore -= this.price;
			this.price = parseInt(this.price * this.priceMultiplier);
			// Apply the effect
		}
	}

	render(){
		if(this.canBeBought){
			ctx.fillStyle = "Yellow";
		}
		else{
			ctx.fillStyle = "Gray";
		}
		ctx.fillRect(
			this.posX,
			this.posY,
			this.width,
			this.height);

		ctx.fillStyle = "black";
		ctx.font = "30px, Arial";
		ctx.fillText(
			this.text,
			this.posX + 30,
			this.posY + 30,
			this.width);

		ctx.fillText(
			"price: " + this.price + " points",
			this.posX + 30,
			this.posY + 60,
			this.width);
	}


}

