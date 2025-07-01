import axios from "axios";
import Auth from "./auth.js";
import Menu from "./menu.js";
import Utils from "./utils.js";
import { MenuConstants } from "./constants/menu.constant.js";

export default class User {
    private auth: Auth;
    private menu: Menu;
    private utils: Utils;

    constructor() {
        this.auth = new Auth();
        this.menu = new Menu();
        this.utils = new Utils();
    }

    async handleUserChoice(accessToken: string) {
        this.menu.showUserOptions();
        const choice = await this.utils.askQuestion("Enter your choice: ");
        const menuActions: { [key: string]: (token: string) => Promise<void> } = {
            [MenuConstants.ONE]: this.getNews.bind(this),
            [MenuConstants.TWO]: this.getSavedArticles.bind(this),
            [MenuConstants.THREE]: this.getNewsByQuery.bind(this),
            [MenuConstants.FOUR]: this.getNotifications.bind(this),
            [MenuConstants.FIVE]: this.changePassword.bind(this),
            [MenuConstants.SIX]: async () => {
                console.log("Logging out...");
            }
        };
        const action = menuActions[choice];
        if (action) {
            await action(accessToken);
        } else {
            console.log("Invalid choice, please try again.");
            await this.handleUserChoice(accessToken);
        }
    }

    async getNews(accessToken: string) {
        const response = await axios.get(`${process.env.BASE_URL}/news`, {
            withCredentials: true,
            headers: {
                Cookie: `accessToken=${accessToken}`
            }
        });
        this.utils.displayTable("External Server", response.data.data, ['title', 'content', 'url']);
        this.handleUserChoice(accessToken);
    }

    async getSavedArticles(accessToken: string) {
        const response = await axios.get(`${process.env.BASE_URL}/news/save`, {
            withCredentials: true,
            headers: {
                Cookie: `accessToken=${accessToken}`
            }
        });
        this.utils.displayTable("External Server", response.data.data, ['title', 'content', 'url']);
        this.handleUserChoice(accessToken);
    }

    async getNewsByQuery(accessToken: string) {
        const searchQuery = await this.utils.askQuestion("Enter the search query: ");
        const response = await axios.get(`${process.env.BASE_URL}/news?searchQuery=${searchQuery}`, {
            withCredentials: true,
            headers: {
                Cookie: `accessToken=${accessToken}`
            }
        });
        this.utils.displayTable("External Server", response.data.data, ['title', 'content', 'url']);
        this.handleUserChoice(accessToken);
    }

    async getNotifications(accessToken: string) {
        const response = await axios.get(`${process.env.BASE_URL}/notification`, {
            withCredentials: true,
            headers: {
                Cookie: `accessToken=${accessToken}`
            }
        });
        this.utils.displayTable("External Server", response.data.data, ['title', 'content', 'url']);
        this.handleUserChoice(accessToken);
    }

    async changePassword(accessToken: string) {
        try {
            const userName = await this.utils.askQuestion("Enter username: ");
            const oldPassword = await this.utils.askQuestion("Enter email: ");
            const newPassword = await this.utils.askQuestion("Enter password: ");
            await axios.post(`${process.env.BASE_URL}/user/changepassword`, {
                userName,
                oldPassword,
                newPassword
            });
            console.log("password changed successful!");
            console.log("Please login to continue");
            this.auth.clearToken();
            this.auth.login();
        } catch (error) {
            console.log("Error changing password");
            this.handleUserChoice(accessToken);
        }
    }
}