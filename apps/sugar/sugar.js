var foods = [];
var history = [];

var addFoodForm = null;
var foodInput = null;
var sugarInput = null;
var addFoodButton = null;
var savedFoods = null;
var clearFoodsButton = null;

document.addEventListener("DOMContentLoaded", function () {
  // Get elements by IDs
  addFoodForm = document.getElementById("add-food-form");
  foodInput = document.getElementById("food-input");
  sugarInput = document.getElementById("sugar-input");
  addFoodButton = document.getElementById("add-food");
  savedFoods = document.getElementById("saved-foods");
  clearFoodsButton = document.getElementById("clear-foods");

  // Load from Web Storage
  if (typeof(Storage) !== "undefined") {
    if (localStorage.getItem("foods")) {
      foods = JSON.parse(localStorage.getItem("foods"));
    } else {
      clearFoods();
    }
    if (localStorage.getItem("history")) {
      history = localStorage.getItem("history");
    }
  } else {
    // No Web Storage support :(
  }

  addFoodForm.addEventListener("submit", function(e) {
    e.preventDefault();
    if (foodInput.value && parseInt(sugarInput.value)) {
      addFood(foodInput.value, parseInt(sugarInput.value));
    }
  });

  if (foods.length) {
    savedFoods.appendChild(makeUL(foods));
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
  foods.push(food);
  foods.sort((a, b) => {
    let fa = a.food.toLowerCase();
    let fb = b.food.toLowerCase();
    if (fa < fb) {return -1;}
    if (fa > fb) {return 1;}
    return 0;
  });
  localStorage.setItem("foods", JSON.stringify(foods));
  while (savedFoods.firstChild) {savedFoods.firstChild.remove();}
  savedFoods.appendChild(makeUL(foods));
  clearFoodsButton.disabled = false;
  foodInput.value = "";
  sugarInput.value = "";
  if (document.activeElement === sugarInput) {foodInput.focus();}
}

function makeUL(array) {
  var list = document.createElement("div");
  for (var i = 0; i < array.length; i++) {
    var item = document.createElement("a");
    item.className = "saved-food";
    // var a = document.createElement("a");
    // a.className = "eat-link";
    item.href = "#";
    // a.appendChild(item);
    var food = document.createElement("span");
    food.className = "saved-food-name";
    food.appendChild(document.createTextNode(array[i]["food"]));
    item.appendChild(food);
    var sugar = document.createElement("span");
    sugar.className = "saved-food-sugar";
    sugar.appendChild(document.createTextNode(array[i]["sugar"] + "g"));
    item.appendChild(sugar);
    list.appendChild(item);
  }
  return list;
}

function clearFoods() {
  foods = [];
  localStorage.setItem("foods", JSON.stringify(foods));
  while (savedFoods.firstChild) {savedFoods.firstChild.remove();}
  clearFoodsButton.disabled = true;
}
