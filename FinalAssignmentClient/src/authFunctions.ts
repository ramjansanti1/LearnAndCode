import askQuestion from "./userInput.js";
import axios from "axios";
import { showAdminOptions, showUserOptions } from "./choice.js";

let accessToken: string = '';

export async function login() {
    const email = await askQuestion("Enter email: ");
    const password = await askQuestion("Enter password: ");

    try {
        const response = await axios.post('http://localhost:4040/user/login', {
            email,
            password
        });
        console.log("Login successful!");
        accessToken = response.data.data.accessToken;
        if (response.data.data.userFromDatabase.isAdmin) {
            showAdminOptions(accessToken);
        } else {
            showUserOptions(accessToken);
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error("Login failed:", error.response?.data?.message || error.message);
        } else {
            console.error("Unexpected error:", error.message);
        }
    }
}

export async function signup() {
    const userName = await askQuestion("Enter username: ");
    const email = await askQuestion("Enter email: ");
    const password = await askQuestion("Enter password: ");

    try {
        const response = await axios.post('http://localhost:4040/user/signup', {
            userName,
            email,
            password
        });
        console.log("signup successful!");
        console.log("Please login to continue");
        login();
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error("Login failed:", error.response?.data?.message || error.message);
        } else {
            console.error("Unexpected error:", error.message);
        }
    }
}