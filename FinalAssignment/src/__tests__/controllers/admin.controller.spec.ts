import AdminController from "../../controllers/admin.controller";
import AdminService from "../../service/admin.service";

jest.mock("../../service/admin.service");

describe("AdminController", () => {
    let controller: AdminController;
    let mockReq: any;
    let mockRes: any;

    beforeEach(() => {
        controller = new AdminController();
        mockReq = { body: {} };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it("should return admin list on getAdminList success", async () => {
        const mockAdmins = [{ name: "Admin1" }];
        (AdminService.prototype.handleGetAdminList as jest.Mock).mockResolvedValue(mockAdmins);

        await controller.getAdminList(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ data: mockAdmins }));
    });

    it("should handle error in getAdminList", async () => {
        const errorMsg = "Something went wrong";
        (AdminService.prototype.handleGetAdminList as jest.Mock).mockRejectedValue(new Error(errorMsg));

        await controller.getAdminList(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: errorMsg }));
    });

    it("should call grantAdminAccess", async () => {
        const updatedUser = { id: 1, isAdmin: true };
        (AdminService.prototype.handleGrantAdminAccess as jest.Mock).mockResolvedValue(updatedUser);

        await controller.grantAdminAccess(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ data: updatedUser }));
    });

    it("should call revokeAdminAccess", async () => {
        const updatedUser = { id: 2, isAdmin: false };
        (AdminService.prototype.handleRevokeAdminAccess as jest.Mock).mockResolvedValue(updatedUser);

        await controller.revokeAdminAccess(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ data: updatedUser }));
    });

    it("should return reported articles on getReports success", async () => {
        const mockReports = [{ title: "Fake News", reports: [1, 2] }];
        (AdminService.prototype.handleGetReports as jest.Mock).mockResolvedValue(mockReports);

        await controller.getReports(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ data: mockReports }));
    });

    it("should handle error in getReports", async () => {
        const errorMsg = "Failed to fetch reports";
        (AdminService.prototype.handleGetReports as jest.Mock).mockRejectedValue(new Error(errorMsg));

        await controller.getReports(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: errorMsg }));
    });

    it("should update article status successfully", async () => {
        const mockBlockedArticle = { _id: "123", blocked: true };
        (AdminService.prototype.handleUpdateArticleStatus as jest.Mock).mockResolvedValue(mockBlockedArticle);

        await controller.updateArticleStatus(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
            data: mockBlockedArticle
        }));
    });

    it("should handle error in updateArticleStatus", async () => {
        const errorMsg = "Failed to update article status";
        (AdminService.prototype.handleUpdateArticleStatus as jest.Mock).mockRejectedValue(new Error(errorMsg));

        await controller.updateArticleStatus(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
            message: errorMsg
        }));
    });

    it("should return categories on getCategories success", async () => {
        const mockCategories = ["sports", "technology"];
        (AdminService.prototype.handleGetCategories as jest.Mock).mockResolvedValue(mockCategories);

        await controller.getCategories(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
            data: mockCategories,
            message: expect.any(String)
        }));
    });

    it("should handle error in getCategories", async () => {
        const errorMsg = "Failed to fetch categories";
        (AdminService.prototype.handleGetCategories as jest.Mock).mockRejectedValue(new Error(errorMsg));

        await controller.getCategories(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
            message: errorMsg
        }));
    });

    it("should add category successfully", async () => {
        const createdCategory = { _id: "abc123", name: "sports" };
        (AdminService.prototype.handleAddCategories as jest.Mock).mockResolvedValue(createdCategory);

        await controller.addCategories(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String),
            data: createdCategory
        }));
    });

    it("should handle error in addCategories", async () => {
        const errorMsg = "Unable to add category";
        (AdminService.prototype.handleAddCategories as jest.Mock).mockRejectedValue(new Error(errorMsg));

        await controller.addCategories(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
            message: errorMsg
        }));
    });

    it("should update category successfully", async () => {
        const updatedCategory = { _id: "cat123", name: "technology" };
        (AdminService.prototype.handleUpdateCategories as jest.Mock).mockResolvedValue(updatedCategory);

        await controller.updateCategories(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String),
            data: updatedCategory
        }));
    });

    it("should handle error in updateCategories", async () => {
        const errorMsg = "Failed to update category";
        (AdminService.prototype.handleUpdateCategories as jest.Mock).mockRejectedValue(new Error(errorMsg));

        await controller.updateCategories(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
            message: errorMsg
        }));
    });
});
