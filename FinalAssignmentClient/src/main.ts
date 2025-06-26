import { giveAuthChoices } from "./choice.js";
import askQuestion from "./userInput.js";
import { login, signup } from "./authFunctions.js";

export default async function runApplication() {
    console.log("Welcome to the News Aggregator application. Please choose the options below.");
    giveAuthChoices();
    const choice = await askQuestion("Enter your choice: ");

    switch (choice) {
        case '1':
            await login();
            break;
        case '2':
            await signup();
            break;
        case '3':
            console.log("Goodbye!");
            break;
        default:
            console.log("Invalid choice");
    }
}