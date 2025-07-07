import { MessageConstants } from "../../constants/message.constants.js";
import News from "../../models/news.model.js";
import SavedArticle from "../../models/savedArticle.model.js";
import { customObject } from "../../types/types.js";

export default class NewsService {
    async handleGetNews(page: string) {
        const pageNumber = parseInt(page) || 1;
        const skip = (pageNumber - 1) * 20;
        const news = await News.find({ blocked: false })
            .skip(skip)
            .limit(20)
            .sort({ createdAt: -1 });
        const total = await News.countDocuments({ blocked: false });
        const totalPages = Math.ceil(total / 20);
        return { news, totalPages };
    }

    async handleGetNewsBycategory(category: string, page: string) {
        const pageNumber = parseInt(page) || 1;
        const skip = (pageNumber - 1) * 20;
        const news = await News.find({ category, blocked: false }).sort({ likes: -1 }).limit(20).skip(skip);
        const total = await News.countDocuments({ blocked: false });
        const totalPages = Math.ceil(total / 20);
        return { news, totalPages };
    }

    async handleGetNewsBySearchQuery(searchQuery: string, page: string) {
        const pageNumber = parseInt(page) || 1;
        const skip = (pageNumber - 1) * 20;
        const news = await News.find({
            $and: [
                { blocked: false },
                {
                    $or: [
                        { title: { $regex: searchQuery, $options: 'i' } },
                        { content: { $regex: searchQuery, $options: 'i' } },
                        { description: { $regex: searchQuery, $options: 'i' } }
                    ]
                }
            ]
        }).sort({ likes: -1 }).limit(20).skip(skip);
        const total = await News.countDocuments({ blocked: false });
        const totalPages = Math.ceil(total / 20);
        return { news, totalPages };
    }

    async handleGetNewsByDate(dateData: customObject) {
        const { startDate, endDate } = dateData;
        const start = new Date(startDate as string);
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        const news = await News
            .find({
                createdAt: { $gte: start, $lte: end },
                blocked: false
            })
            .sort({ likes: -1 })
            .limit(20);
        return news;
    }

    async handleGetSavedNewsArticle(user: customObject, page: string) {
        const pageNumber = parseInt(page) || 1;
        const skip = (pageNumber - 1) * 20;
        let articles: customObject = [];
        const savedArticles = await SavedArticle.find({ userId: user._id })
            .skip(skip)
            .limit(20)
            .sort({ createdAt: -1 });
        if (!savedArticles) {
            throw new Error(MessageConstants.article.saveNotFound);
        }
        for (const article of savedArticles) {
            const fetchedArticle = await News.findById(article.articleId);
            articles.push(fetchedArticle);
        }
        const total = await SavedArticle.countDocuments({ blocked: false });
        const totalPages = Math.ceil(total / 20);
        return { articles, totalPages };
    }

    async handleSaveNewsArticle(articleId: string, user: customObject) {
        const savedArticle = await SavedArticle.create({
            savedArticleId: `${articleId}-${user._id}`,
            articleId,
            userId: user._id
        });
        if (!savedArticle) {
            throw new Error(MessageConstants.article.saveNotFound);
        }
        return savedArticle;
    }

    async handleDeleteNewsArticle(articleId: string, user: customObject) {
        const deletedArticle = await SavedArticle.findOneAndDelete({
            articleId,
            userId: user._id
        });
        if (!deletedArticle) {
            throw new Error(MessageConstants.article.saveNotFound);
        }
        return deletedArticle;
    }

    async handlelikeArticle(articleId: string, user: customObject) {
        const articleFromDb = await this.getArticle(articleId);
        if (!articleFromDb.likes.includes(user._id) && !articleFromDb.dislikes.includes(user._id)) {
            articleFromDb.likes.push(user._id);
        }
        await articleFromDb?.save({ validateBeforeSave: false });
        return articleFromDb;
    }

    async handleDislikeArticle(articleId: string, user: customObject) {
        const articleFromDb = await this.getArticle(articleId);
        if (!articleFromDb.dislikes.includes(user._id) && !articleFromDb.likes.includes(user._id)) {
            articleFromDb.dislikes.push(user._id);
        }
        await articleFromDb?.save({ validateBeforeSave: false });
        return articleFromDb;
    }

    async handleReportArticle(articleId: string, user: customObject) {
        const articleFromDb = await this.getArticle(articleId);
        if (articleFromDb.reports.length >= Number(process.env.REPORT_THRESHOLD)) {
            articleFromDb.blocked = true;
        }
        else if (!articleFromDb.reports.includes(user._id)) {
            articleFromDb.reports.push(user._id);
        }
        await articleFromDb?.save({ validateBeforeSave: false });
        return articleFromDb;
    }

    private async getArticle(articleId: string) {
        const articleFromDb = await News.findById(articleId);
        if (!articleFromDb) {
            throw new Error(MessageConstants.article.notFound);
        }
        return articleFromDb;
    }
}