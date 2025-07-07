import News from "../models/news.model.js";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";
import { MessageConstants } from "../constants/message.constants.js";
import { customObject } from "../types/types.js";

export default class AdminService {
    private async updateAccessInDb(userData: customObject, isAdmin: Boolean) {
        const userFromDatabase = await User.findOne({ email: userData.email });
        if (userFromDatabase) {
            userFromDatabase.isAdmin = isAdmin;
        }
        await userFromDatabase?.save({ validateBeforeSave: false });
        return userFromDatabase;
    }

    async handleGrantAdminAccess(userData: customObject) {
        const userFromDatabase = await this.updateAccessInDb(userData, true);
        return userFromDatabase;
    }

    async handleRevokeAdminAccess(userData: customObject) {
        const userFromDatabase = await this.updateAccessInDb(userData, false);
        return userFromDatabase;
    }

    async handleGetReports() {
        const reportedArticles = await News.find({
            reports: { $ne: [] }
        });
        return reportedArticles;
    }

    async handleUpdateArticleStatus(articleData: customObject) {
        const fetchedArticle = await News.findById(articleData.articleId);
        if (!fetchedArticle) {
            throw new Error(MessageConstants.article.notFound);
        }
        if (fetchedArticle.blocked) {
            fetchedArticle.blocked = articleData.status;
        }
        fetchedArticle.save({ validateBeforeSave: false });
        return fetchedArticle;
    }

    async handleGetCategories() {
        const categories = await Category.find();
        if (!categories) {
            throw new Error(MessageConstants.categories.fetchError);
        }
        return categories;
    }

    async handleAddCategories(categoryData: customObject) {
        const createdCategory = await Category.create({
            category: categoryData.category,
            status: categoryData.status
        });
        if (!createdCategory) {
            throw new Error(MessageConstants.categories.addError);
        }
        return createdCategory;
    }

    async handleUpdateCategories(categoryData: customObject) {
        const fetchedCategory = await Category.findOne({ category: categoryData.category });
        if (!fetchedCategory) {
            throw new Error(MessageConstants.categories.updateError);
        }
        fetchedCategory.status = categoryData.status;
        await fetchedCategory?.save({ validateBeforeSave: false });
        return fetchedCategory;
    }
}