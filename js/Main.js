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
tileImage.src = "images/bgPattern.png";

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
}

function CheckClickOnThisButton(clickX, clickY, thisButton) {
  if (
    clickX > thisButton.posX &&
    clickX < thisButton.posX + thisButton.width &&
    clickY > thisButton.posY &&
    clickY < thisButton.posY + thisButton.height
  ) {
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
  }
}

function PayoutReward() {
  //check if its the special character for wheel game
  if (m_CurrentEnemy.GetCurrencyReward === 0) {
    m_Wheel.DoRenderOnce();
  } else{
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

      // We spawn a new enemy
      setTimeout(SpawnNewEnemies, 2000);
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
  m_CoinMinigame.update();
};

function AutoClick(dt) {
  if (m_CurrentTimeBetweenAutoClicks > m_TimeBetweenAutoClicks) {
    m_CurrentTimeBetweenAutoClicks = 0;
    DoDamageToEnemies(autoClickDamage);
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

  // Finally, we render the UI, an score for example
  ctx.font = "30px Arial";
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
var m_maxTierLevel = 1

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

initGame();
