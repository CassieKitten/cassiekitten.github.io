var foods = [];
var history = [];

var addFoodForm = null;
var foodInput = null;
var sugarInput = null;
var addFoodButton = null;
var savedFoods = null;
var clearFoodsButton = null;
var savedHistory = null;
var clearHistoryButton = null;

document.addEventListener("DOMContentLoaded", function () {
  // Get elements by IDs
  addFoodForm = document.getElementById("add-food-form");
  foodInput = document.getElementById("food-input");
  sugarInput = document.getElementById("sugar-input");
  addFoodButton = document.getElementById("add-food");
  savedFoods = document.getElementById("saved-foods");
  clearFoodsButton = document.getElementById("clear-foods");
  savedHistory = document.getElementById("saved-history");
  clearHistoryButton = document.getElementById("clear-history");

  // Load from Web Storage
  if (typeof(Storage) !== "undefined") {
    if (localStorage.getItem("foods")) {
      foods = JSON.parse(localStorage.getItem("foods"));
    } else {
      clearFoods();
    }
    if (localStorage.getItem("history")) {
      history = JSON.parse(localStorage.getItem("history"));
    } else {
      clearHistory();
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

  if (foods.length) {
    savedFoods.appendChild(makeFoodsList(foods));
    clearFoodsButton.disabled = false;
  }

  clearFoodsButton.addEventListener("click", clearFoods);
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

function removeFood(foods, index) {
  foods.splice(index, 1);
  localStorage.setItem("foods", JSON.stringify(foods));
  showSavedFoods(foods);
}

function clearFoods() {
  // delete foods;
  foods = [];
  localStorage.setItem("foods", JSON.stringify(foods));
  while (savedFoods.firstChild) {savedFoods.firstChild.remove();}
  clearFoodsButton.disabled = true;
}

function clearHistory() {
  delete history;
  history = [];
  localStorage.setItem("history", JSON.stringify(history));
  while (savedHistory.firstChild) {savedHistory.firstChild.remove();}
  clearHistoryButton.disabled = true;
}
