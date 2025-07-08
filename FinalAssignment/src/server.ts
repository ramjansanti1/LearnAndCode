import dotenv from 'dotenv';
import Database from './config/db.config.js';
import app from './app.js';
import ExternalNewsService from './service/newsServices/externalNews.service.js';
import { MessageConstants } from './constants/message.constants.js';

dotenv.config();

(async () => {
    try {
        const externalNewsService = new ExternalNewsService();
        const db = Database.getInstance();
        await db.connect();
        app.listen(process.env.PORT, () => {
            console.log(`${MessageConstants.serverListeningMessage} ${process.env.PORT}`);
        });
        externalNewsService.startNewsScheduler();
    } catch (error) {
        console.log(error);
    }
})();