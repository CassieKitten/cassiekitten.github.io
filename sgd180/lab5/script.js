var canvas, ctx;
var w, h, w2, h2;

function init() {
  canvas = document.getElementById("myCanvas");

  drawStuff(canvas);
}

function drawStuff(c) {
  w = c.width;
  h = c.height;
  w2 = w / 2;
  h2 = h / 2;

  ctx = c.getContext("2d");

  // circle
  ctx.beginPath();
  ctx.arc(w2, h2 - 70, 110, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  ctx.shadowBlur = 20;
  ctx.shadowColor = "black";
  ctx.shadowOffsetY = 5;
  ctx.fill();
  ctx.stroke();
  ctx.shadowColor = "transparent";

  // text
  ctx.font = "64px Helvetica";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1.5;
  var txt = "Pac-Man";
  ctx.fillText(txt, w2 - (ctx.measureText(txt).width / 2), h2 + 120);
  ctx.strokeText(txt, w2 - (ctx.measureText(txt).width / 2), h2 + 120);

  // pacman
  pixel(-5, -10, "yellow");
  pixel(-4, -10);
  pixel(-3, -10);
  pixel(-6, -9);
  pixel(-5, -9);
  pixel(-4, -9);
  pixel(-3, -9);
  pixel(-2, -9);
  pixel(-7, -8);
  pixel(-6, -8);
  pixel(-5, -8);
  pixel(-4, -8);
  pixel(-7, -7);
  pixel(-6, -7);
  pixel(-5, -7);
  pixel(-7, -6);
  pixel(-6, -6);
  pixel(-5, -6);
  pixel(-4, -6);
  pixel(-6, -5);
  pixel(-5, -5);
  pixel(-4, -5);
  pixel(-3, -5);
  pixel(-2, -5);
  pixel(-5, -4);
  pixel(-4, -4);
  pixel(-3, -4);

  // blinky
  pixel(4, -10, "red");
  pixel(5, -10);
  pixel(3, -9);
  pixel(4, -9);
  pixel(5, -9);
  pixel(6, -9);
  pixel(4, -8);
  pixel(7, -8);
  pixel(4, -7);
  pixel(7, -7);
  pixel(2, -6);
  pixel(3, -6);
  pixel(4, -6);
  pixel(5, -6);
  pixel(6, -6);
  pixel(7, -6);
  pixel(2, -5);
  pixel(3, -5);
  pixel(4, -5);
  pixel(5, -5);
  pixel(6, -5);
  pixel(7, -5);
  pixel(2, -4);
  pixel(4, -4);
  pixel(5, -4);
  pixel(7, -4);
  pixel(2, -8, "blue");
  pixel(5, -8);
  pixel(3, -8, "white");
  pixel(6, -8);
  pixel(2, -7);
  pixel(3, -7);
  pixel(5, -7);
  pixel(6, -7);
}

function pixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(w2 + (x * 10) - 5, h2 + (y * 10) - 5, 10, 10);
}
