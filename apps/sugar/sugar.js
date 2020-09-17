var foods = [];
var foodHistory = [];
var sugarMax = 0;

var addFoodForm = null;
var foodInput = null;
var sugarInput = null;
var addFoodButton = null;
var savedFoods = null;
var clearFoodsButton = null;
var savedHistory = null;
var clearHistoryButton = null;
var sugarEatenDisplay = null;
var sugarMaxDisplay = null;
var sugarRemainingDisplay = null;
var remainingOrOverDisplay = null;

document.addEventListener("DOMContentLoaded", function () {
  // Get elements by IDs
  addFoodForm = document.getElementById("add-food-form");
  foodInput = document.getElementById("food-input");
  sugarInput = document.getElementById("sugar-input");
  addFoodButton = document.getElementById("add-food");
  savedFoods = document.getElementById("saved-foods");
  clearFoodsButton = document.getElementById("clear-foods");
  sugarMaxInput = document.getElementById("sugar-max-input");
  savedHistory = document.getElementById("saved-history");
  clearHistoryButton = document.getElementById("clear-history");
  sugarEatenDisplay = document.getElementById("sugar-eaten");
  sugarRemainingDisplay = document.getElementById("sugar-remaining");
  remainingOrOverDisplay = document.getElementById("remaining-or-over");

  // Load from Web Storage
  if (typeof(Storage) !== "undefined") {
    if (localStorage.getItem("foods")) {
      foods = JSON.parse(localStorage.getItem("foods"));
    } else {
      clearFoods();
    }
    if (localStorage.getItem("foodHistory")) {
      foodHistory = JSON.parse(localStorage.getItem("foodHistory"));
    } else {
      clearHistory();
    }
    if (localStorage.getItem("sugarMax")) {
      sugarMax = parseInt(localStorage.getItem("sugarMax"));
      sugarMaxInput.value = sugarMax;
    } else {
      setSugarMax(0);
    }
  } else {
    // No Web Storage support :(
  }

  addFoodForm.addEventListener("submit", function(e) {
    e.preventDefault();
    if (foodInput.value && parseInt(sugarInput.value)) {
      addFood(foodInput.value.trim(), parseInt(sugarInput.value));
    }
  });
  sugarMaxInput.addEventListener("input", function() {
    setSugarMax(this.value ? parseInt(this.value) : 0);
    updateSugar(JSON.parse(localStorage.getItem("foodHistory")));
  });

  showSavedFoods(foods);
  showHistory(foodHistory);
  updateSugar(foodHistory);

  clearFoodsButton.addEventListener("click", clearFoods);
  clearHistoryButton.addEventListener("click", clearHistory);
}, false);

function addFood(foodName, sugar) {
  let food = {"food": foodName, "sugar": sugar};
  let foods;
  if (localStorage.getItem("foods") === null) {
    foods = [];
  } else {
    foods = JSON.parse(localStorage.getItem("foods"));
  }
  // don't allow duplicates
  for (var f of foods) {
    if (f.food.toLowerCase() == foodName.toLowerCase()) {
      return;
    }
  }
  foods.push(food);
  foods.sort((a, b) => {
    let fa = a.food.toLowerCase();
    let fb = b.food.toLowerCase();
    if (fa < fb) {return -1;}
    if (fa > fb) {return 1;}
    return 0;
  });
  localStorage.setItem("foods", JSON.stringify(foods));
  showSavedFoods(foods);
  foodInput.value = "";
  sugarInput.value = "";
  if (document.activeElement === sugarInput) {foodInput.focus();}
}

function showSavedFoods(foods) {
  while (savedFoods.firstChild) {savedFoods.firstChild.remove();}
  savedFoods.appendChild(makeFoodsList(foods));
  clearFoodsButton.disabled = foods.length == 0;
}

function makeFoodsList(array) {
  var list = document.createElement("div");
  for (var i = 0; i < array.length; i++) {
    var row = document.createElement("div");
    row.className = "saved-food-row";
    var remove = document.createElement("a");
    remove.className = "saved-food-remove";
    remove.href = "#";
    remove.dataset.index = i;
    remove.addEventListener("click", function(e) {
      e.preventDefault();
      removeFood(JSON.parse(localStorage.getItem("foods")), parseInt(this.dataset.index));
    });
    remove.appendChild(document.createTextNode("×"));
    row.appendChild(remove);
    var item = document.createElement("a");
    item.className = "saved-food";
    item.href = "#";
    item.dataset.food = array[i].food;
    item.dataset.sugar = array[i].sugar;
    item.addEventListener("click", function(e) {
      e.preventDefault();
      trackFood(this.dataset.food, parseInt(this.dataset.sugar));
    });
    var food = document.createElement("span");
    food.className = "saved-food-name";
    food.appendChild(document.createTextNode(array[i].food));
    item.appendChild(food);
    var sugar = document.createElement("span");
    sugar.className = "saved-food-sugar";
    sugar.appendChild(document.createTextNode(array[i].sugar + "g"));
    item.appendChild(sugar);
    row.appendChild(item);
    list.appendChild(row);
  }
  return list;
}

function makeHistoryList(array) {
  var list = document.createElement("div");
  for (var i = 0; i < array.length; i++) {
    var row = document.createElement("div");
    row.className = "history-row";
    var item = document.createElement("div");
    item.className = "history-item";
    var time = document.createElement("span");
    time.className = "history-time";
    time.appendChild(document.createTextNode(array[i].time));
    item.appendChild(time);
    var food = document.createElement("span");
    food.className = "history-food";
    food.appendChild(document.createTextNode(array[i].food));
    item.appendChild(food);
    var sugar = document.createElement("span");
    sugar.className = "history-sugar";
    sugar.dataset.sugar = array[i].sugar;
    sugar.appendChild(document.createTextNode(array[i].sugar + "g"));
    item.appendChild(sugar);
    row.appendChild(item);
    list.appendChild(row);
  }
  return list;
}

function removeFood(foods, index) {
  foods.splice(index, 1);
  localStorage.setItem("foods", JSON.stringify(foods));
  showSavedFoods(foods);
}

function clearFoods() {
  foods = [];
  localStorage.setItem("foods", JSON.stringify(foods));
  while (savedFoods.firstChild) {savedFoods.firstChild.remove();}
  clearFoodsButton.disabled = true;
}

function trackFood(food, sugar) {
  let entry = {"time": getTime(), "food": food, "sugar": sugar};
  let foodHistory;
  if (localStorage.getItem("foodHistory") === null) {
    foodHistory = [];
  } else {
    foodHistory = JSON.parse(localStorage.getItem("foodHistory"));
  }
  foodHistory.splice(0, 0, entry);
  localStorage.setItem("foodHistory", JSON.stringify(foodHistory));
  showHistory(foodHistory);
  updateSugar(foodHistory);
}

function getTime() {
  const today = new Date();
  var hours = today.getHours();
  var minutes = today.getMinutes();
  var amOrPm = hours >= 12 ? "pm" : "am";
  var hoursDisplay = hours % 12 ? hours % 12 : 12;
  var minutesDisplay = minutes >= 10 ? minutes : "0" + minutes;
  return hoursDisplay + ":" + minutesDisplay + " " + amOrPm;
}

function showHistory(foodHistory) {
  while (savedHistory.firstChild) {savedHistory.firstChild.remove();}
  savedHistory.appendChild(makeHistoryList(foodHistory));
  clearHistoryButton.disabled = foodHistory.length == 0;
}

function clearHistory() {
  foodHistory = [];
  localStorage.setItem("foodHistory", JSON.stringify(foodHistory));
  while (savedHistory.firstChild) {savedHistory.firstChild.remove();}
  updateSugar(foodHistory);
  clearHistoryButton.disabled = true;
}

function setSugarMax(max) {
  sugarMax = max;
  localStorage.setItem("sugarMax", sugarMax);
}

function updateSugar(foodHistory) {
  var sugarEaten = 0;
  for (var i = 0; i < foodHistory.length; i++) {
    sugarEaten += foodHistory[i].sugar;
  }
  var sugarRemaining = sugarMax - sugarEaten;
  sugarEatenDisplay.innerHTML = sugarEaten;
  sugarRemainingDisplay.innerHTML = Math.abs(sugarRemaining);
  remainingOrOverDisplay.innerHTML = sugarRemaining >= 0 ? "remaining" : "over";
}
