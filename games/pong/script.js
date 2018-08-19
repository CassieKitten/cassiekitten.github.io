var scene, canvas; // essential vars
var w2, h2; // width/2 & height/2
var divider, paddle, score; // sprites
var screenW = 1, screenH = 1, screenWLast = 0, screenHLast = 0; // for dynamic screen resizing
var baseW = 160, baseH = 90; // base width & height
var ratioW = 16, ratioH = 9, ratio = ratioW / ratioH; // for dynamic screen resizing
var scaleFactor = 1; // scale factor of base width & height
var oldScaleFactor = scaleFactor; // old scale factor (before screen resizing)
var scaleRatio = scaleFactor / oldScaleFactor; // ratio of the new scale to the previous scale
var paddleSpeedMultiplier = .75; // how quickly to move each paddle
var initialBallSpeedMultiplier = .8; // how quickly to move the ball at the beginning of a round
var currentBallSpeedMultiplier = 0; // how quickly the ball is currently moving
var started = false; // whether the current round has been started
var ballAngleSnap = 15; // which angle increments the ball is allowed to move in
var numAngleIncrements = Math.floor(360 / ballAngleSnap); // how many possible angles the ball can move

// TODO: do scoring

const MOVE_UP = -1;
const MOVE_DOWN = 1;
const MOVE_STOP = 0;

const AXIS_HORIZONTAL = 0;
const AXIS_VERTICAL = 1;

function init() {
  scene = new Scene();
  canvas = scene.canvas;

  scene.setPos(0, 0);

  window.setTimeout(fixScreenSize, 0);
  window.setInterval(fixScreenSize, 200);

  scene.setBG("#000");

  updateW2H2();

  divider = new Sprite(scene, "assets/divider.png", 2, 90);
  divider.setSpeed(0);
  divider.setPosition(w2, h2);
  divider.setBoundAction(CONTINUE);

  paddle = [new Sprite(scene, "assets/paddle.png", 4, 24), new Sprite(scene, "assets/paddle.png", 4, 24)];
  for (p of paddle) {
    p.setSpeed(0);
    p.setBoundAction(CONTINUE);
  }
  setTimeout(function(){paddle[0].setY(h2)});
  setTimeout(function(){paddle[1].setY(h2)});

  score = [new Sprite(scene, "assets/score.png", 20, 132), new Sprite(scene, "assets/score.png", 20, 132)];
  for (s of score) {
    s.setSpeed(0);
    s.setY(20 * scaleFactor);
    s.setBoundAction(CONTINUE);

    s.loadAnimation(20, 132, 20, 12);
    s.generateAnimationCycles();
    s.renameCycles(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
    s.setAnimationSpeed(1000);
    s.pauseAnimation();
  }

  ball = new Sprite(scene, "assets/ball.png", 4, 4);
  ball.setSpeed(0);
  ball.setBoundAction(CONTINUE);
  setTimeout(function(){ball.setPosition(w2, h2)});

  scene.start();
}

function update() {
  // clear the scene
  scene.clear();

  // handle events
  handleEvents();

  // update sprites
  divider.update();

  for (p of paddle) {
    p.update();
  }

  for (s of score) {
    s.update();
  }

  ball.update();
}

function handleEvents() {
  checkKeyboardInput();
  paddleConstrain();
  ballBounce();
  ballOffScreen();
}

function fixScreenSize() {
  screenW = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  screenH = (window.innerHeight > 0) ? window.innerHeight : screen.height;
  if (screenW != screenWLast || screenH != screenHLast) {
    oldScaleFactor = scaleFactor;

    var fitWideOrTall = "wide";
    var newRatio = screenW / screenH;
    if (newRatio > ratio) fitWideOrTall = "tall";

    var newW = 1, newH = 1;

    switch (fitWideOrTall) {
      default:
      case "wide":
        newW = screenW;
        newH = screenW / ratio;
        break;
      case "tall":
        newW = screenH * ratio;
        newH = screenH;
        break;
    }

    scene.setSizePos(newW, newH, (screenW - newW) / 2, (screenH - newH) / 2);
    scaleFactor = newW / baseW;
    scaleRatio = scaleFactor / oldScaleFactor;

    updateW2H2();

    updateDividerSize();
    updateDividerPos();

    updatePaddleSize();
    updatePaddlePos();

    updateScoreSize();
    updateScorePos();

    updateBallSize();
    updateBallPos();
    updateBallSpeed();

    makePixelPerfect();

    screenWLast = screenW;
    screenHLast = screenH;
  }
}

function updateDividerSize() {
  divider.scale(scaleFactor);
}

function updateDividerPos() {
  divider.setPosition(w2, h2);
}

function updatePaddleSize() {
  for (p of paddle) {
    p.scale(scaleFactor);
  }
}

function updatePaddlePos() {
  paddle[0].setX(4 * scaleFactor);
  paddle[1].setX(scene.width - (4 * scaleFactor));

  for (p of paddle) {
    p.setY(p.y * scaleRatio);
  }
}

function updateScoreSize() {
  for (s of score) {
    s.animation.scale(scaleFactor);
  }
}

function updateScorePos() {
  for (s of score) {
    s.setY(10 * scaleFactor);
  }
  score[0].setX(50 * scaleFactor);
  score[1].setX(scene.width - (50 * scaleFactor));
}

function updateBallSize() {
  ball.scale(scaleFactor);
}

function updateBallPos() {
  ball.setPosition(ball.x * scaleRatio, ball.y * scaleRatio);
}

function movePaddle(player, direction) {
  paddle[player].setDY(direction * scaleFactor * paddleSpeedMultiplier);
}

function startGame() {
  if (!started) {
    started = true;
    var angleToMove = Math.floor(Math.floor(Math.random() * numAngleIncrements) * ballAngleSnap);
    if (angleToMove == 0 || angleToMove == 180) {
      if (Math.random() < .5) {
        angleToMove = 90;
      } else {
        angleToMove = 270;
      }
    }
    ball.setMoveAngle(angleToMove);
    currentBallSpeedMultiplier = initialBallSpeedMultiplier;
    updateBallSpeed();
  }
}

function updateBallSpeed() {
  ball.setSpeed(scaleFactor * currentBallSpeedMultiplier);
}

function paddleConstrain() {
  // for (var i = 0; i < paddle.length; i++) {
  //   if (paddle[i].y < paddle[i].height / 2) {
  //     paddle[i].y = paddle[i].height / 2;
  //     movePaddle(i, MOVE_STOP);
  //   } else if (paddle[i].y > scene.height - (paddle[i].height / 2)) {
  //     paddle[i].y = scene.height - (paddle[i].height / 2);
  //     movePaddle(i, MOVE_STOP);
  //   }
  // }

  for (p of paddle) {
    if (p.y < p.height / 2) {
      p.y = p.height / 2;

    } else if (p.y > scene.height - (p.height / 2)) {
      p.y = scene.height - (p.height / 2);
    }
  }
}

function ballBounce() {
  if (ball.collidesWith(paddle[0])) {
    ball.setX(paddle[0].x + (paddle[0].width / 2) + (ball.width / 2));
    reverseBallMotion(AXIS_HORIZONTAL);
  } else if (ball.collidesWith(paddle[1])) {
    ball.setX(paddle[1].x - (paddle[1].width / 2) - (ball.width / 2));
    reverseBallMotion(AXIS_HORIZONTAL);
  }

  if (ball.y - (ball.height / 2) < 0) {
    ball.setY(0 + (ball.height / 2));
    reverseBallMotion(AXIS_VERTICAL);
  } else if (ball.y + (ball.height / 2) > scene.height) {
    ball.setY(scene.height - (ball.height / 2));
    reverseBallMotion(AXIS_VERTICAL);
  }
}

function reverseBallMotion(axis) {
  switch (axis) {
    case AXIS_HORIZONTAL:
      ballPickNewAngle();
      currentBallSpeedMultiplier *= 1.1;
      updateBallSpeed();
      break;
    default:
    case AXIS_VERTICAL:
      // ball.setDY(-ball.dy);
      // quadrant 1
      if (ball.getMoveAngle() < 90) {
        ball.setMoveAngle(180 - ball.getMoveAngle());
      }
      // quadrant 2
      else if (ball.getMoveAngle() > 270) {
        ball.setMoveAngle(270 - (ball.getMoveAngle() - 270));
      }
      // quadrant 3
      else if (ball.getMoveAngle() > 180) {
        ball.setMoveAngle(180 - ball.getMoveAngle());
      }
      // quadrant 4
      else {
        ball.setMoveAngle(360 - (ball.getMoveAngle() - 180));
      }
      break;
  }
}

function ballPickNewAngle() {
  // figure out some numbers
  var numPossibleNewAngles = (numAngleIncrements - 2) / 2; // don't count 0 or 180
  var paddleSectionSize = paddle[0].height / numPossibleNewAngles;
  var possibleNewAngles = [];
  var whichPaddleHit = 0;
  for (var i = 1; i <= numPossibleNewAngles; i++) {
    possibleNewAngles.push(i * ballAngleSnap);
  }

  // account for hitting paddle 1 instead of 0
  if (ball.getMoveAngle() < 180) {
    for (var i = 0; i < possibleNewAngles.length; i++) {
      possibleNewAngles[i] += 180;
    }
    possibleNewAngles.reverse();
    whichPaddleHit = 1;
  }

  // work out the different sections of the paddle
  var paddleTopY = paddle[whichPaddleHit].y - (paddle[whichPaddleHit].height / 2);
  var paddleSections = [];
  for (var i = 0; i < numPossibleNewAngles; i++) {
    paddleSections.push(paddleTopY + (i * paddleSectionSize));
  }

  // find the new angle
  var newAngle = possibleNewAngles[0];
  for (var i = 0; i < paddleSections.length; i++) {
    if (ball.y >= paddleSections[i]) {
      newAngle = possibleNewAngles[i];
    }
  }
  ball.setMoveAngle(newAngle);
}

function ballOffScreen() {
  if (ball.x < -(ball.width / 2)) {
    resetBall();
    addPoint(1);
  } else if (ball.x > scene.width + (ball.width / 2)) {
    resetBall();
    addPoint(0);
  }
}

function resetBall() {
  ball.setPosition(w2, h2);
  currentBallSpeedMultiplier = 0;
  updateBallSpeed();
  for (p of paddle) {
    p.setY(h2);
  }
  started = false;
}

function addPoint(whichPlayer) {
  switch (score[whichPlayer].animation.currentCycleName) {
    default:
    case "0":
      score[whichPlayer].setCurrentCycle("1");
      break;
    case "1":
      score[whichPlayer].setCurrentCycle("2");
      break;
    case "2":
      score[whichPlayer].setCurrentCycle("3");
      break;
    case "3":
      score[whichPlayer].setCurrentCycle("4");
      break;
    case "4":
      score[whichPlayer].setCurrentCycle("5");
      break;
    case "5":
      score[whichPlayer].setCurrentCycle("6");
      break;
    case "6":
      score[whichPlayer].setCurrentCycle("7");
      break;
    case "7":
      score[whichPlayer].setCurrentCycle("8");
      break;
    case "8":
      score[whichPlayer].setCurrentCycle("9");
      break;
    case "9":
      score[whichPlayer].setCurrentCycle("10");
      started = true;
      ball.hide();
      for (p of paddle) {
        p.hide();
      }
      paddle[whichPlayer].show();
      break;
  }
}

function checkKeyboardInput() {
  // start game
  if (keysDown[K_SPACE]) {
    startGame();
  }

  // player 0
  if ((keysDown[K_W] || keysDown[K_Z]) && !keysDown[K_S]) {
    movePaddle(0, MOVE_UP);
  } else if (keysDown[K_S] && !(keysDown[K_W] || keysDown[K_Z])) {
    movePaddle(0, MOVE_DOWN);
  } else {
    movePaddle(0, MOVE_STOP);
  }

  // player 1
  if (keysDown[K_UP] && !keysDown[K_DOWN]) {
    movePaddle(1, MOVE_UP);
  } else if (keysDown[K_DOWN] && !keysDown[K_UP]) {
    movePaddle(1, MOVE_DOWN);
  } else {
    movePaddle(1, MOVE_STOP);
  }
}

function updateW2H2() {
  w2 = parseInt(scene.width / 2);
  h2 = parseInt(scene.height / 2);
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
