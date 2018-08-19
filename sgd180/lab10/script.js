var scene, canvas; // essential vars
var w2, h2; // width/2 & height/2
var bg, zero; // background & character
var screenW = 1, screenH = 1, screenWLast = 0, screenHLast = 0; // for dynamic screen resizing
var zeroHeightOffset = .441; // to keep Zero on the floor
var zeroSizeModifier = 2; // to scale up pixel art
var joy = 0; // virtual joystick object
var moveDirectionKeys = 0; // whether or not to move Zero (used with arrow keys) [-1, 0, 1]
var moveDirectionTouch = 0; // whether or not to move Zero (used with touch input) [-1, 0, 1]

function init() {
  scene = new Scene();
  canvas = scene.canvas;

  bg = new Sprite(scene, "assets/bg4.png", 960, 1416);
  zero = new Sprite(scene, "assets/zero2.png", 1360, 48);

  fixScreenSize();
  window.setInterval(fixScreenSize, 200);

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

  // makePixelPerfect();

  setupTouchInput();

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
}

function handleEvents() {
  checkKeyboardInput();
  // checkTouchInput();
  moveZero();

  if (zero.distanceTo(bg) < zero.animation.cellWidth / 2) {
    // zero.changeXby(1);
  }

  updateZeroAnimationSpeed();

var debugText = "x: " + zero.x + "<br>y: " + zero.y + "<br>width: " + zero.animation.cellWidth + "<br>height: " + zero.animation.cellHeight + "<br>bgw: " + bg.width + "<br>bgh: " + bg.height + "<br>cWidth: " + canvas.width + "<br>cHeight: " + canvas.height + "<br>w2: " + w2 + "<br>h2: " + h2 + "<br>touchable: " + scene.touchable + "<br>mouseX: " + scene.getMouseX() + "<br>mouseY: " + scene.getMouseY() + "<br>isMouseDown: " + bg.isMouseDown();
  document.getElementById("debug").innerHTML = debugText;
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

    makePixelPerfect();

    screenWLast = screenW;
    screenHLast = screenH;

    // bg.report();
  }
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

function updateZeroSize() {
  zero.cHeight = parseInt(zero.canvas.height);
  zero.cWidth = parseInt(zero.canvas.width);
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
  // if (scene.touchable) {
  if (true) {
    document.addEventListener("touchstart", function(){}, true);
    // joy = new Joy();
    // scene.hideCursor();
    document.addEventListener("touchstart", checkTouchInput);
    document.addEventListener("touchmove", checkTouchInput);
    document.addEventListener("touchend", checkTouchInput);
    document.addEventListener("touchcancel", checkTouchInput);
    // document.addEventListener("touchstart", disableScrolling);
    // document.addEventListener("touchmove", disableScrolling);
    // document.addEventListener("touchstart", debugTouchInput);
    // document.addEventListener("touchstart", checkTouchInput);
    // document.addEventListener("touchmove", checkTouchInput);
    // document.addEventListener("touchend", checkTouchInput);
  }
}

// function debugTouchInput() {
//   zero.changeYby(-20);
// }

// function disableScrolling(event) {
//   event.preventDefault();
// }

function checkKeyboardInput() {
  if (keysDown[K_LEFT] && keysDown[K_RIGHT]) {
    moveDirectionKeys = 0;
  } else if (keysDown[K_LEFT]) {
    moveDirectionKeys = -1;
  } else if (keysDown[K_RIGHT]) {
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

// function checkTouchInput() {
//   if (bg.isMouseDown()) {
//     var anyTouchesLeft = false;
//     var anyTouchesRight = false;
//
//     if (scene.getMouseX() < w2) anyTouchesLeft = true;
//     else anyTouchesRight = true;
//
//     if (anyTouchesLeft && anyTouchesRight) {
//       moveDirectionTouch = 0;
//     } else if (anyTouchesLeft) {
//       moveDirectionTouch = -1;
//     } else if (anyTouchesRight) {
//       moveDirectionTouch = 1;
//     } else {
//       moveDirectionTouch = 0;
//     }
//   } else {
//     moveDirectionTouch = 0;
//   }
// }

// function checkTouchInput(event) {
//   var e = event;
//   if (e.touches.length > 0) {
//     var anyTouchesLeft = false;
//     var anyTouchesRight = false;
//     for (t of e.touches) {
//       if (t.pageX < w2) anyTouchesLeft = true;
//       else anyTouchesRight = true;
//     }
//     if (anyTouchesLeft && anyTouchesRight) {
//       moveDirectionTouch = 0;
//     } else if (anyTouchesLeft) {
//       moveDirectionTouch = -1;
//     } else if (anyTouchesRight) {
//       moveDirectionTouch = 1;
//     } else {
//       moveDirectionTouch = 0;
//     }
//   } else {
//     moveDirectionTouch = 0;
//   }
//
//   // if (joy.getMouseX() < w2) {
//   //   keysDown[K_LEFT] = true;
//   // } else {
//   //   keysDown[K_LEFT] = false;
//   // }
//   // if (joy.getMouseX() >= w2) {
//   //   keysDown[K_RIGHT] = true;
//   // } else {
//   //   keysDown[K_RIGHT] = false;
//   // }
// }

function moveZero() {
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
