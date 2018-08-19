var scene, canvas;
var w2, h2;
var ship, planet, missile;

function init() {
  scene = new Scene();
  canvas = scene.canvas;

  scene.setSize(800, 800);
  scene.setBG("#3F306B");

  w2 = scene.width / 2;
  h2 = scene.height / 2;

  ship = new Sprite(scene, "assets/ship.png", 32, 32);
  ship.setSpeed(0);
  ship.setPosition(100, 100);
  ship.setAngle(0);

  planet = new Sprite(scene, "assets/planet.png", 128, 128);
  planet.setSpeed(0);
  planet.setPosition(w2, h2);
  planet.setAngle(0);
  planet.gravity = 35;

  missile = new Sprite(scene, "assets/missile.png", 32, 16);
  missile.setSpeed(0);
  missile.setPosition(-100, -100);
  missile.setAngle(0);
  missile.setBoundAction(DIE);

  scene.start();

}

function update() {
  // clear the scene
  scene.clear();

  // handle events
  handleEvents();

  // update sprites
  planet.update();
  missile.update();
  ship.update();
}

function handleEvents() {
  // turn ship
  if (keysDown[K_LEFT] && keysDown[K_RIGHT]) {
    // do nothing
  } else if (keysDown[K_LEFT]) {
    ship.changeImgAngleBy(-3);
  } else if (keysDown[K_RIGHT]) {
    ship.changeImgAngleBy(3);
  }

  // propel ship
  if (keysDown[K_UP] && keysDown[K_DOWN]) {
    // do nothing
  } else if (keysDown[K_UP]) {
    ship.addVector(ship.getImgAngle(), .25);
  } else if (keysDown[K_DOWN]) {
    ship.addVector(ship.getImgAngle(), -.1);
  }

  // do ship gravity
  var shipDist = ship.distanceTo(planet);
  if (shipDist <= 300) {
    ship.addVector(planet.angleTo(ship), planet.gravity / shipDist);
    // ship.setImgAngle(planet.angleTo(ship));
  }

  // destroy missile
  var missileDist = missile.distanceTo(planet);
  if (missileDist <= 68) {
    missile.setPosition(-100, -100);
    missile.setSpeed(0);
  }

  // do missile gravity
  if (missileDist <= 200) {
    missile.addVector(planet.angleTo(missile), planet.gravity / missileDist);
    missile.setImgAngle(missile.getMoveAngle());
  }

  // don't go too fast
  if (ship.getSpeed() > 12) {
    ship.setSpeed(12);
  }

  // speed up missile
  if (missile.getSpeed() > 0) {
    missile.addVector(missile.getImgAngle(), .1);
  }

  // fire missile
  if (keysDown[K_SPACE]) {
    if (missile.getSpeed() == 0 && shipDist > 68) {
      missile.setPosition(ship.x, ship.y);
      missile.setAngle(ship.getImgAngle());
      missile.setSpeed(5);
      missile.show();
    }
  }

}
