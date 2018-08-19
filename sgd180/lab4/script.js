var output;
var outText;
var randomNum;
var guessCount;
const MAX_GUESSES = 10;
var guessesLeft;
var guessDisplay;
var minGuess;
var maxGuess;
var btnGuess;
var numGuessBox;
var btnReplay;

function init() {
  output = document.getElementById("output");
  output.display = "none";
  output.style.minHeight = "0";

  outText = "";
  outputText = document.getElementById("output-text");
  outputText.innerHTML = outText;
  output.style.display = "none";

  randomNum = Math.floor(Math.random() * 100) + 1;

  minGuess = 1;
  maxGuess = 100;

  guessCount = 0;
  guessesLeft = MAX_GUESSES - guessCount;

  guessDisplay = document.getElementById("guess-display");
  updateGuessDisplay();

  btnGuess = document.getElementsByName("btnGuess")[0];
  numGuessBox = document.getElementsByName("numGuess")[0];
  btnReplay = document.getElementById("replay");

  enableButton(btnGuess, "Guess!");
  numGuessBox.value = "";
  numGuessBox.placeholder = "Guess between " + minGuess + " and " + maxGuess + "!" + ((minGuess == maxGuess) ? " ;)" : "");
  numGuessBox.disabled = false;
  numGuessBox.focus();

  btnReplay.style.display = "none";
}

function updateGuessDisplay() {
  guessDisplay.innerHTML = guessesLeft.toString() + ((guessesLeft == 1) ? " guess" : " guesses") + " remaining";
}

function displayOutput() {
  outputText.innerHTML = outText;
  output.style.display = "block";
}

function disableButton(button, message) {
  button.disabled = true;
  button.className = "button-disabled";
  button.innerHTML = message;
}

function enableButton(button, message) {
  button.disabled = false;
  button.className = "";
  button.innerHTML = message;
}

function clamp(min, val, max) {
  return Math.min(Math.max(min, val), max);
}

function guess(numGuess) {
  guessCount++;
  guessesLeft = MAX_GUESSES - guessCount;

  outText = "";

  numGuessBox.focus();
  setTimeout(function() {numGuessBox.select()}, 0);

  if (numGuess.value == "") numGuess.value = "0";

  var guess = parseInt(numGuess.value);

  guess = clamp(minGuess, guess, maxGuess);

  numGuessBox.value = guess.toString();

  if (guess == randomNum) {
    outText = "Yeah, it was " + guess + "! That took you " + guessCount + " guesses.";
    minGuess = guess;
    maxGuess = guess;
    disableButton(btnGuess, "You guessed it! :)");
    output.style.minHeight = "7em";
    btnReplay.style.display = "block";
    numGuessBox.blur();
    numGuessBox.disabled = true;
  }
  else if (guess < randomNum) {
    outText = "Try again; it's higher than " + guess + ".";
    guess++;
    minGuess = Math.max(minGuess, guess);
  }
  else {
    outText = "Try again; it's lower than " + guess + ".";
    guess--;
    maxGuess = Math.min(maxGuess, guess);
  }

  if (guessesLeft <= 0 && guess != randomNum) {
    guessesLeft = 0;
    outText = "Sorry, it was " + randomNum + ".";
    disableButton(btnGuess, "Out of guesses! :(");
    output.style.minHeight = "7em";
    btnReplay.style.display = "block";
    numGuessBox.blur();
    numGuessBox.disabled = true;
    numGuessBox.value = "";
    numGuessBox.placeholder = "Better luck next time!";
  } else {
    numGuessBox.value = guess.toString();
    numGuessBox.min = minGuess;
    numGuessBox.max = maxGuess;
    numGuessBox.placeholder = "Guess between " + minGuess + " and " + maxGuess + "!" + ((minGuess == maxGuess) ? " ;)" : "");
  }

  updateGuessDisplay();

  displayOutput();
}
