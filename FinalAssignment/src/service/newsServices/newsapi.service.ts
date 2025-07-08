import axios from "axios";
import ExternalNewsService from "../../interfaces/news.interface.js";
import { customObject } from "../../types/types.js";

export default class NewsApiService implements ExternalNewsService {
    async fetchNewsFromExternalApiByCategory(category: string) {
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${process.env.NEWS_API_KEY}`);
        return response.data.articles;
    }

    processArticlesToStoreInDB(articles: any[], category: string) {
        let processedArticles: customObject[] = [];
        articles.forEach((article) => {
            processedArticles.push({
                title: article.title,
                content: article.content,
                category: category,
                source: article.source.name,
                url: article.url,
                imageUrl: article.urlToImage,
                likes: [],
                dislikes: []
            });
        });
        return processedArticles;
    }
}