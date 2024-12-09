"use strict";
exports.__esModule = true;
var promptSync = require("prompt-sync");
var prompt = promptSync();
function isValidNumber(input) {
    var num = parseInt(input, 10);
    return !isNaN(num) && num >= 1 && num <= 100;
}
function main() {
    var randomNumber = Math.floor(Math.random() * 100) + 1;
    var guessedCorrectly = false;
    var numberOfGuesses = 0;
    var guess = prompt("Guess a number between 1 and 100: ");
    while (!guessedCorrectly) {
        if (!isValidNumber(guess)) {
            guess = prompt("I won't count this one. Please enter a number between 1 and 100: ");
            continue;
        }
        numberOfGuesses++;
        guess = parseInt(guess, 10);
        if (guess < randomNumber) {
            guess = prompt("Too low. Guess again: ");
        }
        else if (guess > randomNumber) {
            guess = prompt("Too high. Guess again: ");
        }
        else {
            console.log("You guessed it in ".concat(numberOfGuesses, " guesses!"));
            guessedCorrectly = true;
        }
    }
}
main();
