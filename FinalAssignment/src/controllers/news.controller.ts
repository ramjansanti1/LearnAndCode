import NewsService from "../service/newsServices/news.service.js";

class NewsController {
    newsService: NewsService;

    constructor() {
        this.newsService = new NewsService();
        this.getNews = this.getNews.bind(this);
        this.getNewsByDate = this.getNewsByDate.bind(this);
        this.saveNewsArticle = this.saveNewsArticle.bind(this);
        this.deleteNewsArticle = this.deleteNewsArticle.bind(this);
        this.likeArticle = this.likeArticle.bind(this);
        this.dislikeArticle = this.dislikeArticle.bind(this);
        this.reportArticle = this.reportArticle.bind(this);
    }

    private async getNewsBasedOnPrefrence(req: any) {
        let fetchedNews;
        const { category } = req.query;
        if (category) {
            fetchedNews = await this.newsService.handleGetNewsBycategory(category);
        }
        else {
            fetchedNews = await this.newsService.handleGetNews();
        }
        return fetchedNews;
    }

    async getNews(req: any, res: any) {
        try {
            let fetchedNews = await this.getNewsBasedOnPrefrence(req);
            return res
                .status(200)
                .json({ message: "News fetched successfully", data: fetchedNews });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Error fetching news", data: error });
        }
    }

    async getNewsByDate(req: any, res: any) {
        try {
            let fetchedNews = await this.newsService.handleGetNewsByDate(req.query);
            return res
                .status(200)
                .json({ message: "News fetched successfully", data: fetchedNews });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Error fetching news", data: error });
        }
    }

    async saveNewsArticle(req: any, res: any) {
        try {
            let savedArticle = await this.newsService.handleSaveNewsArticle(req.query.articleId, req.user);
            return res
                .status(200)
                .json({ message: "Article saved successfully", data: savedArticle });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Error saving article", data: error });
        }
    }

    async deleteNewsArticle(req: any, res: any) {
        try {
            let savedArticle = await this.newsService.handleDeleteNewsArticle(req.query.articleId, req.user);
            return res
                .status(200)
                .json({ message: "Article deleted successfully", data: savedArticle });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Error saving article", data: error });
        }
    }

    async likeArticle(req: any, res: any) {
        try {
            let savedArticle = await this.newsService.handlelikeArticle(req.query.articleId);
            return res
                .status(200)
                .json({ message: "Article liked successfully", data: savedArticle });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Error liking article", data: error });
        }
    }

    async dislikeArticle(req: any, res: any) {
        try {
            let savedArticle = await this.newsService.handleDislikeArticle(req.query.articleId);
            return res
                .status(200)
                .json({ message: "Article deleted successfully", data: savedArticle });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Error saving article", data: error });
        }
    }

    async reportArticle(req: any, res: any) {
        try {
            let reportedArticle = await this.newsService.handleReportArticle(req.query.articleId, req.user);
            return res
                .status(200)
                .json({ message: "Article deleted successfully", data: reportedArticle });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Error saving article", data: error });
        }
    }
}

export default new NewsController();