import promptSync = require("prompt-sync");

const prompt = promptSync();

function main() {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    let guessedCorrectly = false;
    let numberOfGuesses = 0;

    let userGuess: string | number = prompt("Guess a number between 1 and 100: ");

    while (!guessedCorrectly) {
        if (!isValidNumber(userGuess as string)) {
            userGuess = prompt("I won't count this one. Please enter a number between 1 and 100: ");
            continue;
        }

        numberOfGuesses++;
        userGuess = parseInt(userGuess as string, 10);

        if (userGuess < randomNumber) {
            userGuess = prompt("Too low. Guess again: ");
        } else if (userGuess > randomNumber) {
            userGuess = prompt("Too high. Guess again: ");
        } else {
            console.log(`You guessed it in ${numberOfGuesses} guesses!`);
            guessedCorrectly = true;
        }
    }
}

function isValidNumber(input: string): boolean {
    const num = parseInt(input, 10);
    return !isNaN(num);
}

main();
