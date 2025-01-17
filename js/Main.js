// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = "absolute";
document.body.appendChild(canvas);

// We set the background
var bgPattern;
var tileReady = false;
var tileImage = new Image();
tileImage.onload = function () {
  tileReady = true;
  bgPattern = ctx.createPattern(tileImage, "repeat");
};
tileImage.src = "media/bgPattern.png";

// Handle keyboard controls
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
    //console.log("Mouse click at:", mouseX, mouseY);

    if (m_Shop.isVisible) {
      m_Shop.click(mouseX, mouseY);
      return; // Prevent other clicks when the shop is open
    }
    // Call our click function
    Click(mouseX, mouseY);
    m_CoinMinigame.click(mouseX, mouseY);
  },
  false
);

function Click(clickX, clickY) {
  //console.log("clickeeed");
  CheckClickOnEnemies(clickX, clickY);
  CheckClickOnThisButton(clickX, clickY, m_BtnClickUpdate);
  CheckClickOnThisButton(clickX, clickY, m_BtnScoreUpdate);
  if (!isAutoClickActive) {
    CheckClickOnThisButton(clickX, clickY, m_BtnAutoClickUnlock);
  } else {
    CheckClickOnThisButton(clickX, clickY, m_BtnAutoClickDmgUpgrade);
  }
  CheckClickOnThisButton(clickX, clickY, m_BtnRarityUpdate);
  CheckClickOnThisButton(clickX, clickY, m_Power1);
  CheckClickOnThisButton(clickX, clickY, m_Power2);
  CheckClickOnThisButton(clickX, clickY, m_BtnShop);
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

    if (thisButton.buttonPressed()) {
      console.log(`${thisButton.text} button clicked`);
      if (thisButton === m_BtnClickUpdate) {
        damageScore += damageScoreMultiplier;
      } else if (thisButton === m_BtnScoreUpdate) {
        scoreMultiplier += scoreMultUpgrade;
      } else if (thisButton === m_BtnAutoClickUnlock) {
        isAutoClickActive = true;
        m_BtnAutoClickUnlock.remove();
        m_BtnAutoClickDmgUpgrade = new Button(
          canvas.width - 75 * 5 - 50,
          300,
          75,
          "Auto Click Damage",
          50
        );
      } else if (thisButton === m_BtnAutoClickDmgUpgrade) {
        autoClickDamage += autoClickDamageMult;
      } else if (thisButton === m_BtnRarityUpdate) {
        if (m_TierLevel < m_maxTierLevel) {
          m_TierLevel++;
        } else {
          m_BtnRarityUpdate.remove();
        }
      }
    }
    //console.log(`${thisButton.text} button clicked`);
    thisButton.buttonPressed();
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

    m_EnemyClickSound.play();

  }
}

function PayoutReward() {
  //check if its the special character for wheel game
  var currencyReward = m_CurrentEnemy.GetCurrencyReward();

  if (currencyReward === 0) {
    m_Wheel.DoRenderOnce();
  } else {
    m_EnemyRewardSound.play();
    m_CurrencyManager.AddCurrencyAmount(
      m_CurrentEnemy.GetCurrencyReward(),
      m_CurrentEnemy.GetReward() * scoreMultiplier
    );
  }
}

function DoDamageToEnemies(damageScore) {
  if (!m_CurrentEnemy.enemyIsDead) {
    m_CurrentEnemy.GetDamage(damageScore);
    if (m_CurrentEnemy.lifePoints <= 0) {
      // We increase the score
      PayoutReward();

      if (m_WheelDoneSpinning) {
        // We spawn a new enemy
        setTimeout(SpawnNewEnemies, 2000);
      }
      else {
        setTimeout(SpawnNewEnemies, 8000);
      }

    }
  }
}

var enemySpawner = new EnemySpawner();

function SpawnNewEnemies() {
  m_CurrentEnemy = enemySpawner.spawnEnemy();
}

// Reset the game when needed
var reset = function () { };

// Start function, initialize everything you need here
var start = function () {
  // setInterval(functionX, 10000);
};

// Actual gameplay, call all functions needed to make you game work
// Game's logic
var update = function (dt) {
  if (isAutoClickActive) {
    m_BtnAutoClickDmgUpgrade.update();
    AutoClick(dt);
  } else {
    m_BtnAutoClickUnlock.update();
  }
  if (m_TierLevel < m_maxTierLevel) {
    m_BtnRarityUpdate.update();
  }
  m_BtnClickUpdate.update();
  m_BtnScoreUpdate.update();
  m_CoinMinigame.update(dt);

  // Update power buttons
  m_Power1.update(dt);
  m_Power2.update(dt);
  m_BtnShop.update();
};

function AutoClick(dt) {
  if (m_CurrentTimeBetweenAutoClicks > m_TimeBetweenAutoClicks) {
    m_CurrentTimeBetweenAutoClicks = 0;
    if (!m_CurrentEnemy.enemyIsDead) {
      m_DamageReceivedSound.play();
      DoDamageToEnemies(autoClickDamage);
    }
  } else {
    m_CurrentTimeBetweenAutoClicks += dt;
  }
}

// Draw everything
var render = function () {
  // Render background first
  if (tileReady) {
    ctx.fillStyle = bgPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Render everything else from back to front
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

  if (m_TierLevel < m_maxTierLevel) {
    m_BtnRarityUpdate.render();
  }

  m_CoinMinigame.render();

  m_CurrencyManager.render();

  // Render power buttons
  m_Power1.render();
  m_Power2.render();

  m_BtnShop.render();

  m_Shop.render();

  // Finally, we render the UI, an score for example
  ctx.font = "30px DiloWorld";
};

// The main game loop
var main = function () {
  var now = Date.now();
  var delta = now - then;

  update(delta / 1000);
  render();

  then = now;

  // Request to do this again ASAP
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

async function initGame() {
  // Wait for all images to be ready
  //await m_Paddle.allImagesLoadedPromise;
  SpawnNewEnemies();

  // We wait for the explosion to finish loading
  await m_Coin.coinReady;
  await m_Explosion;

  // Let's play this game!
  then = Date.now();
  start();

  main();

}

var m_TierLevel = 0;
var m_maxTierLevel = 1;

// We initialize the initial time of the game
var then = 0;

//After upgrading each click will give 0.1 click more
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

var m_CoinMinigame = new CoinMinigame(10); // 30 seconds minigame

var m_WheelDoneSpinning = true;

const font = new FontFace("DiloWorld", "url('media/DiloWorld.ttf')");

font.load().then(() => {
  document.fonts.add(font);
  console.log("Font loaded and available.");
}).catch((error) => {
  console.error("Failed to load font:", error);
});

// Declare the global variable
var m_BackgroundMusic;

var m_ExplosionSound;
var m_EnemyClickSound;
var m_ButtonClickSound;
var m_WheelFinishedSound;
var m_DamageReceivedSound;

var m_SingleCoinSound;
var m_CoinMinigameRewardSound;
var m_WheelRewardSound;
var m_EnemyRewardSound;

var m_BoostMusic;


// Add event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // Get the audio elements after DOM is fully loaded
  m_BackgroundMusic = document.getElementById("BackgroundMusic");
  m_ExplosionSound = document.getElementById("ExplosionSound"); // Assign value to global variable
  m_EnemyClickSound = document.getElementById("EnemyClickSound"); // Assign value to global variable
  m_ButtonClickSound = document.getElementById("ButtonClickSound");
  m_WheelFinishedSound = document.getElementById("WheelFinishedSound");
  m_DamageReceivedSound = document.getElementById("DamageReceivedSound");

  m_SingleCoinSound = document.getElementById("SingleCoinSound");
  m_CoinMinigameRewardSound = document.getElementById("CoinMinigameRewardSound");
  m_WheelRewardSound = document.getElementById("WheelRewardSound");
  m_EnemyRewardSound = document.getElementById("EnemyRewardSound");

  m_BoostMusic = document.getElementById("BoostMusic");

  if (m_BackgroundMusic) {
    m_BackgroundMusic.loop = true; // Ensure the music loops

    document.body.addEventListener(
      "click",
      function playMusicOnce() {
        if (m_BackgroundMusic.paused) {
          m_BackgroundMusic.play().catch((error) => {
            console.error("Failed to play music:", error);
          });
        }
        // Remove the event listener after the first click
        document.body.removeEventListener("click", playMusicOnce);
      }
    );
  }

});

var m_BtnClickUpdate = new Button(
  canvas.width - 75 * 5 - 50,
  100,
  75,
  "Upgrade click mult.",
  50
);
var m_BtnScoreUpdate = new Button(
  canvas.width - 75 * 5 - 50,
  200,
  75,
  "Upgrade score mult",
  50
);
var m_BtnAutoClickUnlock = new Button(
  canvas.width - 75 * 5 - 50,
  300,
  75,
  "Unlock Auto Click",
  50
);
var m_BtnAutoClickDmgUpgrade = null;
var m_BtnRarityUpdate = new Button(
  canvas.width - 75 * 5 - 50,
  400,
  75,
  "Rarity Update",
  50
);

var m_CurrencyManager = new CurrencyManager(10, 200, 0, 0, 0, 10);

var m_Power1 = new Power(
  canvas.width - 75 * 5 - 50,
  500,
  50,
  "Balkan Anger (Double Damage)",
  100
);
var m_Power2 = new Power(
  canvas.width - 75 * 5 - 50,
  650,
  50,
  "Communist Gain (Double Tokens)",
  200
);

var m_BtnShop = new Button(10, 10, 75, "Shop", 0);
m_BtnShop.width = m_BtnShop.height;

initGame();
