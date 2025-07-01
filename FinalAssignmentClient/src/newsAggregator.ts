import Menu from "./menu.js";
import Auth from "./auth.js";
import Utils from "./utils.js";
import { MenuConstants } from "./constants/menu.constant.js";

export default class NewsAggregator {
    private menu: Menu;
    private auth: Auth;
    private utils: Utils;

    constructor() {
        this.menu = new Menu();
        this.auth = new Auth();
        this.utils = new Utils();
    }

    async runApplication() {
        console.log("Welcome to the News Aggregator application. Please choose the options below.");
        this.menu.showAuthOptions();
        const choice = await this.utils.askQuestion("Enter your choice: ");
        const menuActions: { [key: string]: () => Promise<void> } = {
            [MenuConstants.ONE]: this.auth.login.bind(this),
            [MenuConstants.TWO]: this.auth.signup.bind(this),
            [MenuConstants.THREE]: async () => {
                console.log("Goodbye");
            }
        };
        const action = menuActions[choice];
        if (action) {
            await action();
        } else {
            console.log("Invalid choice, please try again.");
            await this.runApplication();
        }
    }
}