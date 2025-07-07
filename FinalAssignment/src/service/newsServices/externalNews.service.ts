import News from "../../models/news.model.js";
import NewsApiService from "./newsapi.service.js";
import TheNewsApiService from "./theNewsApi.service.js";
import Category from "../../models/category.model.js";
import { MessageConstants } from "../../constants/message.constants.js";
import { customObject } from "../../types/types.js";

export default class ExternalNewsService {
    private newsApiInstance: NewsApiService;
    private theNewsApiInstance: TheNewsApiService

    constructor() {
        this.newsApiInstance = new NewsApiService();
        this.theNewsApiInstance = new TheNewsApiService();
    }

    async startNewsScheduler() {
        await this.fetchNews();
        setInterval(async () => {
            await this.fetchNews();
        }, 10800000);
    }

    async fetchNews() {
        await this.fetchNewsFromApi(this.newsApiInstance);
        await this.fetchNewsFromApi(this.theNewsApiInstance);
    }

    async fetchNewsFromApi(newsSourceInstance: NewsApiService | TheNewsApiService) {
        const categories = await Category.find({});

        categories.forEach(async (category) => {
            if (category.status) {
                const articles = await newsSourceInstance.fetchNewsFromExternalApiByCategory(category.category);
                let processedArticles = newsSourceInstance.processArticlesToStoreInDB(articles, category.category);
                await this.addDataToDb(processedArticles);
            }
        });
    }

    async addDataToDb(articles: customObject[]) {
        for (const article of articles) {
            try {
                const news = await News.create(article);
                if (!news) {
                    console.error(`${MessageConstants.externalNewsApi.insertError}${article.title}`);
                }
            } catch (err: any) {
                if (err.code === 11000) {
                    console.warn(`${MessageConstants.externalNewsApi.duplicateSkipped}${article.title}`);
                } else {
                    console.error(`${MessageConstants.externalNewsApi.insertError} ${article.title}:`, err);
                }
            }
        }
    }
}