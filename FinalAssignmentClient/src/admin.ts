import { MenuConstants } from "./constants/menu.constant.js";
import Utils from "./utils.js";
import Menu from "./menu.js";
import axios from "axios";

export default class Admin {
    private utils: Utils;
    private menu: Menu;

    constructor() {
        this.utils = new Utils();
        this.menu = new Menu();
    }

    async handleAdminChoice(accessToken: string) {
        this.menu.showAdminOptions();
        const choice = await this.utils.askQuestion("Enter your choice: ");
        const menuActions: { [key: string]: (token: string) => Promise<void> } = {
            [MenuConstants.ONE]: this.viewAllExternalServers.bind(this),
            [MenuConstants.TWO]: this.viewExternalServerDetails.bind(this),
            [MenuConstants.THREE]: this.updateExternalServerDetails.bind(this),
            [MenuConstants.FOUR]: this.addNewsCategory.bind(this),
            [MenuConstants.FIVE]: async () => {
                console.log("Logging out...");
            }
        };
        const action = menuActions[choice];
        if (action) {
            await action(accessToken);
        } else {
            console.log("Invalid choice, please try again.");
            await this.handleAdminChoice(accessToken);
        }
    }

    async viewAllExternalServers(accessToken: string) {
        const response = await axios.get(`${process.env.BASE_URL}/admin/externalsource`, {
            withCredentials: true,
            headers: {
                Cookie: `accessToken=${accessToken}`
            }
        });
        this.utils.displayTable("External Server", response.data.data, ['serverName', 'status']);
        this.handleAdminChoice(accessToken);
    }

    async viewExternalServerDetails(accessToken: string) {
        const response = await axios.get(`${process.env.BASE_URL}/admin/externalsource`, {
            withCredentials: true,
            headers: {
                Cookie: `accessToken=${accessToken}`
            }
        });
        this.utils.displayTable("External Server", response.data.data, ['serverName', 'apiKey']);
        this.handleAdminChoice(accessToken);
    }

    async updateExternalServerDetails(accessToken: string) {
        const serverName = await this.utils.askQuestion('Enter the name of the server: ');
        const apiKey = await this.utils.askQuestion("Enter the new API key: ");
        const response = await axios.patch(`${process.env.BASE_URL}/admin/externalsource`,
            {
                serverName,
                apiKey
            },
            {
                withCredentials: true,
                headers: {
                    Cookie: `accessToken=${accessToken}`
                }
            });
        this.utils.displayTable("External Server", response.data.data, ['serverName', 'apiKey']);
        this.handleAdminChoice(accessToken);
    }

    async addNewsCategory(accessToken: string) {
        const category = await this.utils.askQuestion("Enter category: ");
        const status = await this.utils.askQuestion("Enter status: ");

        const response = await axios.post(`${process.env.BASE_URL}/admin/categories`,
            {
                category,
                status
            },
            {
                withCredentials: true,
                headers: {
                    Cookie: `accessToken=${accessToken}`
                }
            });
        this.utils.displayTable("External Server", response.data.data, ['category', 'status']);
        this.handleAdminChoice(accessToken);
    }
}