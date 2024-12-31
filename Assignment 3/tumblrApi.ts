import axios from 'axios';
const prompt = require('prompt-sync')();

async function main() {
    try {
        const tumblrName = promptUser("Enter the Tumblr name: ");
        const start = promptUser("Enter the start post: ");
        const numberOfPosts = promptUser("Enter the number of posts: ");
        const response = await getApiData(tumblrName, start, numberOfPosts);
        const data = parseApiData(response);
        displayData(data);
        console.log(getPhotoUrls(data.posts));
    } catch (error) {
        console.error(error);
    }
}

function promptUser(message: string): string {
    return prompt(message);
}

async function getApiData(tumblrName: string, start: string, numberOfPosts: string) {
    // Get the posts from tumblr API
    return await axios.get(`https://${tumblrName}.tumblr.com/api/read/json?type=photo&num=${numberOfPosts}&start=${start}`);
}

function parseApiData(response: any) {
    return JSON.parse(response.data.replace(/^var tumblr_api_read = /, '').trim().slice(0, -1));
}

function displayData(data: any) {
    console.log(`Title: ${data.tumblelog.title}`);
    console.log(`Description: ${data.tumblelog.description}`);
    console.log(`Name: ${data.tumblelog.name}`);
    console.log(`Number of Posts: ${data['posts-total']}`);
}

function getPhotoUrls(posts: { [key: string]: any }[]) {
    const photoUrls = posts.map(post => post['photo-url-1280']).filter(url => url !== undefined);
    return photoUrls;
}

main();
