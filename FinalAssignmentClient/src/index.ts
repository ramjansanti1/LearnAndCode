import axios from "axios";
import express from 'express';
import readline from 'readline';

let accessToken: string = '';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const app = express();

function askQuestion(query: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
}

function giveAuthChoices() {
    console.log("1. Login");
    console.log("2. Sign up");
    console.log("3. Exit");
}

async function login() {
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
            showAdminOptions();
        } else {
            showUserOptions();
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error("Login failed:", error.response?.data?.message || error.message);
        } else {
            console.error("Unexpected error:", error.message);
        }
    }
}

async function signup() {
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

async function showAdminOptions() {
    console.log("1. View the list of external servers and status\n2. View the external server's details\n3. Update/Edit the external server's details\n4. Add new News Category\n5. Logout");
    await handleAdminChoice();
}

async function handleAdminChoice() {
    const choice = await askQuestion("Enter your choice: ");

    switch (choice) {
        case '1':
            await viewAllExternalServers();
            break;
        case '2':
            await viewExternalServerDetails();
            break;
        case '3':
            await updateExternalServerDetails();
            break;
        case '4':
            await addNewsCategory();
            break;
        case '5':
            console.log("Logging out...");
            rl.close();
            break;
        default:
            console.log("Invalid choice, please try again.");
            await handleAdminChoice();
    }
}

async function viewAllExternalServers() {
    const response = await axios.get('http://localhost:4040/admin/externalsource', {
        withCredentials: true,
        headers: {
            Cookie: `accessToken=${accessToken}`
        }
    });
    response.data.data.forEach((server: any) => {
        console.log("-----------------------------------------");
        console.log(`Server Name: ${server.serverName}`);
        console.log(`Status: ${server.status}`);
        console.log("-----------------------------------------");
    });
    handleAdminChoice();
}

async function viewExternalServerDetails() {
    const response = await axios.get('http://localhost:4040/admin/externalsource', {
        withCredentials: true,
        headers: {
            Cookie: `accessToken=${accessToken}`
        }
    });
    response.data.data.forEach((server: any) => {
        console.log("-----------------------------------------");
        console.log(`Server Name: ${server.serverName}`);
        console.log(`API Key: ${server.apiKey}`);
        console.log("-----------------------------------------");
    });
    handleAdminChoice();
}

async function updateExternalServerDetails() {
    const serverName = await askQuestion('Enter the name of the server: ');
    const apiKey = await askQuestion("Enter the new API key: ");
    const response = await axios.patch('http://localhost:4040/admin/externalsource',
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
    console.log("-----------------------------------------");
    console.log(`Server Name: ${response.data.data.serverName}`);
    console.log(`Updated API Key: ${response.data.data.apiKey}`);
    console.log("-----------------------------------------");
    handleAdminChoice();
}

async function addNewsCategory() {
    const category = await askQuestion("Enter category: ");
    const status = await askQuestion("Enter status: ");

    const response = await axios.post('http://localhost:4040/admin/categories',
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
    console.log("-----------------------------------------");
    console.log(`Category: ${response.data.data.category}`);
    console.log(`Status: ${response.data.data.status}`);
    console.log("-----------------------------------------");
    handleAdminChoice();
}

function showUserOptions() {
    console.log("1. Headlines\n2. Saved Articles\n3. Search\n4. Notifications\n5. Logout");
}

async function runApplication() {
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
            rl.close();
            break;
        default:
            console.log("Invalid choice");
            rl.close();
    }
}

(async () => {
    try {
        app.listen(5500, () => {
            console.log(`The server is listening on PORT`);
            runApplication();
        });
    } catch (error) {
        console.log(error);
    }
})();