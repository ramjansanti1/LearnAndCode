const fs = require('fs/promises');
const axios = require('axios');

async function getData() {
    return JSON.parse(await fs.readFile('./request.json', 'utf-8'));
}

async function checkoutCall() {
    try {
        const data = await getData();
        const apiResponse = await axios.post('http://localhost:3000/checkout', data);

        console.log(apiResponse.data);
    } catch (error) {
        console.log(error);
    }
}

checkoutCall();
