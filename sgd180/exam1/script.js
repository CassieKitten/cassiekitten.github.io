var output, current1, current2, currentAnswer;
var btnAdd, btnSubtract, btnMultiply, btnDivide, btnRandom, btnsList;
var streakText, correctText, accuracyText;
var numStreak = 0, numCorrect = 0, numTotal = 0, numAccuracy = 0;
var btnCurrent;

document.addEventListener("mousemove", onMouseMove, true);

function init() {
  output = document.getElementById("output");
  // output.style.minHeight = "0";

  outputText = document.getElementById("output-text");
  // outputText.innerHTML = outText;
  // output.style.display = "none";

  numGuessBox.value = "";
  numGuessBox.style.opacity = 0;
  // numGuessBox.placeholder = "Guess between " + minGuess + " and " + maxGuess + "!" + ((minGuess == maxGuess) ? " ;)" : "");
  // numGuessBox.disabled = false;
  // numGuessBox.focus();

  btnAdd = document.getElementById("btnAdd");
  btnSubtract = document.getElementById("btnSubtract");
  btnMultiply = document.getElementById("btnMultiply");
  btnDivide = document.getElementById("btnDivide");
  btnRandom = document.getElementById("btnRandom");

  btnsList = document.getElementsByName("btn");

  streakText = document.getElementById("streak-text");
  correctText = document.getElementById("correct-text");
  accuracyText = document.getElementById("accuracy-text");
}

function onMouseMove() {
  for (btn of btnsList) {
    btn.onmousemove = function() {
      this.focus();
    };
  }
}

function askAdd() {
  getCurrentNums();
  currentAnswer = current1 + current2;
  allowGuess("&plus;");
  setPlaceholder("");
}

function askSubtract() {
  getCurrentNums();
  currentAnswer = current1 - current2;
  allowGuess("&minus;");
  setPlaceholder("");
}

function askMultiply() {
  getCurrentNums();
  currentAnswer = current1 * current2;
  allowGuess("&times;");
  setPlaceholder("");
}

function askDivide() {
  getCurrentNums();
  currentAnswer = Math.floor(current1 / current2);
  allowGuess("&divide;");
  setPlaceholder("Round down");
}

function askRandom() {
  switch (Math.floor(Math.random() * 4)) {
    default:
    case 0:
      askAdd();
      break;
    case 1:
      askSubtract();
      break;
    case 2:
      askMultiply();
      break;
    case 3:
      askDivide();
      break;
  }
}

function getCurrentNums() {
  current1 = getRandom();
  current2 = getRandom();
}

function allowGuess(operator) {
  numGuessBox.disabled = false;
  numGuessBox.style.opacity = 1;
  numGuessBox.focus();
  for (btn of btnsList) {
    btn.disabled = true;
  }
  displayOutput("What is " + current1 + " " + operator + " " + current2 + "?");
}

function getRandom() {
  return Math.floor(Math.random() * 100) + 1;
}

function setPlaceholder(placeholderText) {
  numGuessBox.placeholder = placeholderText;
}

// function updateGuessDisplay() {
//   guessDisplay.innerHTML = guessesLeft.toString() + ((guessesLeft == 1) ? " guess" : " guesses") + " remaining";
// }

function displayOutput(outText) {
  outputText.innerHTML = outText;
  // output.style.display = "block";
}

// function disableButton(button, message) {
//   button.disabled = true;
//   button.className = "button-disabled";
//   button.innerHTML = message;
// }
//
// function enableButton(button, message) {
//   button.disabled = false;
//   button.className = "";
//   button.innerHTML = message;
// }

function clamp(min, val, max) {
  return Math.min(Math.max(min, val), max);
}

function checkGuess() {
  numGuess = numGuessBox.value;
  if (numGuess != ""){
    numTotal++;
    if (numGuess == currentAnswer) {
      numStreak++;
      numCorrect++;
      displayOutput("Yeah, it was " + currentAnswer + "!");
    } else {
      numStreak = 0;
      displayOutput("Sorry, it was " + currentAnswer + ".");
    }
    numAccuracy = Math.round(numCorrect / numTotal * 100);

    streakText.innerHTML = numStreak;
    correctText.innerHTML = numCorrect + " out of " + numTotal;
    accuracyText.innerHTML = numAccuracy + "%";

    numGuessBox.disabled = true;
    numGuessBox.style.opacity = 0;

    for (btn of btnsList) {
      btn.disabled = false;
    }
    btnCurrent.focus();

    numGuessBox.value = "";
  }

  // numGuessBox.focus();
  // setTimeout(function() {numGuessBox.select()}, 0);
  //
  // if (numGuess.value == "") numGuess.value = "0";
  //
  // var guess = parseInt(numGuess.value);
  //
  // guess = clamp(minGuess, guess, maxGuess);
  //
  // numGuessBox.value = guess.toString();
  //
  // if (guess == randomNum) {
  //   outText = "Yeah, it was " + guess + "! That took you " + guessCount + " guesses.";
  //   minGuess = guess;
  //   maxGuess = guess;
  //   disableButton(btnGuess, "You guessed it! :)");
  //   output.style.minHeight = "7em";
  //   btnReplay.style.display = "block";
  //   numGuessBox.blur();
  //   numGuessBox.disabled = true;
  // }
  // else if (guess < randomNum) {
  //   outText = "Try again; it's higher than " + guess + ".";
  //   guess++;
  //   minGuess = Math.max(minGuess, guess);
  // }
  // else {
  //   outText = "Try again; it's lower than " + guess + ".";
  //   guess--;
  //   maxGuess = Math.min(maxGuess, guess);
  // }
  //
  // if (guessesLeft <= 0 && guess != randomNum) {
  //   guessesLeft = 0;
  //   outText = "Sorry, it was " + randomNum + ".";
  //   disableButton(btnGuess, "Out of guesses! :(");
  //   output.style.minHeight = "7em";
  //   btnReplay.style.display = "block";
  //   numGuessBox.blur();
  //   numGuessBox.disabled = true;
  //   numGuessBox.value = "";
  //   numGuessBox.placeholder = "Better luck next time!";
  // } else {
  //   numGuessBox.value = guess.toString();
  //   numGuessBox.min = minGuess;
  //   numGuessBox.max = maxGuess;
  //   numGuessBox.placeholder = "Guess between " + minGuess + " and " + maxGuess + "!" + ((minGuess == maxGuess) ? " ;)" : "");
  // }
  //
  // updateGuessDisplay();
  //
  // displayOutput();
}
