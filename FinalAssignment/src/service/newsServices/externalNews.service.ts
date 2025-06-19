import News from "../../models/news.model.js";
import NewsApiService from "./newsapi.service.js";
import TheNewsApiService from "./theNewsApi.service.js";

export default class ExternalNewsService{
    private newsApiInstance: NewsApiService;
    private theNewsApiInstance: TheNewsApiService

    constructor() {
        this.newsApiInstance = new NewsApiService();
        this.theNewsApiInstance = new TheNewsApiService();
    }

    async fetchNews() {
        // await this.fetchNewsFromApi(this.newsApiInstance);
        // await this.fetchNewsFromApi(this.theNewsApiInstance);
    }

    async fetchNewsFromApi(newsSourceInstance: NewsApiService | TheNewsApiService) {
        const categories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];

        categories.forEach(async (category) => {
            const articles = await newsSourceInstance.fetchNewsFromExternalApiByCategory(category);
            let processedArticles = newsSourceInstance.processArticlesToStoreInDB(articles, category);
            await this.addDataToDb(processedArticles);
        });
    }

    protected async addDataToDb(articles: { [key: string]: any }[]) {
        articles.forEach(async (article) => {
            let news = await News.create(article);
            if (!news) {
                console.error("Error adding Data");
            }
        });
    }
}