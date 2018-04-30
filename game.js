var tickRate = 10; // how many times per second the main game loop runs

var kisses = 0;
var happiness = 0;
var money = 0;
var love = 0;
var girlfriends = 0;

var workCost = 5; // how much happiness it costs to work
var dateCost = 20; // how much money it costs to date
var initialDateChance = .25; // chance to get a girlfriend from a date
var dateChanceIncrement = .1 // increases date success chance after a failed date
var dateChance = initialDateChance;
var giftCost = 30; // how much money it costs to give a gift
var kissesPerGirlfriend = 1; // how many kisses each girlfriend gives per second
var kissesPerSecond = 0; // combined kisses per second from all girlfriends

document.addEventListener('DOMContentLoaded', function () {
  // Load from Web Storage
  if (typeof(Storage) !== "undefined") {
    if (localStorage.kisses) {
      kisses = parseFloat(localStorage.kisses);
      updateKisses();
    }
    if (localStorage.happiness) {
      happiness = parseFloat(localStorage.happiness);
      updateHappiness();
    }
    if (localStorage.money) {
      money = parseFloat(localStorage.money);
      updateMoney();
    }
    if (localStorage.love) {
      love = parseFloat(localStorage.love);
      updateLove();
    }
    if (localStorage.girlfriends) {
      girlfriends = parseFloat(localStorage.girlfriends);
      updateGirlfriends();
    }
    if (localStorage.dateChance) {
      dateChance = parseFloat(localStorage.dateChance);
    }
  } else {
    // No Web Storage support :(
  }
  updateKissesPerGirlfriend();
  updateKissesPerSecond();
}, false);

// Restarts the game, setting everything back to 0
function reset() {
  kisses = 0;
  happiness = 0;
  money = 0;
  love = 0;
  girlfriends = 0;
  updateKisses();
  updateHappiness();
  updateMoney();
  updateLove();
  updateGirlfriends();
  resetDateChance();
  localStorage.removeItem("kisses");
  localStorage.removeItem("happiness");
  localStorage.removeItem("money");
  localStorage.removeItem("love");
  localStorage.removeItem("girlfriends");
  localStorage.removeItem("dateChance");
}

function kiss(number) {
  kisses += number;
  happiness += number;
  updateKisses();
  updateHappiness();
}

function work(number) {
  if (happiness >= (workCost * number)) {
    happiness -= (workCost * number);
    money += number;
    updateHappiness();
    updateMoney();
  }
}

function date(number) {
  if (money >= (dateCost * number)) {
    money -= (dateCost * number);
    for (var i = 0; i < number; i++) {
      if (Math.random() < dateChance || girlfriends <= 0) {
        girlfriends++;
        resetDateChance();
      } else {
        increaseDateChance();
      }
    }
    updateMoney();
    updateGirlfriends();
    updateKissesPerSecond();
  }
}

function gift(number) {
  if (money >= (giftCost * number)) {
    money -= (giftCost * number);
    love += number;
    updateMoney();
    updateLove();
    updateKissesPerGirlfriend();
    updateKissesPerSecond();
  }
}

function round(value, decimals) {
  return Number(Number(Math.round(value + "e" + decimals) + "e-" + decimals).toFixed(decimals));
}

function increaseDateChance() {
  dateChance += dateChanceIncrement;
  localStorage.dateChance = dateChance;
}

function resetDateChance() {
  dateChance = initialDateChance;
  localStorage.dateChance = dateChance;
}

function updateKisses() {
  document.getElementById("kisses-display").innerHTML = "Kisses: " + round(kisses, 0).toLocaleString();
  localStorage.kisses = kisses;
}

function updateHappiness() {
  document.getElementById("happiness-display").innerHTML = "Happiness: " + round(happiness, 0).toLocaleString();
  localStorage.happiness = happiness;
}

function updateMoney() {
  document.getElementById("money-display").innerHTML = "Money: $" + round(money, 0).toLocaleString();
  localStorage.money = money;
}

function updateLove() {
  document.getElementById("love-display").innerHTML = "Love: " + round(love, 0).toLocaleString();
  localStorage.love = love;
}

function updateGirlfriends() {
  document.getElementById("girlfriends-display").innerHTML = "Girlfriends: " + round(girlfriends, 0).toLocaleString();
  localStorage.girlfriends = girlfriends;
}

function updateKissesPerGirlfriend() {
  kissesPerGirlfriend = 1 + (Math.pow(love, 4.0 / 3.0) / (love + 100));
  document.getElementById("kisses-per-girlfriend-display").innerHTML = "Kisses per Girlfriend: " + round(kissesPerGirlfriend, 2).toLocaleString();
}

function updateKissesPerSecond() {
  kissesPerSecond = girlfriends * kissesPerGirlfriend;
  document.getElementById("kisses-per-second-display").innerHTML = "Kisses per Second: " + round(kissesPerSecond, 2).toLocaleString();
}

// Main game loop
window.setInterval(function () {
  // var t = window.performance.now();
  updateKissesPerGirlfriend();
  updateKissesPerSecond();
  kiss(kissesPerSecond / tickRate);
  // console.log(window.performance.now() - t);
}, 1000 / tickRate);
