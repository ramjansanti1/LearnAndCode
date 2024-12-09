import promptSync = require("prompt-sync");

const prompt = promptSync();

function calculateArmstrongNumber(useInput: number): number {
    let armstrongNumber = 0;
    let digitCount = 0;
    let tempInput = useInput;

    while (tempInput > 0) {
        digitCount++;
        tempInput = Math.floor(tempInput / 10);
    }

    tempInput = useInput;

    while (tempInput > 0) {
        const remainder = tempInput % 10;
        armstrongNumber += Math.pow(remainder, digitCount);
        tempInput = Math.floor(tempInput / 10);
    }

    return armstrongNumber;
}

function main() {
    const useInput = parseInt(prompt("\nPlease enter the number to check for Armstrong: "));

    if (isNaN(useInput) || useInput <= 0) {
        console.log("Invalid input. Please enter a positive integer.");
    } else {
        if (useInput === calculateArmstrongNumber(useInput)) {
            console.log(`\n${useInput} is an Armstrong number.\n`);
        } else {
            console.log(`\n${useInput} is not an Armstrong number.\n`);
        }
    }
}

main();
