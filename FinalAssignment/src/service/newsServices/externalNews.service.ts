import News from "../../models/news.model.js";
import NewsApiService from "./newsapi.service.js";
import TheNewsApiService from "./theNewsApi.service.js";
import Category from "../../models/category.model.js";
import { MessageConstants } from "../../constants/message.constants.js";

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
        // await this.fetchNewsFromApi(this.newsApiInstance);
        // await this.fetchNewsFromApi(this.theNewsApiInstance);
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

    protected async addDataToDb(articles: { [key: string]: any }[]) {
        articles.forEach(async (article) => {
            let news = await News.create(article);
            if (!news) {
                throw new Error(MessageConstants.externalSource.addError);
            }
        });
    }
}