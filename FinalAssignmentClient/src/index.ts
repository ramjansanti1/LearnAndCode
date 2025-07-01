import express from 'express';
import dotenv from 'dotenv';
import NewsAggregator from './newsAggregator.js';

dotenv.config();

const app = express();

(async () => {
    try {
        const newsAggregator = new NewsAggregator();
        app.listen(5500, () => {
            console.log(`The server is listening on PORT`);
            newsAggregator.runApplication();
        });
    } catch (error) {
        console.log(error);
    }
})();