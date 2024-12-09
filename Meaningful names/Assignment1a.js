"use strict";
exports.__esModule = true;
var promptSync = require("prompt-sync");
var prompt = promptSync();
function rollDie(sides) {
    return Math.floor(Math.random() * sides) + 1;
}
function main() {
    var sides = 6;
    var keepRolling = true;
    while (keepRolling) {
        var userInput = prompt("Ready to roll? Enter Q to Quit: ");
        if (userInput.toLowerCase() !== "q") {
            var roll = rollDie(sides);
            console.log("You have rolled a ".concat(roll));
        }
        else {
            keepRolling = false;
        }
    }
}
main();
