var tickRate = 10; // how many times per second the main game loop runs

var kisses = 0;
var happiness = 0;
var money = 0;
var girlfriends = 0;
var love = 0;

var workCost = 5; // how much happiness it costs to work
var dateCost = 20; // how much money it costs to date
var dateChance = .25; // chance to get a girlfriend from a date
var badDates = 0; // how many consecutive dates without getting a girlfriend
var maxBadDates = 3; // how many bad dates before automatically getting a girlfriend
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
    if (localStorage.girlfriends) {
      girlfriends = parseFloat(localStorage.girlfriends);
      updateGirlfriends();
    }
    if (localStorage.love) {
      love = parseFloat(localStorage.love);
      updateLove();
    }
    if (localStorage.badDates) {
      badDates = parseInt(localStorage.badDates);
    }
  } else {
    // No Web Storage support :(
  }
  updateKissesPerGirlfriend();
  updateKissesPerSecond();
}, false);

function promptReset() {
  if (window.confirm("This will reset all your stats to 0.\nThe game will restart from the beginning.\nAre you sure you want to reset?")) {
    reset();
  }
}

// Restarts the game, setting everything back to 0
function reset() {
  kisses = 0;
  happiness = 0;
  money = 0;
  girlfriends = 0;
  love = 0;
  updateKisses();
  updateHappiness();
  updateMoney();
  updateGirlfriends();
  updateLove();
  resetBadDates();
  localStorage.clear();
}

function kiss(number) {
  kisses += number;
  happiness += number;
  updateKisses();
  updateHappiness();
}

function work(number) {
  if (happiness >= workCost) {
    if (happiness < (workCost * number)) {
      number = Math.floor(happiness / workCost);
    }
    happiness -= (workCost * number);
    money += number;
    updateHappiness();
    updateMoney();
  }
}

function date(number) {
  if (money >= dateCost) {
    if (money < (dateCost * number)) {
      number = Math.floor(money / dateCost);
    }
    money -= (dateCost * number);
    if (number < 100) {
      for (var i = 0; i < number; i++) {
        if (Math.random() < dateChance || badDates >= maxBadDates) {
          girlfriends++;
          resetBadDates();
        } else {
          increaseBadDates();
        }
      }
    } else {
      girlfriends += Math.round(number / getAverageDatesPerGirlfriend());
    }
    updateMoney();
    updateGirlfriends();
    updateKissesPerSecond();
  }
}

// We need to approximate this for the Date All button because Chrome crashes
// if you try to generate 50 million random numbers in a row
function getAverageDatesPerGirlfriend() {
  return Math.min(1 / dateChance, maxBadDates + 1)
}

function gift(number) {
  if (money >= giftCost) {
    if (money < (giftCost * number)) {
      number = Math.floor(money / giftCost);
    }
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

function increaseBadDates() {
  badDates++;
  localStorage.badDates = badDates;
}

function resetBadDates() {
  badDates = 0;
  localStorage.badDates = badDates;
}

function updateKisses() {
  document.getElementById("kisses-stat").innerHTML = round(kisses, 0).toLocaleString();
  localStorage.kisses = kisses;
}

function updateHappiness() {
  document.getElementById("happiness-stat").innerHTML = round(happiness, 0).toLocaleString();
  localStorage.happiness = happiness;
}

function updateMoney() {
  document.getElementById("money-stat").innerHTML = "$" + round(money, 0).toLocaleString();
  localStorage.money = money;
}

function updateLove() {
  document.getElementById("love-stat").innerHTML = round(love, 0).toLocaleString();
  localStorage.love = love;
}

function updateGirlfriends() {
  document.getElementById("girlfriends-stat").innerHTML = round(girlfriends, 0).toLocaleString();
  localStorage.girlfriends = girlfriends;
}

function updateKissesPerGirlfriend() {
  kissesPerGirlfriend = 1 + (Math.pow(love, 4.0 / 3.0) / (love + 50));
  document.getElementById("kisses-per-girlfriend-stat").innerHTML = round(kissesPerGirlfriend, 2).toLocaleString();
}

function updateKissesPerSecond() {
  kissesPerSecond = girlfriends * kissesPerGirlfriend;
  document.getElementById("kisses-per-second-stat").innerHTML = round(kissesPerSecond, 2).toLocaleString();
}

// Main game loop
window.setInterval(function () {
  // var t = window.performance.now();
  updateKissesPerGirlfriend();
  updateKissesPerSecond();
  kiss(kissesPerSecond / tickRate);
  // console.log(window.performance.now() - t);
}, 1000 / tickRate);
