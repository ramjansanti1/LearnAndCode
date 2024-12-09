"use strict";
exports.__esModule = true;
var promptSync = require("prompt-sync");
var prompt = promptSync();
function calculateArmstrongNumber(useInput) {
    var armstrongNumber = 0;
    var digitCount = 0;
    var tempInput = useInput;
    while (tempInput > 0) {
        digitCount++;
        tempInput = Math.floor(tempInput / 10);
    }
    tempInput = useInput;
    while (tempInput > 0) {
        var remainder = tempInput % 10;
        armstrongNumber += Math.pow(remainder, digitCount);
        tempInput = Math.floor(tempInput / 10);
    }
    return armstrongNumber;
}
function main() {
    var useInput = parseInt(prompt("\nPlease enter the number to check for Armstrong: "));
    if (isNaN(useInput) || useInput <= 0) {
        console.log("Invalid input. Please enter a positive integer.");
    }
    else {
        if (useInput === calculateArmstrongNumber(useInput)) {
            console.log("\n".concat(useInput, " is an Armstrong number.\n"));
        }
        else {
            console.log("\n".concat(useInput, " is not an Armstrong number.\n"));
        }
    }
}
main();
