var scene, canvas;
var cone, sprinkles;
var w2, h2;
var coneSpeed = 7;
var score = 0;
var scoreDisplay;
var clinkMp3, clinkOgg;

function init() {
  scene = new Scene();
  canvas = scene.canvas;

  scene.setSize(400,400);
  scene.setBG("#fbd3e9");

  // canvas.outerHTML = '<div class="canvas-wrapper" style="width: 400px; margin: auto;">' + canvas.outerHTML + '</div>';

  // var wrapper = document.getElementById("canvas-wrapper");
  // wrapper.style.width = "400px";
  // wrapper.style.margin = "auto";

  cone = new Sprite(scene, "assets/cone.png", 32, 64);
  sprinkles = [
    new Sprite(scene, "assets/sprinkles.png", 32, 32),
    new Sprite(scene, "assets/sprinkles.png", 32, 32),
    new Sprite(scene, "assets/sprinkles.png", 32, 32)
  ]

  w2 = scene.width / 2;
  h2 = scene.height / 2;

  cone.setSpeed(0);
  cone.setPosition(w2, 350);
  cone.w2 = cone.width / 2;
  cone.h2 = cone.height / 2;

  for (sprinkle of sprinkles) {
    sprinkle.setSpeed(0);
    sprinkleDownFromTop(sprinkle);
    sprinkle.w2 = sprinkle.width / 2;
    sprinkle.h2 = sprinkle.height / 2;
    sprinkle.setBoundAction(CONTINUE);
  }

  scene.start();

  scoreDisplay = document.getElementById("sprinkle-count");

  clinkMp3 = new Sound("assets/clink.mp3");
  clinkOgg = new Sound("assets/clink.ogg");
}

function sprinkleDownFromTop(sprinkle) {
  sprinkle.setPosition(Math.random() * (scene.width - (2 * sprinkle.width)) + sprinkle.width, -(Math.random() * sprinkle.height) - sprinkle.height);
  sprinkle.setDY(Math.random() * 2 + 4);
}

function update() {
  // clear the scene
  scene.clear();

  // handle events
  handleEvents();

  // update sprites
  cone.update();
  for (sprinkle of sprinkles) {
    sprinkle.update();
  }
}

function handleEvents() {
  if (keysDown[K_LEFT] && keysDown[K_RIGHT]) {
    cone.setDX(0);
  } else if (keysDown[K_LEFT]) {
    cone.setDX(-coneSpeed);
  } else if (keysDown[K_RIGHT]) {
    cone.setDX(coneSpeed);
  } else {
    cone.setDX(0);
  }

  for (sprinkle of sprinkles) {
    if (sprinkle.y > scene.height + sprinkle.height) {
      sprinkleDownFromTop(sprinkle);
    }
    if (sprinkle.collidesWith(cone)) {
      sprinkleDownFromTop(sprinkle);
      score++;
      clinkMp3.play();
      clinkOgg.play();
    }
  }

  scoreDisplay.innerHTML = "Sprinkles: " + score;
}
