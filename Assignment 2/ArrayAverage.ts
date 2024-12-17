import promptSync = require("prompt-sync");

const prompt = promptSync();

function main() {
    const [lengthOfArray, numberOfQuery] = getInput("Enter array length and number of Queries (space-separated): ");
    const numberArray: number[] = getInput(`Enter ${lengthOfArray} array elements (space-separated): `);

    getAverage(lengthOfArray, numberOfQuery, numberArray);
}

function getInput(message: string) {
    return prompt(message).split(" ").map(Number);
}

function getAverage(lengthOfArray: number, numberOfQuery: number, numberArray: number[]) {
    let sumArray: number[] = new Array(lengthOfArray + 1).fill(0);
    sumArray = getSumArrayElements(sumArray, numberArray, lengthOfArray);
    processQuery(numberOfQuery, sumArray);
}

function getSumArrayElements(sumArray: number[], numberArray: number[], lengthOfArray: number) {
    for (let arrayIndex = 1; arrayIndex <= lengthOfArray; arrayIndex++) {
        sumArray[arrayIndex] = sumArray[arrayIndex - 1] + numberArray[arrayIndex - 1];
    }
    return sumArray;
}

function processQuery(numberOfQuery: number, sumArray: number[]) {
    for (let queryIndex = 0; queryIndex < numberOfQuery; queryIndex++) {
        const [leftIndex, rightIndex] = getInput(`Enter left index and right index for query ${queryIndex + 1} (space-separated): `);
        const average = calculateAverage(sumArray, leftIndex, rightIndex);
        console.log(`Average for query ${queryIndex + 1}: ${average}`);
    }
}

function calculateAverage(sumOfArray: number[], leftIndex: number, rightIndex: number) {
    return Math.floor((sumOfArray[rightIndex] - sumOfArray[leftIndex - 1]) / (rightIndex - leftIndex + 1));
}

main();