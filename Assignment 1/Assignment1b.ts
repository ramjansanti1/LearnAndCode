import promptSync = require("prompt-sync");

const prompt = promptSync();

function main(): void {
    const cubeSides = 6;
    let keepRolling = true;

    while (keepRolling) {
        const userInput = prompt("Ready to roll? Enter Q to Quit: ");

        if (userInput.toLowerCase() !== "q") {
            const rollDieResult = rollDie(cubeSides);
            console.log(`You have rolled a ${rollDieResult}`);
        } else {
            keepRolling = false;
        }
    }
}

function rollDie(sides: number): number {
    return Math.floor(Math.random() * sides) + 1;
}

main();
