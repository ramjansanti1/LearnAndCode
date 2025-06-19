import News from "../../models/news.model.js";
import SavedArticle from "../../models/savedArticle.model.js";

export default class NewsService {
    async handleGetNews() {
        const news = await News.find({ blocked: false }).limit(20);
        return news;
    }

    async handleGetNewsBycategory(category: string) {
        const news = await News.find({ category, blocked: false }).limit(20);
        return news;
    }

    async handleGetNewsByDate(dateData: { [key: string]: any }) {
        const { startDate, endDate } = dateData;
        const start = new Date(startDate as string);
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        const news = await News
            .find({
                createdAt: { $gte: start, $lte: end },
                blocked: false
            })
            .sort({ createdAt: -1 })
            .limit(20);
        return news;
    }

    async handleSaveNewsArticle(articleId: string, user: { [key: string]: any }) {
        const savedArticle = await SavedArticle.create({
            articleId,
            userId: user._id
        });
        if (!savedArticle) {
            throw new Error("Saved article not found");
        }
        return savedArticle;
    }

    async handleDeleteNewsArticle(articleId: string, user: { [key: string]: any }) {
        const deletedArticle = await SavedArticle.findOneAndDelete({
            articleId,
            userId: user._id
        });
        if (!deletedArticle) {
            throw new Error("Saved article not found");
        }
        return { message: "Article deleted successfully", data: deletedArticle };
    }

    async handlelikeArticle(articleId: string) {
        const articleFromDb = await this.getArticle(articleId);
        articleFromDb.likes = (articleFromDb.likes as number || 0) + 1;
        await articleFromDb?.save({ validateBeforeSave: false });
        return articleFromDb;
    }

    async handleDislikeArticle(articleId: string) {
        const articleFromDb = await this.getArticle(articleId);
        articleFromDb.dislikes = (articleFromDb.dislikes as number || 0) + 1;
        await articleFromDb?.save({ validateBeforeSave: false });
        return articleFromDb;
    }

    async handleReportArticle(articleId: string, user: { [key: string]: any }) {
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
            throw new Error("Article not found");
        }
        return articleFromDb;
    }
}