var scene, canvas; // essential vars
var w2, h2; // width/2 & height/2
var bg, zero; // background & character
var boxes; // box obstacles
var ding, crush; // sounds
var numInitialBoxes; // how many boxes to start with
var numBoxes; // how many boxes there are currently
var newBoxInterval; // how many seconds before adding a new box
var boxInitialBaseSpeed; // how fast boxes move at a square resolution
var boxCurrentBaseSpeed; // how fast boxes move at the actual resolution (taller aspect ratio = faster boxes)
var boxInitialSpeedMultiplier; // box fall speed multiplier at the start of the game
var boxCurrentSpeedMultiplier; // current box fall speed multiplier (increases with time)
var boxActualSpeed; // actual box fall speed right now
var boxFasterInterval; // how many seconds before box speed multiplier increases
var boxFasterAmount; // how much box speed multiplier increases by
var screenW, screenH, screenWLast, screenHLast; // for dynamic screen resizing
var zeroHeightOffset; // to keep Zero on the floor
var zeroSizeModifier; // to scale up pixel art
var moveDirectionKeys; // whether or not to move Zero (used with arrow keys) [-1, 0, 1]
var moveDirectionTouch; // whether or not to move Zero (used with touch input) [-1, 0, 1]
var score; // how many boxes the player has dodged
var gameHasStarted; // whether the game has started
var flavourTextList; // a list of possible text to be displayed when you lose

// intervals
var intFixScreenSize;
var intBoxesGetFaster;
var intAddNewBox;

// html dom
var textContainer;
var intro;
var outro;
var controlsLeft;
var controlsRight;
var controlsStart;
var controlsReplay;
var flavourText;
var scoreDisplay;
var finalScore;

function initVars() {
  boxes = [];
  numInitialBoxes = 4;
  numBoxes = numInitialBoxes;
  newBoxInterval = 20;
  boxInitialBaseSpeed = 3;
  boxCurrentBaseSpeed = boxInitialBaseSpeed;
  boxInitialSpeedMultiplier = 1;
  boxCurrentSpeedMultiplier = boxInitialSpeedMultiplier;
  boxActualSpeed = boxCurrentBaseSpeed * boxCurrentSpeedMultiplier;
  boxFasterInterval = 30;
  boxFasterAmount = .25;
  zeroHeightOffset = .441;
  zeroSizeModifier = 2;
  moveDirectionKeys = 0;
  moveDirectionTouch = 0;
  score = 0;
  gameHasStarted = false;

  textContainer = document.getElementById("text-container");
  intro = document.getElementById("intro");
  outro = document.getElementById("outro");
  controlsLeft = document.getElementById("controls-left");
  controlsRight = document.getElementById("controls-right");
  controlsStart = document.getElementById("controls-start");
  controlsReplay = document.getElementById("controls-replay");
  flavourText = document.getElementById("flavour-text");
  scoreDisplay = document.getElementById("score-display");
  finalScore = document.getElementById("final-score");
}

function init() {
  initVars();
  defineFlavourTextList();

  scene = new Scene();
  canvas = scene.canvas;

  if (scene.touchable) {
    controlsLeft.innerHTML = "Touch the left side";
    controlsRight.innerHTML = "Touch the right side";
    controlsStart.innerHTML = "Touch anywhere";
    controlsReplay.innerHTML = "Touch anywhere";
  }

  bg = new Sprite(scene, "assets/bg.png", 960, 1416);
  zero = new Sprite(scene, "assets/zero.png", 1360, 48);

  fixScreenSize();
  intFixScreenSize = window.setInterval(fixScreenSize, 20);

  scene.setBG("#081848");

  updateW2H2();

  bg.setSpeed(0);
  bg.setBoundAction(CONTINUE);

  zero.loadAnimation(1360, 48, 40, 48);
  zero.generateAnimationCycles(SINGLE_ROW, [6, 11, 6, 11]);
  zero.renameCycles(new Array("idleRight", "runRight", "idleLeft", "runLeft"));
  zero.setAnimationSpeed(800);
  zero.setX(bg.x);
  zero.setY(parseInt(bg.y + (bg.height * zeroHeightOffset)));
  zero.setSpeed(0);
  zero.setCurrentCycle("idleRight");
  zero.playAnimation();
  zero.setBoundAction(WRAP);
  zero.facing = 1; // 1 when facing right, -1 when facing left
  zero.baseSpeed = 5; // run speed at a scale factor of 1
  zero.currentSpeed = zero.baseSpeed * bg.sizeScale; // run speed at the current scale factor

  updateZeroSize();
  updateZeroPos();
  updateZeroSpeed();

  setupTouchInput();

  ding = new Sound("assets/ding.mp3");
  crush = new Sound("assets/crush.mp3");

  scene.start();
}

function update() {
  // clear the scene
  scene.clear();

  // handle events
  handleEvents();

  // update sprites
  bg.update();
  zero.update();
  for (b of boxes) {
    b.update();
  }

  // update ui
  scoreDisplay.innerHTML = score.toString();
  finalScore.innerHTML = "You dodged " + score.toString() + " box" + (score == 1 ? "!" : "es!");
}

function handleEvents() {
  checkKeyboardInput();
  moveZero();
  updateZeroAnimationSpeed();
  boxesHitZero();
  boxesWrap();

  // var debugText = "x: " + zero.x + "<br>y: " + zero.y + "<br>width: " + zero.animation.cellWidth + "<br>height: " + zero.animation.cellHeight + "<br>bgw: " + bg.width + "<br>bgh: " + bg.height + "<br>cWidth: " + canvas.width + "<br>cHeight: " + canvas.height + "<br>w2: " + w2 + "<br>h2: " + h2 + "<br>touchable: " + scene.touchable + "<br>mouseX: " + scene.getMouseX() + "<br>mouseY: " + scene.getMouseY() + "<br>isMouseDown: " + bg.isMouseDown();
  // document.getElementById("debug").innerHTML = debugText;
}

function startGame() {
  gameHasStarted = true;
  ding.play();
  if (outro.style.display == "block") {
    initVars();
    zero.setX(bg.x);
    zero.show();
  }
  hideIntroOutro();
  for (var i = boxes.length; i < numBoxes; i++) {
    addNewBox();
  }
  clearInterval(intBoxesGetFaster);
  clearInterval(intAddNewBox);
  intBoxesGetFaster = window.setInterval(boxesGetFaster, boxFasterInterval * 1000);
  intAddNewBox = window.setInterval(addNewBox, newBoxInterval * 1000);
  pickNewFlavourText();
}

function defineFlavourTextList() {
  flavourTextList = [
    "Bummer.",
    "Nice try.",
    "Good try.",
    "Well played.",
    "Better luck next time.",
    "Ouch.",
    "You got crushed.",
    "Whoops.",
    "Yikes.",
    "There's always next time.",
    "Care to try again?",
    "Wanna give it another shot?",
    "How about another try?",
    "I believe in you.",
    "You had one job.",
    "Do it the same, but better."
  ]
}

function pickNewFlavourText() {
  flavourText.innerHTML = flavourTextList[Math.floor(Math.random() * flavourTextList.length)];
}

function hideIntroOutro() {
  intro.style.display = "none";
  outro.style.display = "none";
  textContainer.style.display = "none";
}

function showOutro() {
  outro.style.display = "block";
  textContainer.style.display = "block";
}

function startCycle(cycleName) {
  if (zero.animation.currentCycleName != cycleName) {
    zero.setCurrentCycle(cycleName);
  }
}

function fixScreenSize() {
  screenW = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  screenH = (window.innerHeight > 0) ? window.innerHeight : screen.height;
  if (screenW != screenWLast || screenH != screenHLast) {
    hasSetup = true;
    scene.setSizePos(screenW, screenH, 0, 0);

    updateW2H2();

    updateBGSize();
    updateBGPos();

    updateZeroSize();
    updateZeroPos();
    updateZeroSpeed();

    updateBoxSize();
    updateBoxPos();
    updateBoxSpeed();

    makePixelPerfect();

    screenWLast = screenW;
    screenHLast = screenH;

    // bg.report();
  }
}

function addNewBox() {
  var newBox = new Sprite(scene, "assets/box.png", 90, 96);
  newBox.setPosition(Math.random() * canvas.width, (-96 - Math.random() * 480) * boxCurrentBaseSpeed);
  newBox.setSpeed(boxActualSpeed);
  newBox.setMoveAngle(180);
  newBox.setBoundAction(CONTINUE);
  boxes.push(newBox);

  updateBoxSize();
  updateBoxPos();
  updateBoxSpeed();
}

function boxesGetFaster() {
  boxCurrentSpeedMultiplier += boxFasterAmount;
}

function boxesHitZero() {
  for (b of boxes) {
    if (b.y < zero.y && b.distanceTo(zero) < zero.animation.cellWidth * zero.animation.sizeScale && zero.visible) {
      crush.play();
      stopGame();
    }
  }
}

function boxesWrap() {
  for (b of boxes) {
    if (b.y > canvas.height + b.height / 2) {
      if (zero.visible) {
        b.setPosition(Math.random() * canvas.width, (-96 - Math.random() * 480) * boxCurrentBaseSpeed);
        score++;
        ding.play();
      } else {
        b.hide();
      }
    }
  }
}

function stopGame() {
  zero.hide();
  clearInterval(intAddNewBox);
  clearInterval(intBoxesGetFaster);
  showOutro();
  gameHasStarted = false;
}

function zeroStopMoving() {
  if (zero.facing == 1) {
    startCycle("idleRight");
  } else {
    startCycle("idleLeft");
  }
  zero.setDX(0);
}

function zeroMoveRight() {
  zero.facing = 1;
  startCycle("runRight");
  zero.setDX(zero.currentSpeed);
}

function zeroMoveLeft() {
  zero.facing = -1;
  startCycle("runLeft");
  zero.setDX(-zero.currentSpeed);
}

function updateW2H2() {
  w2 = parseInt(scene.width / 2);
  h2 = parseInt(scene.height / 2);
}

function updateBGSize() {
  var newScale = (canvas.width + 2) / bg.startWidth;
  bg.scale(newScale);
}

function updateBGPos() {
  bg.setPosition(w2, h2);

  while (bg.y + (bg.height / 2) < canvas.height) {
    bg.changeYby(1);
  }

  while (bg.y + (bg.height / 2) > canvas.height) {
    bg.changeYby(-1);
  }
}

function updateBoxSize() {
  for (b of boxes) {
    b.cHeight = parseInt(canvas.height);
    b.cWidth = parseInt(canvas.width);
    b.scale(bg.sizeScale);
  }
}

function updateBoxPos() {
  for (b of boxes) {
    var xRatio = b.x / screenWLast;
    var yRatio = b.y / screenHLast;
    b.setX(xRatio * screenW);
    b.setY(yRatio * screenH);
  }
}

function updateBoxSpeed() {
  var heightRatio = screenH / 1080;
  boxCurrentBaseSpeed = boxInitialBaseSpeed * heightRatio;
  boxActualSpeed = boxCurrentBaseSpeed * boxCurrentSpeedMultiplier;
  for (b of boxes) {
    b.setSpeed(boxActualSpeed);
  }
}

function updateZeroSize() {
  zero.cHeight = parseInt(canvas.height);
  zero.cWidth = parseInt(canvas.width);
  window.setTimeout(function(){zero.animation.scale(bg.sizeScale * zeroSizeModifier)}, 0);
}

function updateZeroPos() {
  zero.setY(parseInt(bg.y + (bg.height * zeroHeightOffset)));

  if (screenW != screenWLast) {
    var ratio = zero.x / screenWLast;
    zero.setX(ratio * screenW);
  }
}

function updateZeroSpeed() {
  zero.currentSpeed = zero.baseSpeed * bg.sizeScale;
}

function updateZeroAnimationSpeed() {
  if (zero.dx == 0) {
    zero.setAnimationSpeed(840);
  } else {
    zero.setAnimationSpeed(990);
  }
}

function makePixelPerfect() {
  if (typeof(scene.context.imageSmoothingEnabled) !== 'undefined') {
    scene.context.imageSmoothingEnabled = this.imageSmoothingEnabled;
  } else {
    scene.context.mozImageSmoothingEnabled = false;
    scene.context.msImageSmoothingEnabled = false;
    scene.context.oImageSmoothingEnabled = false;
    scene.context.webkitImageSmoothingEnabled = false;
  }
}

function setupTouchInput() {
  if (true) {
    document.addEventListener("touchstart", function(){}, true);
    document.addEventListener("touchstart", checkTouchInput);
    document.addEventListener("touchmove", checkTouchInput);
    document.addEventListener("touchend", checkTouchInput);
    document.addEventListener("touchcancel", checkTouchInput);
  }
}

function checkKeyboardInput() {
  if (!gameHasStarted && keysDown[K_SPACE]) {
    startGame();
  }
  if ((keysDown[K_LEFT] || keysDown[K_A]) && (keysDown[K_RIGHT] || keysDown[K_D])) {
    moveDirectionKeys = 0;
  } else if (keysDown[K_LEFT] || keysDown[K_A]) {
    moveDirectionKeys = -1;
  } else if (keysDown[K_RIGHT] || keysDown[K_D]) {
    moveDirectionKeys = 1;
  } else {
    moveDirectionKeys = 0;
  }
}

function checkTouchInput(event) {
  event.preventDefault();

  var anyTouchesLeft = false;
  var anyTouchesRight = false;
  var touchList = event.touches;

  if (touchList.length > 0) {
    if (!gameHasStarted) {
      startGame();
    }
    for (var i = 0; i < touchList.length; i++) {
      if (touchList[i].clientX < w2) anyTouchesLeft = true;
      else anyTouchesRight = true;
    }

    if (anyTouchesLeft && anyTouchesRight) {
      moveDirectionTouch = 0;
    } else if (anyTouchesLeft) {
      moveDirectionTouch = -1;
    } else if (anyTouchesRight) {
      moveDirectionTouch = 1;
    } else {
      moveDirectionTouch = 0;
    }
  } else {
    moveDirectionTouch = 0;
  }
}

function moveZero() {
  if (gameHasStarted) {
    if (moveDirectionKeys < 0) {
      if (moveDirectionTouch < 0) {
        zeroMoveLeft();
      } else if (moveDirectionTouch > 0) {
        zeroStopMoving();
      } else {
        zeroMoveLeft();
      }
    } else if (moveDirectionKeys > 0) {
      if (moveDirectionTouch < 0) {
        zeroStopMoving();
      } else if (moveDirectionTouch > 0) {
        zeroMoveRight();
      } else {
        zeroMoveRight();
      }
    } else {
      if (moveDirectionTouch < 0) {
        zeroMoveLeft();
      } else if (moveDirectionTouch > 0) {
        zeroMoveRight();
      } else {
        zeroStopMoving();
      }
    }
  }
}
