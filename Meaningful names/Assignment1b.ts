import promptSync = require("prompt-sync");

const prompt = promptSync();

function isValidNumber(input: string): boolean {
    const num = parseInt(input, 10);
    return !isNaN(num) && num >= 1 && num <= 100;
}

function main() {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    let guessedCorrectly = false;
    let numberOfGuesses = 0;

    let UserGuess: string | number = prompt("Guess a number between 1 and 100: ");

    while (!guessedCorrectly) {
        if (!isValidNumber(UserGuess as string)) {
            UserGuess = prompt("I won't count this one. Please enter a number between 1 and 100: ");
            continue;
        }

        numberOfGuesses++;
        UserGuess = parseInt(UserGuess as string, 10);

        if (UserGuess < randomNumber) {
            UserGuess = prompt("Too low. Guess again: ");
        } else if (UserGuess > randomNumber) {
            UserGuess = prompt("Too high. Guess again: ");
        } else {
            console.log(`You guessed it in ${numberOfGuesses} guesses!`);
            guessedCorrectly = true;
        }
    }
}

main();
