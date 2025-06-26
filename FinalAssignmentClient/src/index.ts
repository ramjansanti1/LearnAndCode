import express from 'express';
import dotenv from 'dotenv';
import runApplication from "./main.js";

dotenv.config();

const app = express();

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