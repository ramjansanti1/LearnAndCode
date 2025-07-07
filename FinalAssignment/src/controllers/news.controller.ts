import NewsService from "../service/newsServices/news.service.js";
import { MessageConstants } from "../constants/message.constants.js";
import { Logger } from "../utils/logger.util.js";

class NewsController {
    newsService: NewsService;
    logger: Logger;

    constructor() {
        this.newsService = new NewsService();
        this.logger = new Logger();
        this.getNews = this.getNews.bind(this);
        this.getNewsByDate = this.getNewsByDate.bind(this);
        this.getSavedNewsArticle = this.getSavedNewsArticle.bind(this);
        this.saveNewsArticle = this.saveNewsArticle.bind(this);
        this.deleteNewsArticle = this.deleteNewsArticle.bind(this);
        this.likeArticle = this.likeArticle.bind(this);
        this.dislikeArticle = this.dislikeArticle.bind(this);
        this.reportArticle = this.reportArticle.bind(this);
    }

    private async getNewsBasedOnPrefrence(req: any) {
        let fetchedNews;
        const { category, searchQuery, page } = req.query;
        if (category) {
            fetchedNews = await this.newsService.handleGetNewsBycategory(category, page);
        }
        else if (searchQuery) {
            fetchedNews = await this.newsService.handleGetNewsBySearchQuery(searchQuery, page);
        }
        else {
            fetchedNews = await this.newsService.handleGetNews(page);
        }
        return fetchedNews;
    }

    async getNews(req: any, res: any) {
        try {
            let fetchedNews = await this.getNewsBasedOnPrefrence(req);
            return res
                .status(200)
                .json({ message: MessageConstants.news.fetchSuccess, data: fetchedNews });
        } catch (error: any) {
            this.logger.error(error.message || MessageConstants.news.fetchError);
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.news.fetchError, data: error });
        }
    }

    async getNewsByDate(req: any, res: any) {
        try {
            let fetchedNews = await this.newsService.handleGetNewsByDate(req.query);
            return res
                .status(200)
                .json({ message: MessageConstants.news.fetchSuccess, data: fetchedNews });
        } catch (error: any) {
            this.logger.error(error.message || MessageConstants.news.fetchError);
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.news.fetchError, data: error });
        }
    }

    async getSavedNewsArticle(req: any, res: any) {
        try {
            let savedArticles = await this.newsService.handleGetSavedNewsArticle(req.user, req.query.page);
            return res
                .status(200)
                .json({ message: MessageConstants.article.fetchSuccess, data: savedArticles });
        } catch (error: any) {
            this.logger.error(error.message || MessageConstants.article.fetchError);
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.article.fetchError, data: error });
        }
    }

    async saveNewsArticle(req: any, res: any) {
        try {
            let savedArticle = await this.newsService.handleSaveNewsArticle(req.query.articleId, req.user);
            return res
                .status(200)
                .json({ message: MessageConstants.article.saveSuccess, data: savedArticle });
        } catch (error: any) {
            this.logger.error(error.message || MessageConstants.article.saveError);
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.article.saveError, data: error });
        }
    }

    async deleteNewsArticle(req: any, res: any) {
        try {
            let savedArticle = await this.newsService.handleDeleteNewsArticle(req.query.articleId, req.user);
            return res
                .status(200)
                .json({ message: MessageConstants.article.deleteSuccess, data: savedArticle });
        } catch (error: any) {
            this.logger.error(error.message || MessageConstants.article.deleteError);
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.article.deleteError, data: error });
        }
    }

    async likeArticle(req: any, res: any) {
        try {
            let savedArticle = await this.newsService.handlelikeArticle(req.query.articleId, req.user);
            return res
                .status(200)
                .json({ message: MessageConstants.article.likeSuccess, data: savedArticle });
        } catch (error: any) {
            this.logger.error(error.message || MessageConstants.article.likeError);
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.article.likeError, data: error });
        }
    }

    async dislikeArticle(req: any, res: any) {
        try {
            let savedArticle = await this.newsService.handleDislikeArticle(req.query.articleId, req.user);
            return res
                .status(200)
                .json({ message: MessageConstants.article.dislikeSuccess, data: savedArticle });
        } catch (error: any) {
            this.logger.error(error.message || MessageConstants.article.dislikeError);
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.article.dislikeError, data: error });
        }
    }

    async reportArticle(req: any, res: any) {
        try {
            let reportedArticle = await this.newsService.handleReportArticle(req.query.articleId, req.user);
            return res
                .status(200)
                .json({ message: MessageConstants.article.reportSuccess, data: reportedArticle });
        } catch (error: any) {
            this.logger.error(error.message || MessageConstants.article.reportError)
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.article.reportError, data: error });
        }
    }
}

export default new NewsController();