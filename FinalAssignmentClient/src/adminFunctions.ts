import askQuestion from "./userInput.js";
import axios from "axios";

export async function handleAdminChoice(accessToken: string) {
    const choice = await askQuestion("Enter your choice: ");

    switch (choice) {
        case '1':
            await viewAllExternalServers(accessToken);
            break;
        case '2':
            await viewExternalServerDetails(accessToken);
            break;
        case '3':
            await updateExternalServerDetails(accessToken);
            break;
        case '4':
            await addNewsCategory(accessToken);
            break;
        case '5':
            console.log("Logging out...");
            break;
        default:
            console.log("Invalid choice, please try again.");
            await handleAdminChoice(accessToken);
    }
}

export async function viewAllExternalServers(accessToken: string) {
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
    handleAdminChoice(accessToken);
}

export async function viewExternalServerDetails(accessToken: string) {
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
    handleAdminChoice(accessToken);
}

export async function updateExternalServerDetails(accessToken: string) {
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
    handleAdminChoice(accessToken);
}

export async function addNewsCategory(accessToken: string) {
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
    handleAdminChoice(accessToken);
}