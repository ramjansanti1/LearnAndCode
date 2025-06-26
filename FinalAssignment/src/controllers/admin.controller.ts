import { MessageConstants } from "../constants/message.constants.js";
import AdminService from "../service/admin.service.js";

export default class AdminController {
    adminService: AdminService;

    constructor() {
        this.adminService = new AdminService();
        this.grantAdminAccess = this.grantAdminAccess.bind(this);
        this.revokeAdminAccess = this.revokeAdminAccess.bind(this);
        this.getReports = this.getReports.bind(this);
        this.updateArticleStatus = this.updateArticleStatus.bind(this);
        this.getCategories = this.getCategories.bind(this);
        this.addCategories = this.addCategories.bind(this);
        this.updateCategories = this.updateCategories.bind(this);
    }

    async grantAdminAccess(req: any, res: any) {
        try {
            const updatedUser = await this.adminService.handleGrantAdminAccess(req.body);
            return res
                .status(200)
                .json({ message: MessageConstants.accessGranted, data: updatedUser });
        } catch (error) {
            return res
                .status(500)
                .json({ message: MessageConstants.accessGrantError, data: error });
        }
    }

    async revokeAdminAccess(req: any, res: any) {
        try {
            const updatedUser = await this.adminService.handleRevokeAdminAccess(req.body);
            return res
                .status(200)
                .json({ message: MessageConstants.accessRevoked, data: updatedUser });
        } catch (error) {
            return res
                .status(500)
                .json({ message: MessageConstants.accessRevokeError, data: error });
        }
    }

    async getReports(req: any, res: any) {
        try {
            const reportedArticles = await this.adminService.handleGetReports();
            return res
                .status(200)
                .json({ message: MessageConstants.reportsFetched, data: reportedArticles });
        } catch (error) {
            return res
                .status(500)
                .json({ message: MessageConstants.reportsFetchError, data: error });
        }
    }

    async updateArticleStatus(req: any, res: any) {
        try {
            const blockedArticle = await this.adminService.handleUpdateArticleStatus(req.body);
            return res
                .status(200)
                .json({ message: MessageConstants.articleUpdated, data: blockedArticle });
        } catch (error) {
            return res
                .status(500)
                .json({ message: MessageConstants.articleUpdateError, data: error });
        }
    }

    async getCategories(req: any, res: any) {
        try {
            const categories = await this.adminService.handleGetCategories();
            return res
                .status(200)
                .json({ message: MessageConstants.categoriesFetched, data: categories });
        } catch (error) {
            return res
                .status(500)
                .json({ message: MessageConstants.categoriesFetchError, data: error });
        }
    }

    async addCategories(req: any, res: any) {
        try {
            const createdCategory = await this.adminService.handleAddCategories(req.body);
            return res
                .status(201)
                .json({
                    message: "Categories added successfully", data
                        : createdCategory
                });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Error adding categories", data: error });
        }
    }

    async updateCategories(req: any, res: any) {
        try {
            const createdCategory = await this.adminService.handleUpdateCategories(req.body);
            return res
                .status(201)
                .json({ message: "Categories updated successfully", data: createdCategory });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Error updating categories", data: error });
        }
    }
}