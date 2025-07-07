import NotificationService from "../../service/notification.service.js";
import Notification from "../../models/notification.model.js";
import NotificationConfig from "../../models/notificationconfig.model";
import { MessageConstants } from "../../constants/message.constants.js";

jest.mock("../../models/notification.model.js");
jest.mock("../../models/notificationconfig.model");

describe("NotificationService", () => {
    let service: NotificationService;

    beforeEach(() => {
        service = new NotificationService();
        jest.clearAllMocks();
    });

    describe("handleGetNotification", () => {
        it("should fetch notifications for a user (success case)", async () => {
            const mockUser = { _id: "user123" };
            const mockNotifications = [
                { id: "n1", message: "Notification 1" },
                { id: "n2", message: "Notification 2" },
            ];

            const mockSort = jest.fn().mockResolvedValue(mockNotifications);
            (Notification.find as jest.Mock).mockReturnValue({ sort: mockSort });

            const result = await service.handleGetNotification(mockUser);

            expect(Notification.find).toHaveBeenCalledWith({ userId: mockUser._id });
            expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
            expect(result).toEqual(mockNotifications);
        });

        it("should throw an error if notifications are not found (null case)", async () => {
            const mockUser = { _id: "user123" };

            const mockSort = jest.fn().mockResolvedValue(null);
            (Notification.find as jest.Mock).mockReturnValue({ sort: mockSort });

            await expect(service.handleGetNotification(mockUser)).rejects.toThrow(
                MessageConstants.notification.fetchError
            );
        });
    });

    describe("handleGetNotificationConfig", () => {
        it("should return notification config for user (success case)", async () => {
            const mockUser = { _id: "user123" };
            const mockConfigs = [{ type: "daily" }, { type: "weekly" }];

            (NotificationConfig.find as jest.Mock).mockResolvedValue(mockConfigs);

            const result = await service.handleGetNotificationConfig(mockUser);

            expect(NotificationConfig.find).toHaveBeenCalledWith({ userId: mockUser._id });
            expect(result).toEqual(mockConfigs);
        });

        it("should throw error if notification config is null", async () => {
            const mockUser = { _id: "user123" };

            (NotificationConfig.find as jest.Mock).mockResolvedValue(null);

            await expect(service.handleGetNotificationConfig(mockUser)).rejects.toThrow(
                MessageConstants.notification.fetchError
            );
        });
    });

    describe("handleAddNotificationConfig", () => {
        it("should add a new notification config (success case)", async () => {
            const mockUser = { _id: "user123" };
            const mockUserPreference = {
                categoryPreference: ["Tech", "Sports"],
                keywords: ["AI", "Football"]
            };

            const mockNotificationConfig = {
                userId: "user123",
                categoryPreference: ["Tech", "Sports"],
                keywords: ["AI", "Football"]
            };

            (NotificationConfig.create as jest.Mock).mockResolvedValue(mockNotificationConfig);

            const result = await service.handleAddNotificationConfig(mockUserPreference, mockUser);

            expect(NotificationConfig.create).toHaveBeenCalledWith({
                userId: mockUser._id,
                categoryPreference: mockUserPreference.categoryPreference,
                keywords: mockUserPreference.keywords
            });
            expect(result).toEqual(mockNotificationConfig);
        });

        it("should throw error when notification config creation fails (null case)", async () => {
            const mockUser = { _id: "user123" };
            const mockUserPreference = {
                categoryPreference: ["Tech"],
                keywords: ["AI"]
            };

            (NotificationConfig.create as jest.Mock).mockResolvedValue(null);

            await expect(
                service.handleAddNotificationConfig(mockUserPreference, mockUser)
            ).rejects.toThrow(MessageConstants.notification.fetchError);
        });
    });

    describe("handleAddCategoryToNotificationConfig", () => {
        it("should add a category to the user's notification config (success case)", async () => {
            const mockUser = { _id: "user123" };
            const category = "Technology";

            const mockUpdatedConfig = {
                userId: "user123",
                categoryPreference: ["Sports", "Technology"],
            };

            (NotificationConfig.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedConfig);

            const result = await service.handleAddCategoryToNotificationConfig(category, mockUser);

            expect(NotificationConfig.findOneAndUpdate).toHaveBeenCalledWith(
                { userId: mockUser._id },
                { $addToSet: { categoryPreference: category } },
                { new: true }
            );
            expect(result).toEqual(mockUpdatedConfig);
        });

        it("should throw an error if update fails (null result)", async () => {
            const mockUser = { _id: "user123" };
            const category = "Health";

            (NotificationConfig.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

            await expect(
                service.handleAddCategoryToNotificationConfig(category, mockUser)
            ).rejects.toThrow(MessageConstants.notification.fetchError);
        });
    });

    describe("handleRemoveCategoryToNotificationConfig", () => {
        it("should remove a category from the user's notification config (success case)", async () => {
            const mockUser = { _id: "user123" };
            const category = "Politics";

            const mockUpdatedConfig = {
                userId: "user123",
                categoryPreference: ["Technology"],
            };

            (NotificationConfig.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedConfig);

            const result = await service.handleRemoveCategoryToNotificationConfig(category, mockUser);

            expect(NotificationConfig.findOneAndUpdate).toHaveBeenCalledWith(
                { userId: mockUser._id },
                { $pull: { categoryPreference: category } },
                { new: true }
            );
            expect(result).toEqual(mockUpdatedConfig);
        });

        it("should throw an error if config update fails (returns null)", async () => {
            const mockUser = { _id: "user123" };
            const category = "Health";

            (NotificationConfig.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

            await expect(
                service.handleRemoveCategoryToNotificationConfig(category, mockUser)
            ).rejects.toThrow(MessageConstants.notification.fetchError);
        });
    });

    describe("handleAddKeywordToNotificationConfig", () => {
        it("should add a keyword to the user's notification config (success case)", async () => {
            const mockUser = { _id: "user123" };
            const keyword = "AI";

            const mockUpdatedConfig = {
                userId: "user123",
                keywords: ["AI", "Tech"],
            };

            (NotificationConfig.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedConfig);

            const result = await service.handleAddKeywordToNotificationConfig(keyword, mockUser);

            expect(NotificationConfig.findOneAndUpdate).toHaveBeenCalledWith(
                { userId: mockUser._id },
                { $addToSet: { keywords: keyword } },
                { new: true }
            );
            expect(result).toEqual(mockUpdatedConfig);
        });

        it("should throw an error if config update fails (null case)", async () => {
            const mockUser = { _id: "user123" };
            const keyword = "Climate";

            (NotificationConfig.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

            await expect(
                service.handleAddKeywordToNotificationConfig(keyword, mockUser)
            ).rejects.toThrow(MessageConstants.notification.fetchError);
        });
    });

    describe("handleRemoveKeywordToNotificationConfig", () => {
        it("should remove a keyword from the user's notification config (success case)", async () => {
            const mockUser = { _id: "user123" };
            const keyword = "AI";

            const mockUpdatedConfig = {
                userId: "user123",
                keywords: ["Tech"],
            };

            (NotificationConfig.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedConfig);

            const result = await service.handleRemoveKeywordToNotificationConfig(keyword, mockUser);

            expect(NotificationConfig.findOneAndUpdate).toHaveBeenCalledWith(
                { userId: mockUser._id },
                { $pull: { keywords: keyword } },
                { new: true }
            );
            expect(result).toEqual(mockUpdatedConfig);
        });

        it("should throw an error if removal fails (null case)", async () => {
            const mockUser = { _id: "user123" };
            const keyword = "Politics";

            (NotificationConfig.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

            await expect(
                service.handleRemoveKeywordToNotificationConfig(keyword, mockUser)
            ).rejects.toThrow(MessageConstants.notification.fetchError);
        });
    });
});