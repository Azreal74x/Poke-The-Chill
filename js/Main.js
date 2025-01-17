var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = "absolute";
document.body.appendChild(canvas);

var bgImage = new Image();
bgImage.src = "images/background.png";
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

    if (m_Monetization.isVisible) {
      m_Monetization.click(mouseX, mouseY);
      return; // Prevent other clicks when the monetization tab is open
    }

    if (m_CoinMinigame.isActive) {
      m_CoinMinigame.click(mouseX, mouseY);
      return; // Prevent other clicks when the minigame is active
    }

    if (m_Wheel.isVisible) {
      return; // Prevent other clicks when the monetization tab is open
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
  CheckClickOnThisButton(clickX, clickY, m_Power1);
  CheckClickOnThisButton(clickX, clickY, m_Power2);
  CheckClickOnThisButton(clickX, clickY, m_BtnShop);
  CheckClickOnThisButton(clickX, clickY, m_BtnMonetization);
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
          canvas.width - 75 * 5 - 50,
          300,
          75,
          "Auto Click Damage",
          50,
          "images/NoChillToken.png",
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
  //Checks if the defeated enemy is one of the special characters
  var currencyReward = m_CurrentEnemy.GetCurrencyReward();

  if (currencyReward === 0) {
    m_Wheel.DoRenderOnce();
  } else if (currencyReward === 2) {
    // F grade token
    m_CurrencyManager.AddCurrencyAmount(
      currencyReward,
      m_CurrentEnemy.GetReward() * scoreMultiplier
    );
  } else if (currencyReward === 3) {
    // Moni token
    m_CurrencyManager.AddCurrencyAmount(
      currencyReward,
      m_CurrentEnemy.GetReward()
    );
  } else {
    m_CurrencyManager.AddCurrencyAmount(
      currencyReward,
      m_CurrentEnemy.GetReward() * scoreMultiplier
    );
  }
  if (Math.random() < 1 / 15) {
    m_CoinMinigame.start();
  }
}

function DoDamageToEnemies(damageScore) {
  if (!m_CurrentEnemy.enemyIsDead) {
    m_CurrentEnemy.GetDamage(damageScore);
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
  if (
    !(
      m_Shop.isVisible ||
      m_Monetization.isVisible ||
      m_CoinMinigame.isActive ||
      m_Wheel.isVisible
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
};

function AutoClick(dt) {
  if (m_CurrentTimeBetweenAutoClicks > m_TimeBetweenAutoClicks) {
    m_CurrentTimeBetweenAutoClicks = 0;
    DoDamageToEnemies(autoClickDamage);
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

  m_CoinMinigame.render();

  m_CurrencyManager.render();

  m_Power1.render();
  m_Power2.render();

  m_BtnShop.render();
  m_BtnMonetization.render();

  m_Shop.render();
  m_Monetization.render();

  ctx.font = "30px Arial";
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

// We initialize the GameObjects and variables
var m_CurrentEnemy = null;
var m_Coin = new Coin(canvas.width / 2, canvas.height / 2);
var m_Explosion = new Explosion(canvas.width / 2, canvas.height / 2);

// Initialize the wheel
const m_Wheel = new Wheel(canvas.width / 2, canvas.height / 2);

var m_TimeBetweenAutoClicks = 5;
var m_CurrentTimeBetweenAutoClicks = 0;

var m_TierLevel = 0;
var m_maxTierLevel = 1; // 5 yap sakın unutma!!! enemy sonrası

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

var m_CoinMinigame = new CoinMinigame(15); // 15 seconds minigame

var m_BtnClickUpdate = new Button(
  canvas.width - 75 * 5 - 50,
  100,
  75,
  "Click Multiplier",
  50,
  "images/NoChillToken.png",
  true,
  true
);
var m_BtnScoreUpdate = new Button(
  canvas.width - 75 * 5 - 50,
  200,
  75,
  "No Chill Multiplier",
  50,
  "images/NoChillToken.png",
  true,
  true
);
var m_BtnAutoClickUnlock = new Button(
  canvas.width - 75 * 5 - 50,
  300,
  75,
  "Unlock Auto Click",
  50,
  "images/NoChillToken.png",
  true,
  false
);
var m_BtnAutoClickDmgUpgrade = null;
var m_BtnRarityUpdate = new Button(
  canvas.width - 75 * 5 - 50,
  400,
  75,
  "Tier Up",
  50,
  "images/NoChillToken.png",
  true,
  true,
  [1000, 10000, 50000, 100000, "Maxed"]
);
var m_CurrencyManager = new CurrencyManager(10, 200, 0, 0, 0, 10);
var m_Power1 = new Power(
  canvas.width - 75 * 5 - 50,
  500,
  35,
  "Balkan Anger (Double Damage)",
  100
);
var m_Power2 = new Power(
  canvas.width - 75 * 5 - 50,
  600,
  35,
  "Communist Gain (Double Tokens)",
  200
);
var m_BtnShop = new Button(10, 10, 75, "Shop", 0, "images/shop.png", false);
m_BtnShop.width = m_BtnShop.height;
var m_BtnMonetization = new Button(
  100,
  10,
  75,
  "Monetization",
  0,
  "images/cash.png",
  false
);
m_BtnMonetization.width = m_BtnMonetization.height;

initGame();
