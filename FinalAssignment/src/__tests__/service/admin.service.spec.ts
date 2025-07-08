import AdminService from "../../service/admin.service";
import User from "../../models/user.model.js";
import News from "../../models/news.model.js";
import Category from "../../models/category.model.js";
import { MessageConstants } from "../../constants/message.constants.js";

jest.mock("../../models/user.model.js");
jest.mock("../../models/news.model.js");
jest.mock("../../models/category.model.js");

describe("AdminService", () => {
    let service: AdminService;
    const mockUserData = { email: "test@example.com" };
    const mockUser = {
        email: "test@example.com",
        isAdmin: false,
        save: jest.fn().mockResolvedValue(true),
    };

    beforeEach(() => {
        service = new AdminService();
        jest.clearAllMocks();
    });

    describe("handleGetAdminList", () => {
        it("should return a list of admins (success case)", async () => {
            const mockAdmins = [
                { _id: "1", name: "Admin1", isAdmin: true },
                { _id: "2", name: "Admin2", isAdmin: true }
            ];
            (User.find as jest.Mock).mockResolvedValue(mockAdmins);

            const result = await service.handleGetAdminList();

            expect(User.find).toHaveBeenCalledWith({ isAdmin: true });
            expect(result).toEqual(mockAdmins);
        });

        it("should throw an error if User.find fails (error case)", async () => {
            const mockError = new Error("DB error");
            (User.find as jest.Mock).mockRejectedValue(mockError);

            await expect(service.handleGetAdminList()).rejects.toThrow("DB error");
            expect(User.find).toHaveBeenCalledWith({ isAdmin: true });
        });
    });

    describe("handleGrantAdminAccess", () => {
        it("should grant admin access to a user (success case)", async () => {
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            const result = await service.handleGrantAdminAccess(mockUserData);

            expect(User.findOne).toHaveBeenCalledWith({ email: mockUserData.email });
            expect(mockUser.isAdmin).toBe(true);
            expect(mockUser.save).toHaveBeenCalledWith({ validateBeforeSave: false });
            expect(result).toBe(mockUser);
        });

        it("should return null if user is not found", async () => {
            (User.findOne as jest.Mock).mockResolvedValue(null);

            const result = await service.handleGrantAdminAccess(mockUserData);

            expect(User.findOne).toHaveBeenCalledWith({ email: mockUserData.email });
            expect(result).toBeNull();
        });

        it("should throw an error if DB fails", async () => {
            (User.findOne as jest.Mock).mockRejectedValue(new Error("DB Error"));

            await expect(service.handleGrantAdminAccess(mockUserData)).rejects.toThrow("DB Error");
        });
    });

    describe("handleRevokeAdminAccess", () => {
        it("should revoke admin access from a user (success case)", async () => {
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            const result = await service.handleRevokeAdminAccess(mockUserData);

            expect(User.findOne).toHaveBeenCalledWith({ email: mockUserData.email });
            expect(mockUser.isAdmin).toBe(false); // should be changed in updateAccessInDb
            expect(mockUser.save).toHaveBeenCalledWith({ validateBeforeSave: false });
            expect(result).toBe(mockUser);
        });

        it("should return null if user not found", async () => {
            (User.findOne as jest.Mock).mockResolvedValue(null);

            const result = await service.handleRevokeAdminAccess(mockUserData);

            expect(User.findOne).toHaveBeenCalledWith({ email: mockUserData.email });
            expect(result).toBeNull();
        });

        it("should throw an error if DB query fails", async () => {
            (User.findOne as jest.Mock).mockRejectedValue(new Error("DB Error"));

            await expect(service.handleRevokeAdminAccess(mockUserData)).rejects.toThrow("DB Error");
        });
    });

    describe("handleGetReports", () => {
        it("should return reported articles (success case)", async () => {
            const mockArticles = [
                { title: "Article 1", reports: ["spam"] },
                { title: "Article 2", reports: ["fake"] },
            ];

            (News.find as jest.Mock).mockResolvedValue(mockArticles);

            const result = await service.handleGetReports();

            expect(News.find).toHaveBeenCalledWith({ reports: { $ne: [] } });
            expect(result).toEqual(mockArticles);
        });

        it("should throw an error if DB query fails", async () => {
            (News.find as jest.Mock).mockRejectedValue(new Error("DB error"));

            await expect(service.handleGetReports()).rejects.toThrow("DB error");
            expect(News.find).toHaveBeenCalledWith({ reports: { $ne: [] } });
        });
    });

    describe("handleUpdateArticleStatus", () => {
        it("should update article blocked status", async () => {
            const articleData = { articleId: "abc123", status: true };
            const mockArticle = {
                blocked: false,
                save: jest.fn()
            };
            (News.findById as jest.Mock).mockResolvedValue(mockArticle);

            const result = await service.handleUpdateArticleStatus(articleData);

            expect(mockArticle.blocked).toBe(true);
            expect(mockArticle.save).toHaveBeenCalled();
            expect(result).toBe(mockArticle);
        });

        it("should throw error if article not found", async () => {
            (News.findById as jest.Mock).mockResolvedValue(null);

            await expect(
                service.handleUpdateArticleStatus({ articleId: "badId", status: false })
            ).rejects.toThrow(MessageConstants.article.notFound);
        });
    });

    describe("handleAddCategories", () => {
        it("should create a category and return it", async () => {
            const categoryData = { category: "Tech", status: true };
            const mockCategory = { id: 1, ...categoryData };
            (Category.create as jest.Mock).mockResolvedValue(mockCategory);

            const result = await service.handleAddCategories(categoryData);
            expect(result).toEqual(mockCategory);
        });

        it("should throw error if create fails", async () => {
            (Category.create as jest.Mock).mockResolvedValue(null);

            await expect(
                service.handleAddCategories({ category: "Test", status: true })
            ).rejects.toThrow(MessageConstants.categories.addError);
        });
    });

    describe("handleUpdateCategories", () => {
        it("should update and return the category (success case)", async () => {
            const mockCategoryData = { category: "Tech", status: true };
            const mockCategory = {
                category: "Tech",
                status: false,
                save: jest.fn().mockResolvedValue(true),
            };

            (Category.findOne as jest.Mock).mockResolvedValue(mockCategory);

            const result = await service.handleUpdateCategories(mockCategoryData);

            expect(Category.findOne).toHaveBeenCalledWith({ category: "Tech" });
            expect(mockCategory.status).toBe(true);
            expect(mockCategory.save).toHaveBeenCalledWith({ validateBeforeSave: false });
            expect(result).toBe(mockCategory);
        });

        it("should throw error if category not found", async () => {
            (Category.findOne as jest.Mock).mockResolvedValue(null);

            await expect(
                service.handleUpdateCategories({ category: "NonExistent", status: false })
            ).rejects.toThrow(MessageConstants.categories.updateError);

            expect(Category.findOne).toHaveBeenCalledWith({ category: "NonExistent" });
        });
    });
});