import NotificationController from "../../controllers/notification.controller";
import NotificationService from "../../service/notification.service";

jest.mock("../../service/notification.service");

describe("NewsController", () => {
    let controller: typeof NotificationController;
    let mockReq: any;
    let mockRes: any;

    beforeEach(() => {
        controller = NotificationController;
        mockReq = { query: {}, user: {} };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe("getNews", () => {
        it("should return notifications successfully", async () => {
            const mockNotifications = [{ id: "notif1", message: "Sample notification" }];
            (NotificationService.prototype.handleGetNotification as jest.Mock).mockResolvedValue(mockNotifications);

            await controller.getNotifications(mockReq, mockRes);

            expect(NotificationService.prototype.handleGetNotification).toHaveBeenCalledWith(mockReq.user);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: expect.any(String),
                data: mockNotifications
            });
        });

        it("should handle error when fetching notifications", async () => {
            const errorMsg = "Failed to fetch notifications";
            (NotificationService.prototype.handleGetNotification as jest.Mock).mockRejectedValue(new Error(errorMsg));

            await controller.getNotifications(mockReq, mockRes);

            expect(NotificationService.prototype.handleGetNotification).toHaveBeenCalledWith(mockReq.user);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: errorMsg,
                data: expect.any(Error)
            });
        });
    });

    describe("getNotificationConfig", () => {
        it("should return notification config successfully", async () => {
            const mockConfig = { keywords: ["js"], categories: ["tech"] };
            (NotificationService.prototype.handleGetNotificationConfig as jest.Mock).mockResolvedValue(mockConfig);

            await controller.getNotificationConfig(mockReq, mockRes);

            expect(NotificationService.prototype.handleGetNotificationConfig).toHaveBeenCalledWith(mockReq.user);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: expect.any(String),
                data: mockConfig
            });
        });

        it("should handle error in getNotificationConfig", async () => {
            const errorMsg = "Config fetch failed";
            (NotificationService.prototype.handleGetNotificationConfig as jest.Mock).mockRejectedValue(new Error(errorMsg));

            await controller.getNotificationConfig(mockReq, mockRes);

            expect(NotificationService.prototype.handleGetNotificationConfig).toHaveBeenCalledWith(mockReq.user);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: errorMsg,
                data: expect.any(Error)
            });
        });
    });

    describe("addNotificationConfig", () => {
        it("should add notification config successfully", async () => {
            const mockConfig = { keywords: ["ai"], categories: ["science"] };
            (NotificationService.prototype.handleAddNotificationConfig as jest.Mock).mockResolvedValue(mockConfig);

            mockReq.body = { keywords: ["ai"], categories: ["science"] };
            mockReq.user = { id: "user123" };

            await controller.addNotificationConfig(mockReq, mockRes);

            expect(NotificationService.prototype.handleAddNotificationConfig)
                .toHaveBeenCalledWith(mockReq.body, mockReq.user);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: expect.any(String),
                data: mockConfig
            });
        });

        it("should handle error in addNotificationConfig", async () => {
            const errorMsg = "Failed to add config";
            (NotificationService.prototype.handleAddNotificationConfig as jest.Mock)
                .mockRejectedValue(new Error(errorMsg));

            mockReq.body = { keywords: ["error"], categories: ["fail"] };
            mockReq.user = { id: "userError" };

            await controller.addNotificationConfig(mockReq, mockRes);

            expect(NotificationService.prototype.handleAddNotificationConfig)
                .toHaveBeenCalledWith(mockReq.body, mockReq.user);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: errorMsg,
                data: expect.any(Error)
            });
        });
    });

    describe("addCategoryToNotificationConfig", () => {
        it("should successfully add a category to notification config", async () => {
            const mockCategory = "technology";
            const mockResponseData = { categories: ["technology"] };

            (NotificationService.prototype.handleAddCategoryToNotificationConfig as jest.Mock)
                .mockResolvedValue(mockResponseData);

            mockReq.query = { category: mockCategory };
            mockReq.user = { id: "user123" };

            await controller.addCategoryToNotificationConfig(mockReq, mockRes);

            expect(NotificationService.prototype.handleAddCategoryToNotificationConfig)
                .toHaveBeenCalledWith(mockCategory, mockReq.user);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: expect.any(String),
                data: mockResponseData
            });
        });

        it("should handle error in addCategoryToNotificationConfig", async () => {
            const mockCategory = "error-category";
            const errorMsg = "Failed to add category";

            (NotificationService.prototype.handleAddCategoryToNotificationConfig as jest.Mock)
                .mockRejectedValue(new Error(errorMsg));

            mockReq.query = { category: mockCategory };
            mockReq.user = { id: "userError" };

            await controller.addCategoryToNotificationConfig(mockReq, mockRes);

            expect(NotificationService.prototype.handleAddCategoryToNotificationConfig)
                .toHaveBeenCalledWith(mockCategory, mockReq.user);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: errorMsg,
                data: expect.any(Error)
            });
        });
    });

    describe("removeCategoryToNotificationConfig", () => {
        it("should remove category from notification config successfully", async () => {
            const mockCategory = "sports";
            const mockRemovedCategory = { categories: [] };

            (NotificationService.prototype.handleRemoveCategoryToNotificationConfig as jest.Mock)
                .mockResolvedValue(mockRemovedCategory);

            mockReq.query = { category: mockCategory };
            mockReq.user = { id: "user123" };

            await controller.removeCategoryToNotificationConfig(mockReq, mockRes);

            expect(NotificationService.prototype.handleRemoveCategoryToNotificationConfig)
                .toHaveBeenCalledWith(mockCategory, mockReq.user);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: expect.any(String),
                data: mockRemovedCategory
            });
        });

        it("should handle error in removeCategoryToNotificationConfig", async () => {
            const mockCategory = "error-category";
            const errorMsg = "Failed to remove category";

            (NotificationService.prototype.handleRemoveCategoryToNotificationConfig as jest.Mock)
                .mockRejectedValue(new Error(errorMsg));

            mockReq.query = { category: mockCategory };
            mockReq.user = { id: "userError" };

            await controller.removeCategoryToNotificationConfig(mockReq, mockRes);

            expect(NotificationService.prototype.handleRemoveCategoryToNotificationConfig)
                .toHaveBeenCalledWith(mockCategory, mockReq.user);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: errorMsg,
                data: expect.any(Error)
            });
        });
    });

    describe("addKeywordToNotificationConfig", () => {
        it("should successfully add a keyword to notification config", async () => {
            const mockKeyword = "AI";
            const mockResponse = { keywords: ["AI"] };

            (NotificationService.prototype.handleAddKeywordToNotificationConfig as jest.Mock)
                .mockResolvedValue(mockResponse);

            mockReq.query = { keyword: mockKeyword };
            mockReq.user = { id: "user123" };

            await controller.addKeywordToNotificationConfig(mockReq, mockRes);

            expect(NotificationService.prototype.handleAddKeywordToNotificationConfig)
                .toHaveBeenCalledWith(mockKeyword, mockReq.user);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: expect.any(String),
                data: mockResponse
            });
        });

        it("should handle error when adding keyword fails", async () => {
            const mockKeyword = "error-keyword";
            const errorMsg = "Failed to add keyword";

            (NotificationService.prototype.handleAddKeywordToNotificationConfig as jest.Mock)
                .mockRejectedValue(new Error(errorMsg));

            mockReq.query = { keyword: mockKeyword };
            mockReq.user = { id: "userError" };

            await controller.addKeywordToNotificationConfig(mockReq, mockRes);

            expect(NotificationService.prototype.handleAddKeywordToNotificationConfig)
                .toHaveBeenCalledWith(mockKeyword, mockReq.user);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: errorMsg,
                data: expect.any(Error)
            });
        });
    });

    describe("removeKeywordToNotificationConfig", () => {
        it("should remove a keyword from notification config successfully", async () => {
            const mockKeyword = "technology";
            const mockResponse = { keywords: [] };

            (NotificationService.prototype.handleRemoveKeywordToNotificationConfig as jest.Mock)
                .mockResolvedValue(mockResponse);

            mockReq.query = { keyword: mockKeyword };
            mockReq.user = { id: "user123" };

            await controller.removeKeywordToNotificationConfig(mockReq, mockRes);

            expect(NotificationService.prototype.handleRemoveKeywordToNotificationConfig)
                .toHaveBeenCalledWith(mockKeyword, mockReq.user);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: expect.any(String),
                data: mockResponse
            });
        });

        it("should handle error in removeKeywordToNotificationConfig", async () => {
            const mockKeyword = "error-keyword";
            const errorMsg = "Failed to remove keyword";

            (NotificationService.prototype.handleRemoveKeywordToNotificationConfig as jest.Mock)
                .mockRejectedValue(new Error(errorMsg));

            mockReq.query = { keyword: mockKeyword };
            mockReq.user = { id: "userError" };

            await controller.removeKeywordToNotificationConfig(mockReq, mockRes);

            expect(NotificationService.prototype.handleRemoveKeywordToNotificationConfig)
                .toHaveBeenCalledWith(mockKeyword, mockReq.user);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: errorMsg,
                data: expect.any(Error)
            });
        });
    });
});