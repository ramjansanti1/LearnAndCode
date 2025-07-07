import { MessageConstants } from "../constants/message.constants.js";
import AdminService from "../service/admin.service.js";

export default class AdminController {
    adminService: AdminService;

    constructor() {
        this.adminService = new AdminService();
        this.getAdminList = this.getAdminList.bind(this);
        this.grantAdminAccess = this.grantAdminAccess.bind(this);
        this.revokeAdminAccess = this.revokeAdminAccess.bind(this);
        this.getReports = this.getReports.bind(this);
        this.updateArticleStatus = this.updateArticleStatus.bind(this);
        this.getCategories = this.getCategories.bind(this);
        this.addCategories = this.addCategories.bind(this);
        this.updateCategories = this.updateCategories.bind(this);
    }

    async getAdminList(req: any, res: any) {
        try {
            const adminList = await this.adminService.handleGetAdminList();
            return res
                .status(200)
                .json({ message: MessageConstants.access.success, data: adminList });
        } catch (error: any) {
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.access.error, data: error });
        }
    }

    async grantAdminAccess(req: any, res: any) {
        try {
            const updatedUser = await this.adminService.handleGrantAdminAccess(req.body);
            return res
                .status(200)
                .json({ message: MessageConstants.access.success, data: updatedUser });
        } catch (error: any) {
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.access.error, data: error });
        }
    }

    async revokeAdminAccess(req: any, res: any) {
        try {
            const updatedUser = await this.adminService.handleRevokeAdminAccess(req.body);
            return res
                .status(200)
                .json({ message: MessageConstants.access.revokedSuccess, data: updatedUser });
        } catch (error: any) {
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.access.revokedError, data: error });
        }
    }

    async getReports(req: any, res: any) {
        try {
            const reportedArticles = await this.adminService.handleGetReports();
            return res
                .status(200)
                .json({ message: MessageConstants.reports.success, data: reportedArticles });
        } catch (error: any) {
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.reports.error, data: error });
        }
    }

    async updateArticleStatus(req: any, res: any) {
        try {
            const blockedArticle = await this.adminService.handleUpdateArticleStatus(req.body);
            return res
                .status(200)
                .json({ message: MessageConstants.articleUpdate.success, data: blockedArticle });
        } catch (error: any) {
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.articleUpdate.error, data: error });
        }
    }

    async getCategories(req: any, res: any) {
        try {
            const categories = await this.adminService.handleGetCategories();
            return res
                .status(200)
                .json({ message: MessageConstants.categories.fetchSuccess, data: categories });
        } catch (error: any) {
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.categories.fetchError, data: error });
        }
    }

    async addCategories(req: any, res: any) {
        try {
            const createdCategory = await this.adminService.handleAddCategories(req.body);
            return res
                .status(201)
                .json({ message: MessageConstants.categories.addSuccess, data: createdCategory });
        } catch (error: any) {
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.categories.addError, data: error });
        }
    }

    async updateCategories(req: any, res: any) {
        try {
            const createdCategory = await this.adminService.handleUpdateCategories(req.body);
            return res
                .status(201)
                .json({ message: MessageConstants.categories.updateSuccess, data: createdCategory });
        } catch (error: any) {
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.categories.updateError, data: error });
        }
    }
}