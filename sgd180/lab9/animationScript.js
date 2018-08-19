var scene, canvas;
var w2, h2;
var bg, zero;

function init() {
  scene = new Scene();
  canvas = scene.canvas;

  scene.setSize(960, 640);
  scene.setBG("#3F306B");

  w2 = scene.width / 2;
  h2 = scene.height / 2;

  bg = new Sprite(scene, "assets/bg.png", 960, 640);
  bg.setSpeed(0);
  bg.setPosition(w2, h2);

  zero = new Sprite(scene, "assets/zero.png", 960, 384);
  zero.loadAnimation(960, 384, 80, 96);
  zero.generateAnimationCycles();
  zero.renameCycles(new Array("idleRight", "runRight", "idleLeft", "runLeft"));
  zero.setAnimationSpeed(1200);
  zero.setPosition(w2, 544);
  zero.setSpeed(0);
  zero.setCurrentCycle("idleRight");
  zero.playAnimation();
  zero.setBoundAction(WRAP);
  zero.facing = 1; // 1 when facing right, -1 when facing left

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
  if (keysDown[K_LEFT] && keysDown[K_RIGHT]) {
    if (zero.facing == 1) {
      startCycle("idleRight");
    } else {
      startCycle("idleLeft");
    }
    zero.setDX(0);
  } else if (keysDown[K_LEFT]) {
    zero.facing = -1;
    startCycle("runLeft");
    zero.setDX(-5);
  } else if (keysDown[K_RIGHT]) {
    zero.facing = 1;
    startCycle("runRight");
    zero.setDX(5);
  } else {
    if (zero.facing == 1) {
      startCycle("idleRight");
    } else {
      startCycle("idleLeft");
    }
    zero.setDX(0);
  }

  // zero.playAnimation();
}

function startCycle(cycleName) {
  if (zero.animation.currentCycleName != cycleName) {
    zero.setCurrentCycle(cycleName);
  }
}
