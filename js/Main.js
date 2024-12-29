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

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
}, false);


addEventListener("click", function (e) {
  // Get the coordinates in which we are clicking
  var clickX = e.offsetX;
  var clickY = e.offsetY;
  // Call our click function
  Click(clickX, clickY);
}, false);


function Click(clickX, clickY) {
  //console.log("clickeeed");
  CheckClickOnEnemies(clickX, clickY);
  CheckClickOnThisButton(clickX, clickY, m_Button1);
}


function CheckClickOnThisButton(clickX, clickY, thisButton) {
  if (clickX > thisButton.posX &&
    clickX < (thisButton.posX + thisButton.width) &&
    clickY > thisButton.posY &&
    clickY < (thisButton.posY + thisButton.height)
  ) {
    thisButton.buttonPressed();
  }
}

function CheckClickOnEnemies(clickX, clickY) {
  if (clickX > m_CurrentEnemy.posX &&
    clickX < (m_CurrentEnemy.posX + m_CurrentEnemy.currentSpriteSheet.width) &&
    clickY > m_CurrentEnemy.posY &&
    clickY < (m_CurrentEnemy.posY + m_CurrentEnemy.currentSpriteSheet.height)
  ) {
    DoDamageToEnemies();
  }
}


function DoDamageToEnemies() {
  if (!m_CurrentEnemy.enemyIsDead) {
    m_CurrentEnemy.GetDamage();
    if (m_CurrentEnemy.lifePoints == 0) {
      // We increase the score
      m_GameScore += m_CurrentEnemy.pointValue;
      // We spawn a new enemy
      setTimeout(SpawnNewEnemies, 2000);
    }
  }
}

function SpawnNewEnemies() {
  var random = Math.random();
  if (random < 0.5) { // 50% Chance
    m_CurrentEnemy = new GreenEnemy(canvas.width / 2, canvas.height / 2, 3, 100, "Green");
  }
  else if (random < 0.75) { // 25% Chance
    m_CurrentEnemy = new BlueEnemy(canvas.width / 2, canvas.height / 2, 3, 100, "Blue");
  }
  else if (random < 0.9) { // 15% Chance
    m_CurrentEnemy = new RedEnemy(canvas.width / 2, canvas.height / 2, 3, 100, "Red");
  }
  else { // 10% Chance
    m_CurrentEnemy = new YellowEnemy(canvas.width / 2, canvas.height / 2, 3, 100, "Yellow");
  }

  //m_CurrentEnemy = new Enemy(canvas.width / 2, canvas.height / 2, 3, 100, "Blue");
}


// Reset the game when needed
var reset = function () {

};


// Start function, initialize everything you need here
var start = function () {
  // setInterval(functionX, 10000);
};

// Actual gameplay, call all functions needed to make you game work
// Game's logic
var update = function (dt) {
  AutoClick(dt);
  m_Button1.update();
};

function AutoClick(dt) {
  if (m_CurrentTimeBetweenAutoClicks > m_TimeBetweenAutoClicks) {
    m_CurrentTimeBetweenAutoClicks = 0;
    DoDamageToEnemies();
  }
  else {
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
  m_CurrentEnemy.render();
  m_Explosion.render();
  m_Button1.render();

  // Finally, we render the UI, an score for example
  ctx.font = '40px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText("Score: " + m_GameScore,
    30, 60);
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
requestAnimationFrame = w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame || w.msRequestAnimationFrame
  || w.mozRequestAnimationFrame;

async function initGame() {
  // Wait for all images to be ready
  //await m_Paddle.allImagesLoadedPromise;
  SpawnNewEnemies();
  // We wait for the explosion to finish loading
  await m_Explosion.explosionReady;

  // Let's play this game!
  then = Date.now();
  start();
  main();
}

// We initialize the initial time of the game
var then = 0;

// We initialize the GameObjects and variables
var m_GameScore = 0;
var m_CurrentEnemy = null;
var m_Explosion = new Explosion(canvas.width / 2, canvas.height / 2);

var m_TimeBetweenAutoClicks = 5;
var m_CurrentTimeBetweenAutoClicks = 0;
var m_Button1 = new Button(10, 100, 70, "This is a button", 100);

initGame();