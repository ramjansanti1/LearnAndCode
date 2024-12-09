import promptSync from 'prompt-sync';
const prompt = promptSync();
import { countSameDivisorPairs } from "./FactorProblem.js";

(() => {
    const t = parseInt(prompt("Enter number of test cases: "));
    let resultArray: number[] = [];
    for (let i = 0; i < t; i++) {
        let ks = parseInt(prompt(`Enter k for test case ${i + 1}: `));
        resultArray.push(countSameDivisorPairs(ks));
    }
    console.log(resultArray);
})();