import promptSync = require("prompt-sync");

const prompt = promptSync();

function main(): void {
    const randomNumber = getRandomNumber();
    playGame(randomNumber);
}

function getRandomNumber(): number {
    return Math.floor(Math.random() * 100) + 1;
}

function playGame(randomNumber: number): void {
    let guessedCorrectly = false;
    let numberOfGuesses = 0;

    while (!guessedCorrectly) {
        let guess = promptUser("Guess a number between 1 and 100:");
        
        if (!guess || !isValidNumber(guess)) {
            console.log("I won't count this one. Please enter a number between 1 and 100.");
            continue;
        }

        numberOfGuesses++;
        guessedCorrectly = checkGuess(guess, randomNumber);

        if (guessedCorrectly) {
            console.log(`You guessed it in ${numberOfGuesses} guesses!`);
        }
    }
}

function promptUser(message: string): string | null {
    return prompt(message);
}

function isValidNumber(s: string): boolean {
    const num = parseInt(s, 10);
    return !isNaN(num) && num >= 1 && num <= 100;
}

function checkGuess(guess: string | null, randomNumber: number): boolean {
    const guessedNumber = parseInt(guess as string, 10);
    
    if (guessedNumber < randomNumber) {
        console.log("Too low. Guess again.");
        return false;
    } else if (guessedNumber > randomNumber) {
        console.log("Too high. Guess again.");
        return false;
    } else {
        console.log(`You guessed it! The number was ${randomNumber}.`);
        return true;
    }
}

main();