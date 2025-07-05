import axios from "axios";
import ExternalNewsService from "../../interfaces/news.interface.js";
import { customObject } from "../../types/types.js";

export default class TheNewsApiService implements ExternalNewsService {
    async fetchNewsFromExternalApiByCategory(category: string) {
        const response = await axios.get(`https://api.thenewsapi.com/v1/news/all?api_token=${process.env.THE_NEWS_API_KEY}&category=${category}&language=en`);
        return response.data.data;
    }

    processArticlesToStoreInDB(articles: any[], category: string) {
        let processedArticles: customObject[] = [];
        articles.forEach((article) => {
            processedArticles.push({
                title: article.title,
                content: article.description,
                category: category,
                source: article.source,
                url: article.url,
                imageUrl: article.image_url,
                likes: [],
                dislikes: []
            });
        });
        return processedArticles;
    }
}