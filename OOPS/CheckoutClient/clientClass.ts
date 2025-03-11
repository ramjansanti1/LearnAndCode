const fs = require('fs/promises');
const axios = require('axios');

export class Checkout {
    private filePath: string;
    private apiUrl: string;

    constructor(filePath: string, apiUrl: string) {
        this.filePath = filePath;
        this.apiUrl = apiUrl;
    }

    async getData() {
        try {
            const fileContent = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(fileContent);
        } catch (error) {
            console.error("Error reading file:", error);
            throw error;
        }
    }

    async checkoutCall() {
        try {
            const data = await this.getData();
            const apiResponse = await axios.post(this.apiUrl, data);
            
            console.log("Response:", apiResponse.data);
        } catch (error) {
            console.error("API call failed:", error);
        }
    }
}