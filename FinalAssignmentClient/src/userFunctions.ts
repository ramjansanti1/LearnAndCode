import askQuestion from "./userInput.js";
import axios from "axios";
import { login } from "./authFunctions.js";

export async function handleUserChoice(accessToken: string) {
    const choice = await askQuestion("Enter your choice: ");

    switch (choice) {
        case '1':
            await getNews(accessToken);
            break;
        case '2':
            await getSavedArticles(accessToken);
            break;
        case '3':
            await getNewsByQuery(accessToken);
            break;
        case '4':
            await getNotifications(accessToken);
            break;
        case '5':
            await changePassword(accessToken);
            break;
        case '6':
            console.log("Logging out...");
            break;
        default:
            console.log("Invalid choice, please try again.");
            await handleUserChoice(accessToken);
    }
}

async function getNews(accessToken: string) {
    const response = await axios.get('http://localhost:4040/news', {
        withCredentials: true,
        headers: {
            Cookie: `accessToken=${accessToken}`
        }
    });
    response.data.data.forEach((article: any) => {
        console.log('\n');
        console.log("----------------------------------------------------------------------------------------");
        console.log(`Headline: ${article.title}`);
        console.log(`Content: ${article.content}`);
        console.log(`URL: ${article.url}`);
        console.log("----------------------------------------------------------------------------------------");
    });
    handleUserChoice(accessToken);
}

async function getSavedArticles(accessToken: string) {
    const response = await axios.get('http://localhost:4040/news/save', {
        withCredentials: true,
        headers: {
            Cookie: `accessToken=${accessToken}`
        }
    });
    response.data.data.forEach((article: any) => {
        console.log('\n');
        console.log("----------------------------------------------------------------------------------------");
        console.log(`Headline: ${article.title}`);
        console.log(`Content: ${article.content}`);
        console.log(`URL: ${article.url}`);
        console.log("----------------------------------------------------------------------------------------");
    });
    handleUserChoice(accessToken);
}

async function getNewsByQuery(accessToken: string) {
    const searchQuery = await askQuestion("Enter the search query: ");
    const response = await axios.get(`http://localhost:4040/news?searchQuery=${searchQuery}`, {
        withCredentials: true,
        headers: {
            Cookie: `accessToken=${accessToken}`
        }
    });
    response.data.data.forEach((article: any) => {
        console.log('\n');
        console.log("----------------------------------------------------------------------------------------");
        console.log(`Headline: ${article.title}`);
        console.log(`Content: ${article.content}`);
        console.log(`URL: ${article.url}`);
        console.log("----------------------------------------------------------------------------------------");
    });
    handleUserChoice(accessToken);
}

async function getNotifications(accessToken: string) {
    const response = await axios.get(`http://localhost:4040/notification`, {
        withCredentials: true,
        headers: {
            Cookie: `accessToken=${accessToken}`
        }
    });
    response.data.data.forEach((article: any) => {
        console.log('\n');
        console.log("----------------------------------------------------------------------------------------");
        console.log(`Headline: ${article.title}`);
        console.log(`Content: ${article.content}`);
        console.log(`URL: ${article.url}`);
        console.log("----------------------------------------------------------------------------------------");
    });
    handleUserChoice(accessToken);
}

async function changePassword(accessToken: string) {
    try {
        const userName = await askQuestion("Enter username: ");
        const oldPassword = await askQuestion("Enter email: ");
        const newPassword = await askQuestion("Enter password: ");

        const response = await axios.post('http://localhost:4040/user/changepassword', {
            userName,
            oldPassword,
            newPassword
        });
        console.log("password changed successful!");
        console.log("Please login to continue");
        login();
    } catch (error) {
        console.log("Error changing password");
        handleUserChoice(accessToken);
    }
}