class Settings {
  constructor() {
    this.isVisible = false;
    this.soundVolume = 0.5;
  }

  show() {
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
  }

  render() {
    if (!this.isVisible) return;

    ctx.save();

    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    const buttonSize = canvas.width / 40;
    const buttonX = (canvas.width * 78) / 80;
    const buttonY = (canvas.height * 1) / 160;
    ctx.fillRect(buttonX, buttonY, buttonSize, buttonSize);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.fillStyle = "white";
    ctx.font = `${canvas.height / 40}px DiloWorld`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeText("X", buttonX + buttonSize / 2, buttonY + buttonSize / 2);
    ctx.fillText("X", buttonX + buttonSize / 2, buttonY + buttonSize / 2);

    const saveButtonWidth = canvas.width / 5;
    const saveButtonHeight = canvas.height / 10;
    const saveButtonX = canvas.width / 2 - saveButtonWidth / 2;
    const saveButtonY = canvas.height / 2.5 - saveButtonHeight * 1.5;

    const loadButtonX = canvas.width / 2 - saveButtonWidth / 2;
    const loadButtonY = canvas.height / 2.5 + saveButtonHeight * 0.5;

    ctx.fillStyle = "#384454";
    ctx.beginPath();
    ctx.roundRect(
      saveButtonX,
      saveButtonY,
      saveButtonWidth,
      saveButtonHeight,
      10
    );
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(
      loadButtonX,
      loadButtonY,
      saveButtonWidth,
      saveButtonHeight,
      10
    );
    ctx.fill();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 8;
    ctx.fillStyle = "white";
    ctx.font = `${canvas.height / 20}px DiloWorld`;
    ctx.strokeText(
      "Save Game",
      saveButtonX + saveButtonWidth / 2,
      saveButtonY + saveButtonHeight / 2
    );
    ctx.fillText(
      "Save Game",
      saveButtonX + saveButtonWidth / 2,
      saveButtonY + saveButtonHeight / 2
    );
    ctx.strokeText(
      "Load Game",
      loadButtonX + saveButtonWidth / 2,
      loadButtonY + saveButtonHeight / 2
    );
    ctx.fillText(
      "Load Game",
      loadButtonX + saveButtonWidth / 2,
      loadButtonY + saveButtonHeight / 2
    );

    const sliderX = canvas.width / 2 - saveButtonWidth / 2;
    const sliderY = canvas.height / 2.5 + saveButtonHeight * 3;
    const sliderWidth = saveButtonWidth;
    const sliderHeight = canvas.height / 40;

    ctx.fillStyle = "gray";
    ctx.beginPath();
    ctx.roundRect(sliderX, sliderY, sliderWidth, sliderHeight, 10);
    ctx.fill();

    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.roundRect(
      sliderX,
      sliderY,
      sliderWidth * this.soundVolume,
      sliderHeight,
      10
    );
    ctx.fill();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 7;
    ctx.fillStyle = "white";
    ctx.font = `${canvas.height / 40}px DiloWorld`;
    ctx.strokeText(
      "Background Sound Volume",
      sliderX + sliderWidth / 2,
      sliderY - sliderHeight
    );
    ctx.fillText(
      "Background Sound Volume",
      sliderX + sliderWidth / 2,
      sliderY - sliderHeight
    );

    // Render + and - buttons
    const smallButtonWidth = sliderHeight;
    const smallButtonHeight = sliderHeight;

    ctx.fillStyle = "#384454";
    ctx.beginPath();
    ctx.roundRect(
      sliderX - smallButtonWidth * 1.5,
      sliderY,
      smallButtonWidth,
      smallButtonHeight,
      10
    );
    ctx.fill();

    ctx.fillStyle = "#384454";
    ctx.beginPath();
    ctx.roundRect(
      sliderX + sliderWidth + smallButtonWidth * 0.5,
      sliderY,
      smallButtonWidth,
      smallButtonHeight,
      10
    );
    ctx.fill();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.fillStyle = "white";
    ctx.font = `${canvas.height / 60}px DiloWorld`;
    ctx.strokeText("-", sliderX - smallButtonWidth, sliderY + sliderHeight / 2);
    ctx.strokeText(
      "+",
      sliderX + sliderWidth + smallButtonWidth,
      sliderY + sliderHeight / 2
    );
    ctx.fillText("-", sliderX - smallButtonWidth, sliderY + sliderHeight / 2);
    ctx.fillText(
      "+",
      sliderX + sliderWidth + smallButtonWidth,
      sliderY + sliderHeight / 2
    );

    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.fillStyle = "white";
    ctx.font = `${canvas.height / 40}px DiloWorld`;
    ctx.textAlign = "center";
    ctx.strokeText(
      "A game made by Burak, Emily, Simona and Ferhat!",
      canvas.width / 2,
      (canvas.height * 29) / 30
    );
    ctx.fillText(
      "A game made by Burak, Emily, Simona and Ferhat!",
      canvas.width / 2,
      (canvas.height * 29) / 30
    );

    ctx.strokeStyle = "black";
    ctx.lineWidth = 15;
    ctx.fillStyle = "white";
    ctx.font = `${canvas.height / 10}px DiloWorld`;
    ctx.textAlign = "center";
    ctx.strokeText("Poke The Chill!", canvas.width / 2, canvas.height / 10);
    ctx.fillText("Poke The Chill!", canvas.width / 2, canvas.height / 10);

    ctx.restore();
  }

  click(x, y) {
    if (!this.isVisible) return;

    if (
      x > (canvas.width * 78) / 80 &&
      x < (canvas.width * 78) / 80 + canvas.width / 40 &&
      y > (canvas.height * 1) / 160 &&
      y < (canvas.height * 1) / 160 + canvas.width / 40
    ) {
      this.hide();
    }

    const saveButtonWidth = canvas.width / 5;
    const saveButtonHeight = canvas.height / 10;
    const saveButtonX = canvas.width / 2 - saveButtonWidth / 2;
    const saveButtonY = canvas.height / 2.5 - saveButtonHeight * 1.5;

    const loadButtonX = canvas.width / 2 - saveButtonWidth / 2;
    const loadButtonY = canvas.height / 2.5 + saveButtonHeight * 0.5;

    if (
      x > saveButtonX &&
      x < saveButtonX + saveButtonWidth &&
      y > saveButtonY &&
      y < saveButtonY + saveButtonHeight
    ) {
      saveGame();
    }

    if (
      x > loadButtonX &&
      x < loadButtonX + saveButtonWidth &&
      y > loadButtonY &&
      y < loadButtonY + saveButtonHeight
    ) {
      loadGame();
    }

    const sliderX = canvas.width / 2 - saveButtonWidth / 2;
    const sliderY = canvas.height / 2.5 + saveButtonHeight * 3;
    const sliderWidth = saveButtonWidth;
    const sliderHeight = canvas.height / 40;

    if (
      x > sliderX &&
      x < sliderX + sliderWidth &&
      y > sliderY &&
      y < sliderY + sliderHeight
    ) {
      this.soundVolume = (x - sliderX) / sliderWidth;
      m_BackgroundMusic.volume = this.soundVolume;
    }

    const smallButtonWidth = sliderHeight;
    const smallButtonHeight = sliderHeight;

    if (
      x > sliderX - smallButtonWidth * 1.5 &&
      x < sliderX - smallButtonWidth * 0.5 &&
      y > sliderY &&
      y < sliderY + sliderHeight
    ) {
      this.soundVolume = Math.max(0, this.soundVolume - 0.1);
      m_BackgroundMusic.volume = this.soundVolume;
    }

    if (
      x > sliderX + sliderWidth + smallButtonWidth * 0.5 &&
      x < sliderX + sliderWidth + smallButtonWidth * 1.5 &&
      y > sliderY &&
      y < sliderY + sliderHeight
    ) {
      this.soundVolume = Math.min(1, this.soundVolume + 0.1);
      m_BackgroundMusic.volume = this.soundVolume;
    }
  }
}

const m_Settings = new Settings();

function saveGame() {
  const gameData = {
    m_TierLevel,
    damageScore,
    scoreMultiplier,
    isAutoClickActive,
    autoClickDamage,
    noChillAmount: m_CurrencyManager.getNoChillToken(),
    fGradeAmount: m_CurrencyManager.getFGradeToken(),
    moniAmount: m_CurrencyManager.getMoniToken(),
    m_BtnClickUpdatePrice: m_BtnClickUpdate.price,
    m_BtnScoreUpdatePrice: m_BtnScoreUpdate.price,
    m_BtnAutoClickUnlockPrice: m_BtnAutoClickUnlock.price,
    m_BtnAutoClickDmgUpgradePrice: m_BtnAutoClickDmgUpgrade
      ? m_BtnAutoClickDmgUpgrade.price
      : null,
    m_BtnRarityUpdatePrice: m_BtnRarityUpdate.price,
    m_BtnRarityUpdateIndex: m_BtnRarityUpdate.currentPriceIndex,
    m_Power1Price: m_Power1.price,
    m_Power2Price: m_Power2.price,
    shopItems: m_Shop.items.map((item) => ({
      name: item.name,
      price: item.price,
      bought: item.price === 0,
    })),
    soundVolume: m_Settings.soundVolume,
  };

  localStorage.setItem("gameData", JSON.stringify(gameData));
  alert("Game saved!");
}

function loadGame() {
  const gameData = JSON.parse(localStorage.getItem("gameData"));
  if (gameData) {
    m_TierLevel = gameData.m_TierLevel;
    damageScore = gameData.damageScore;
    scoreMultiplier = gameData.scoreMultiplier;
    isAutoClickActive = gameData.isAutoClickActive;
    autoClickDamage = gameData.autoClickDamage;
    m_CurrencyManager.noChillAmount = gameData.noChillAmount;
    m_CurrencyManager.fGradeAmount = gameData.fGradeAmount;
    m_CurrencyManager.moniAmount = gameData.moniAmount;
    m_BtnClickUpdate.price = gameData.m_BtnClickUpdatePrice;
    m_BtnScoreUpdate.price = gameData.m_BtnScoreUpdatePrice;
    m_BtnAutoClickUnlock.price = gameData.m_BtnAutoClickUnlockPrice;
    if (m_BtnAutoClickDmgUpgrade) {
      m_BtnAutoClickDmgUpgrade.price = gameData.m_BtnAutoClickDmgUpgradePrice;
    } else if (isAutoClickActive) {
      m_BtnAutoClickDmgUpgrade = new Button(
        (canvas.width * 31) / 40,
        (canvas.height * 36) / 100,
        75,
        "Auto Click Damage",
        gameData.m_BtnAutoClickDmgUpgradePrice,
        "media/NoChillToken.png",
        true,
        true
      );
    }
    m_BtnRarityUpdate.price = gameData.m_BtnRarityUpdatePrice;
    m_BtnRarityUpdate.currentPriceIndex = gameData.m_BtnRarityUpdateIndex;
    m_Power1.price = gameData.m_Power1Price;
    m_Power2.price = gameData.m_Power2Price;
    m_Shop.items.forEach((item) => {
      const savedItem = gameData.shopItems.find((i) => i.name === item.name);
      if (savedItem) {
        item.price = savedItem.price;
        if (savedItem.bought) {
          item.price = 0;
        }
      }
    });

    if (isAutoClickActive && !m_BtnAutoClickDmgUpgrade) {
      m_BtnAutoClickDmgUpgrade = new Button(
        (canvas.width * 31) / 40,
        (canvas.height * 36) / 100,
        75,
        "Auto Click Damage",
        50,
        "media/NoChillToken.png",
        true,
        true
      );
    }

    m_Settings.soundVolume = gameData.soundVolume || 0.5; // Load soundVolume, default to 0.5 if not found
    m_BackgroundMusic.volume = m_Settings.soundVolume; // Apply the loaded sound volume

    alert("Game loaded!");
  } else {
    alert("No saved game found!");
  }
}
