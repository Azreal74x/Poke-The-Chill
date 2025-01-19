var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = "absolute";
document.body.appendChild(canvas);

var bgImage = new Image();
bgImage.src = "media/background.png";
var bgImageReady = false;
bgImage.onload = function () {
  bgImageReady = true;
};

var keysDown = {};

addEventListener(
  "keydown",
  function (e) {
    keysDown[e.keyCode] = true;
  },
  false
);

addEventListener(
  "keyup",
  function (e) {
    delete keysDown[e.keyCode];
  },
  false
);

canvas.addEventListener(
  "click",
  function (event) {
    var rect = canvas.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;

    if (m_Shop.isVisible) {
      m_Shop.click(mouseX, mouseY);
      return; // Prevent other clicks when the shop is open
    }

    if (m_Settings.isVisible) {
      m_Settings.click(mouseX, mouseY);
      return; // Prevent other clicks when the settings tab is open
    }

    if (m_Info.isVisible) {
      m_Info.click(mouseX, mouseY);
      return; // Prevent other clicks when the info tab is open
    }

    if (m_Monetization.isVisible) {
      m_Monetization.click(mouseX, mouseY);
      return; // Prevent other clicks when the monetization tab is open
    }

    if (m_CoinMinigame.isActive) {
      m_CoinMinigame.click(mouseX, mouseY);
      return; // Prevent other clicks when the minigame is active
    }

    if (m_Wheel.isVisible) {
      return; // Prevent other clicks when the wheel is open
    }

    Click(mouseX, mouseY);
    m_CoinMinigame.click(mouseX, mouseY);
  },
  false
);

function Click(clickX, clickY) {
  CheckClickOnEnemies(clickX, clickY);
  CheckClickOnThisButton(clickX, clickY, m_BtnClickUpdate);
  CheckClickOnThisButton(clickX, clickY, m_BtnScoreUpdate);
  if (!isAutoClickActive) {
    CheckClickOnThisButton(clickX, clickY, m_BtnAutoClickUnlock);
  } else {
    CheckClickOnThisButton(clickX, clickY, m_BtnAutoClickDmgUpgrade);
  }
  CheckClickOnThisButton(clickX, clickY, m_BtnRarityUpdate);
  if (!m_Power2.isActive) {
    CheckClickOnThisButton(clickX, clickY, m_Power1);
  }
  if (!m_Power1.isActive) {
    CheckClickOnThisButton(clickX, clickY, m_Power2);
  }
  CheckClickOnThisButton(clickX, clickY, m_BtnShop);
  CheckClickOnThisButton(clickX, clickY, m_BtnMonetization);
  CheckClickOnThisButton(clickX, clickY, m_BtnInfo);
  CheckClickOnThisButton(clickX, clickY, m_BtnSettings);
}

function CheckClickOnThisButton(clickX, clickY, thisButton) {
  if (
    clickX > thisButton.posX &&
    clickX < thisButton.posX + thisButton.width &&
    clickY > thisButton.posY &&
    clickY < thisButton.posY + thisButton.height
  ) {
    if (thisButton === m_BtnShop) {
      m_Shop.show();
    }
    if (thisButton === m_BtnMonetization) {
      m_Monetization.show();
    }
    if (thisButton === m_BtnInfo) {
      m_Info.show();
    }
    if (thisButton === m_BtnSettings) {
      m_Settings.show();
    }
    if (thisButton.buttonPressed()) {
      console.log(`${thisButton.text} button clicked`);
      if (thisButton === m_BtnClickUpdate) {
        damageScore = parseFloat(
          (damageScore + damageScoreMultiplier).toFixed(2)
        );
      } else if (thisButton === m_BtnScoreUpdate) {
        scoreMultiplier = parseFloat(
          (scoreMultiplier + scoreMultUpgrade).toFixed(2)
        );
      } else if (thisButton === m_BtnAutoClickUnlock) {
        isAutoClickActive = true;
        m_BtnAutoClickUnlock.remove();
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
      } else if (thisButton === m_BtnAutoClickDmgUpgrade) {
        autoClickDamage = parseFloat(
          (autoClickDamage + autoClickDamageMult).toFixed(2)
        );
      } else if (thisButton === m_BtnRarityUpdate) {
        if (m_TierLevel < m_maxTierLevel) {
          m_TierLevel++;
          if (m_TierLevel === m_maxTierLevel) {
            m_BtnRarityUpdate.disable();
          }
        }
      }
    }
    //thisButton.buttonPressed();
  }
}

function CheckClickOnEnemies(clickX, clickY) {
  if (
    clickX > m_CurrentEnemy.posX &&
    clickX < m_CurrentEnemy.posX + m_CurrentEnemy.currentSpriteSheet.width &&
    clickY > m_CurrentEnemy.posY &&
    clickY < m_CurrentEnemy.posY + m_CurrentEnemy.currentSpriteSheet.height
  ) {
    DoDamageToEnemies(damageScore);
  }
}

function PayoutReward() {
  //Checks if the defeated enemy is one of the special characters
  var currencyReward = m_CurrentEnemy.GetCurrencyReward();

  if (currencyReward === 0) {
    m_Wheel.DoRenderOnce();
  } else if (currencyReward === 2) {
    // F grade token
    m_EnemyRewardSound.play();
    m_CurrencyManager.AddCurrencyAmount(
      currencyReward,
      m_CurrentEnemy.GetReward()
    );
  } else if (currencyReward === 3) {
    // Moni token
    m_EnemyRewardSound.play();
    m_CurrencyManager.AddCurrencyAmount(
      currencyReward,
      m_CurrentEnemy.GetReward()
    );
  } else {
    m_EnemyRewardSound.play();
    m_CurrencyManager.AddCurrencyAmount(
      currencyReward,
      m_CurrentEnemy.GetReward() * scoreMultiplier
    );
  }
  if (
    Math.random() < 1 / 10 &&
    !m_Wheel.isActive &&
    !m_Power1.isActive &&
    !m_Power2.isActive
  ) {
    m_CoinMinigame.start();
  }
}

function DoDamageToEnemies(damageScore) {
  if (!m_CurrentEnemy.enemyIsDead) {
    m_CurrentEnemy.GetDamage(damageScore);

    const randomClickSound = getRandomEnemyClickSound();
    randomClickSound.currentTime = 0;
    randomClickSound.play();

    const randomDamageSound = getRandomDamageReceivedSound();
    randomDamageSound.currentTime = 0;
    randomDamageSound.play();

    if (m_CurrentEnemy.lifePoints <= 0) {
      PayoutReward();

      setTimeout(SpawnNewEnemies, 2000);
    }
  }
}

var enemySpawner = new EnemySpawner();

function SpawnNewEnemies() {
  m_CurrentEnemy = enemySpawner.spawnEnemy();
}

var reset = function () {};

var start = function () {};

var update = function (dt) {
  enemySpawner.update(dt);

  if (
    !(
      m_Shop.isVisible ||
      m_Monetization.isVisible ||
      m_Info.isVisible ||
      m_CoinMinigame.isActive ||
      m_Wheel.isVisible ||
      m_Settings.isVisible
    )
  ) {
    if (isAutoClickActive) {
      m_BtnAutoClickDmgUpgrade.update();
      AutoClick(dt);
    } else {
      m_BtnAutoClickUnlock.update();
    }
  }

  m_BtnRarityUpdate.update();
  m_BtnClickUpdate.update();
  m_BtnScoreUpdate.update();
  m_CoinMinigame.update(dt);
  m_Power1.update(dt);
  m_Power2.update(dt);
  m_BtnShop.update();
  m_BtnMonetization.update();
  m_BtnInfo.update();
  m_BtnSettings.update();
  m_Coin.update();
};

function AutoClick(dt) {
  if (m_CurrentTimeBetweenAutoClicks > m_TimeBetweenAutoClicks) {
    m_CurrentTimeBetweenAutoClicks = 0;
    if (!m_CurrentEnemy.enemyIsDead) {
      m_DamageReceivedSound5.play();
      DoDamageToEnemies(autoClickDamage);
    }
  } else {
    m_CurrentTimeBetweenAutoClicks += dt;
  }
}

var render = function () {
  if (bgImageReady) {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  }

  // Draw beige background on 1/4th of the canvas on the left side
  ctx.fillStyle = "rgba(245, 245, 220, 0.5)"; // Slight beige color with some transparency
  ctx.fillRect(
    (canvas.width * 61) / 80,
    (canvas.height * 1) / 10,
    (canvas.width * 19) / 80,
    (canvas.height * 7.2) / 10
  );

  enemySpawner.render();
  m_Coin.render();
  m_Explosion.render();
  m_Wheel.render(ctx);
  m_BtnClickUpdate.render();
  m_BtnScoreUpdate.render();
  if (isAutoClickActive) {
    m_BtnAutoClickDmgUpgrade.render();
  } else {
    m_BtnAutoClickUnlock.render();
  }

  m_BtnRarityUpdate.render();

  m_Power1.render();
  m_Power2.render();

  m_BtnShop.render();
  m_BtnMonetization.render();
  m_BtnInfo.render();
  m_BtnSettings.render();

  m_CurrencyManager.render();

  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 12;
  ctx.font = "5rem DiloWorld";
  ctx.textAlign = "right";
  ctx.strokeText(
    "Poke The Chill!",
    (canvas.width * 79) / 80,
    canvas.height / 15
  );
  ctx.fillText("Poke The Chill!", (canvas.width * 79) / 80, canvas.height / 15);

  m_Shop.render();
  m_Monetization.render();
  m_Info.render();
  m_Settings.render();

  m_CoinMinigame.render();

  // Finally, we render the UI, an score for example
  ctx.font = "1.5rem DiloWorld";
};

var main = function () {
  var now = Date.now();
  var delta = now - then;

  update(delta / 1000);
  render();

  then = now;

  requestAnimationFrame(main);
};

var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

async function initGame() {
  SpawnNewEnemies();

  await m_Coin.coinReady;
  await m_Explosion;

  then = Date.now();
  start();

  main();
}

var then = 0;

var m_TierLevel = 0;
var m_maxTierLevel = 5;

var damageScore = 1;
var damageScoreMultiplier = 0.1;

//After upgrading each enemy will give 1.1 more score
var scoreMultiplier = 1;
var scoreMultUpgrade = 0.1;

//Check if auto click is active
var isAutoClickActive = false;

//Auto click damage score
var autoClickDamage = 1;
var autoClickDamageMult = 0.1;

// We initialize the GameObjects and variables
var m_CurrentEnemy = null;
var m_Coin = new Coin(canvas.width / 2, canvas.height / 2);
var m_Explosion = new Explosion(canvas.width / 2, canvas.height / 2);
// Initialize the wheel
const m_Wheel = new Wheel(canvas.width / 2, canvas.height / 2);

var m_TimeBetweenAutoClicks = 5;
var m_CurrentTimeBetweenAutoClicks = 0;

var m_CoinMinigame = new CoinMinigame(10); // 10 seconds minigame

var m_WheelDoneSpinning = true;

const font = new FontFace("DiloWorld", "url('media/DiloWorld.ttf')");

font
  .load()
  .then(() => {
    document.fonts.add(font);
    console.log("Font loaded and available.");
  })
  .catch((error) => {
    console.error("Failed to load font:", error);
  });

function getRandomDamageReceivedSound() {
  // Array of damage received sounds
  const damageSounds = [
    m_DamageReceivedSound,
    m_DamageReceivedSound2,
    m_DamageReceivedSound3,
    m_DamageReceivedSound4,
  ];

  // Return a random sound from the array
  return damageSounds[Math.floor(Math.random() * damageSounds.length)];
}

function getRandomEnemyClickSound() {
  // Array of damage received sounds
  const clickSounds = [
    m_EnemyClickSound,
    m_EnemyClickSound2,
    m_EnemyClickSound3,
  ];

  // Return a random sound from the array
  return clickSounds[Math.floor(Math.random() * clickSounds.length)];
}

// Declare the global variable
var m_BackgroundMusic;

var m_ExplosionSound;

var m_EnemyClickSound;
var m_EnemyClickSound2;
var m_EnemyClickSound3;

var m_ButtonClickSound;
var m_WheelFinishedSound;

var m_DamageReceivedSound;
var m_DamageReceivedSound2;
var m_DamageReceivedSound3;
var m_DamageReceivedSound4;
var m_DamageReceivedSound5;

var m_SingleCoinSound;
var m_CoinMinigameRewardSound;
var m_WheelRewardSound;
var m_EnemyRewardSound;

var m_BoostMusic;

// Add event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // Get the audio elements after DOM is fully loaded
  m_BackgroundMusic = document.getElementById("BackgroundMusic");
  m_ExplosionSound = document.getElementById("ExplosionSound");

  m_EnemyClickSound = document.getElementById("EnemyClickSound");
  m_EnemyClickSound2 = document.getElementById("EnemyClickSound2");
  m_EnemyClickSound3 = document.getElementById("EnemyClickSound3");

  m_ButtonClickSound = document.getElementById("ButtonClickSound");
  m_WheelFinishedSound = document.getElementById("WheelFinishedSound");

  m_DamageReceivedSound = document.getElementById("DamageReceivedSound");
  m_DamageReceivedSound2 = document.getElementById("DamageReceivedSound2");
  m_DamageReceivedSound3 = document.getElementById("DamageReceivedSound3");
  m_DamageReceivedSound4 = document.getElementById("DamageReceivedSound4");
  m_DamageReceivedSound5 = document.getElementById("DamageReceivedSound5");

  m_SingleCoinSound = document.getElementById("SingleCoinSound");
  m_CoinMinigameRewardSound = document.getElementById(
    "CoinMinigameRewardSound"
  );
  m_WheelRewardSound = document.getElementById("WheelRewardSound");
  m_EnemyRewardSound = document.getElementById("EnemyRewardSound");

  m_BoostMusic = document.getElementById("BoostMusic");

  if (m_BackgroundMusic) {
    m_BackgroundMusic.loop = true;

    document.body.addEventListener("click", function playMusicOnce() {
      if (m_BackgroundMusic.paused) {
        m_BackgroundMusic.play().catch((error) => {
          console.error("Failed to play music:", error);
        });
      }
      // Remove the event listener after the first click
      document.body.removeEventListener("click", playMusicOnce);
    });
  }
});

var m_BtnClickUpdate = new Button(
  (canvas.width * 31) / 40,
  (canvas.height * 12) / 100,
  75,
  "Click Damage",
  50,
  "media/NoChillToken.png",
  true,
  true
);
var m_BtnScoreUpdate = new Button(
  (canvas.width * 31) / 40,
  (canvas.height * 24) / 100,
  75,
  "No Chill Reward",
  50,
  "media/NoChillToken.png",
  true,
  true
);
var m_BtnAutoClickUnlock = new Button(
  (canvas.width * 31) / 40,
  (canvas.height * 36) / 100,
  75,
  "Unlock Auto Click",
  50,
  "media/NoChillToken.png",
  true,
  false
);
var m_BtnAutoClickDmgUpgrade = null;
var m_BtnRarityUpdate = new Button(
  (canvas.width * 31) / 40,
  (canvas.height * 48) / 100,
  75,
  "Tier Up",
  300,
  "media/NoChillToken.png",
  true,
  true,
  [2000, 10000, 50000, 100000, "Maxed"]
);
var m_CurrencyManager = new CurrencyManager(
  (canvas.width * 1) / 100,
  (canvas.height * 19) / 30 + 80,
  0,
  0,
  0,
  10
);
var m_Power1 = new Power(
  (canvas.width * 31) / 40,
  (canvas.height * 60) / 100,
  (16 * canvas.width) / 800,
  "Balkan Anger",
  100
);
var m_Power2 = new Power(
  (canvas.width * 31) / 40,
  (canvas.height * 72) / 100,
  (16 * canvas.width) / 800,
  "Communist Gain",
  200
);
var m_BtnShop = new Button(
  (canvas.width * 1) / 100,
  (canvas.height * 34) / 100,
  (20 * canvas.width) / 800,
  "Shop",
  0,
  "media/buttons/SkinShop.png",
  false
);
m_BtnShop.width = m_BtnShop.height;

var m_BtnMonetization = new Button(
  (canvas.width * 1) / 100,
  (canvas.height * 23) / 100,
  (20 * canvas.width) / 800,
  "Monetization",
  0,
  "media/buttons/CoinShop.png",
  false
);
m_BtnMonetization.width = m_BtnMonetization.height;

var m_BtnInfo = new Button(
  (canvas.width * 1) / 100,
  (canvas.height * 1) / 100,
  (20 * canvas.width) / 800,
  "Info",
  0,
  "media/buttons/InfoButton.png",
  false
);
m_BtnInfo.width = m_BtnInfo.height;

var m_BtnSettings = new Button(
  (canvas.width * 1) / 100,
  (canvas.height * 12) / 100,
  (20 * canvas.width) / 800,
  "Settings",
  0,
  "media/buttons/Settings.png",
  false
);
m_BtnSettings.width = m_BtnSettings.height;

function updateButtonPositions() {
  m_BtnClickUpdate.posX = (canvas.width * 31) / 40;
  m_BtnClickUpdate.posY = (canvas.height * 12) / 100;

  m_BtnScoreUpdate.posX = (canvas.width * 31) / 40;
  m_BtnScoreUpdate.posY = (canvas.height * 24) / 100;

  if (isAutoClickActive) {
    m_BtnAutoClickDmgUpgrade.posX = (canvas.width * 31) / 40;
    m_BtnAutoClickDmgUpgrade.posY = (canvas.height * 36) / 100;
  } else {
    m_BtnAutoClickUnlock.posX = (canvas.width * 31) / 40;
    m_BtnAutoClickUnlock.posY = (canvas.height * 36) / 100;
  }

  m_BtnRarityUpdate.posX = (canvas.width * 31) / 40;
  m_BtnRarityUpdate.posY = (canvas.height * 48) / 100;

  m_Power1.posX = (canvas.width * 31) / 40;
  m_Power1.posY = (canvas.height * 60) / 100;

  m_Power2.posX = (canvas.width * 31) / 40;
  m_Power2.posY = (canvas.height * 72) / 100;

  m_BtnShop.posX = (canvas.width * 1) / 100;
  m_BtnShop.posY = (canvas.height * 34) / 100;

  m_BtnMonetization.posX = (canvas.width * 1) / 100;
  m_BtnMonetization.posY = (canvas.height * 23) / 100;

  m_BtnSettings.posX = (canvas.width * 1) / 100;
  m_BtnSettings.posY = (canvas.height * 12) / 100;

  m_BtnInfo.posX = (canvas.width * 1) / 100;
  m_BtnInfo.posY = (canvas.height * 1) / 100;
}

  // Call updateButtonPositions initially and on window resize
  updateButtonPositions();
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    updateButtonPositions();
  });

  initGame();
