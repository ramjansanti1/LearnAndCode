import askQuestion from "./userInput.js";
import axios from "axios";
import Menu from "./menu.js";
import Admin from "./admin.js";
import User from "./user.js";

export default class Auth {
    private accessToken: string = '';
    private menu: Menu;
    private admin: Admin;
    private user: User;

    constructor() {
        this.menu = new Menu();
        this.admin = new Admin();
        this.user = new User();
    }

    async login() {
        const email = await askQuestion("Enter email: ");
        const password = await askQuestion("Enter password: ");
        try {
            const response = await axios.post(`${process.env.BASE_URL}/user/login`, {
                email,
                password
            });
            console.log("Login successful!");
            this.accessToken = response.data.data.accessToken;
            if (response.data.data.userFromDatabase.isAdmin) {
                this.menu.showAdminOptions();
                await this.admin.handleAdminChoice(this.accessToken);
            } else {
                this.menu.showUserOptions();
                await this.user.handleUserChoice(this.accessToken);
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                console.error("Login failed:", error.response?.data?.message || error.message);
            } else {
                console.error("Unexpected error:", error.message);
            }
        }
    }

    async signup() {
        const userName = await askQuestion("Enter username: ");
        const email = await askQuestion("Enter email: ");
        const password = await askQuestion("Enter password: ");
        try {
            await axios.post(`${process.env.BASE_URL}/user/signup`, {
                userName,
                email,
                password
            });
            console.log("signup successful!");
            console.log("Please login to continue");
            this.login();
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                console.error("Login failed:", error.response?.data?.message || error.message);
            } else {
                console.error("Unexpected error:", error.message);
            }
        }
    }

    clearToken() {
        this.accessToken = '';
    }
}