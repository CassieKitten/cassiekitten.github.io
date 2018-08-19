// function tellStory() {
//   // Get variables & make strings
//   var name1 = document.getElementById("txtName1").value;
//   var name2 = document.getElementById("txtName2").value;
//   var geol = document.getElementById("txtGeol").value;
//   var verb = document.getElementById("txtVerb").value;
//   var container = document.getElementById("txtContainer").value;
//   var liquid = document.getElementById("txtLiquid").value;
//   var bodyPart = document.getElementById("txtBodyPart").value;
//   var gerund = document.getElementById("txtGerund").value;
//
//   // Update story
//   var story = document.getElementById("story");
//   var storyText = name1 + " and " + name2 + " went up the " + geol + "<br>";
//       storyText += "to " + verb + " a " + container + " of " + liquid + "<br>";
//       storyText += name1 + " fell down and broke her " + bodyPart + "<br>";
//       storyText += "and " + name2 + " came " + gerund + " after";
//
//   story.innerHTML = storyText;
//
// }

var output;
var outText = "";
var randomNum = 0;

window.onload = function init() {
  output = document.getElementById("output");
  randomNum = Math.round(Math.random() * 10);
}

function displayOutput() {
  output.innerHTML = outText;
  output.style.display = "block";
}

function clamp(min, val, max) {
  return Math.min(Math.max(min, val), max);
}

function count(numStart, numEnd) {
  outText = "";

  if (numStart.value == "") numStart.value = "0";
  if (numEnd.value == "") numEnd.value = "0";

  var start = parseInt(numStart.value);
  var end = parseInt(numEnd.value);

  start = clamp(0, start, 1000);
  end = clamp(start, end, 1000);

  document.getElementsByName("numStart")[0].value = start.toString();
  document.getElementsByName("numEnd")[0].value = end.toString();

  for (var i = start; i < end; i++) {
    outText += i + "&nbsp;&nbsp; ";
  }
  outText += end + "&nbsp;&nbsp;";
  displayOutput();
}

function yearsToDays(ageYears) {
  outText = "";

  if (ageYears.value == "") ageYears.value = "0";

  var years = parseInt(ageYears.value);

  years = clamp(0, years, 150);

  document.getElementsByName("ageYears")[0].value = years.toString();

  outText = "If you're " + years + ", that means you're over " + years * 365 + " days old!";
  displayOutput();
}

function guess(numGuess) {
  outText = "";

  if (numGuess.value == "") numGuess.value = "0";

  var guess = parseInt(numGuess.value);

  guess = clamp(0, guess, 10);

  document.getElementsByName("numGuess")[0].value = guess.toString();

  if (guess == randomNum) outText = "Yeah, it was " + guess + "!";
  else if (guess < randomNum) outText = "Try again; it's higher than " + guess + ".";
  else outText = "Try again; it's lower than " + guess + ".";
  displayOutput();
}
