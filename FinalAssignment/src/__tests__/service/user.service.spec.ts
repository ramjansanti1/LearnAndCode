import UserService from "../../service/user.service";
import User from "../../models/user.model";
import NotificationConfig from "../../models/notificationconfig.model";
import { MessageConstants } from "../../constants/message.constants";

jest.mock("../../models/user.model");
jest.mock("../../models/notificationconfig.model");

describe("UserService", () => {
    let service: UserService;

    beforeEach(() => {
        service = new UserService();
        jest.clearAllMocks();
    });

    describe("handleSignup", () => {
        it("should create a new user and initialize notification config (success case)", async () => {
            const userData = {
                userName: "John",
                email: "john@example.com",
                password: "securepass",
            };

            const mockUser = { _id: "u123", ...userData };

            (User.create as jest.Mock).mockResolvedValue(mockUser);
            (NotificationConfig.create as jest.Mock).mockResolvedValue({ userId: "u123" });

            const result = await service.handleSignup(userData);

            expect(User.create).toHaveBeenCalledWith({
                userName: userData.userName,
                email: userData.email,
                password: userData.password,
            });

            expect(NotificationConfig.create).toHaveBeenCalledWith({
                userId: mockUser._id,
                categoryPreference: [],
                keywords: [],
            });

            expect(result).toEqual(mockUser);
        });

        it("should throw an error if user creation fails", async () => {
            const userData = {
                userName: "Jane",
                email: "jane@example.com",
                password: "securepass",
            };

            (User.create as jest.Mock).mockRejectedValue(new Error("User creation failed"));

            await expect(service.handleSignup(userData)).rejects.toThrow("User creation failed");

            expect(User.create).toHaveBeenCalledTimes(1);
            expect(NotificationConfig.create).not.toHaveBeenCalled();
        });

        it("should throw an error if notification config creation fails", async () => {
            const userData = {
                userName: "Alex",
                email: "alex@example.com",
                password: "pass123",
            };

            const mockUser = { _id: "user456", ...userData };

            (User.create as jest.Mock).mockResolvedValue(mockUser);
            (NotificationConfig.create as jest.Mock).mockRejectedValue(new Error("Notification init failed"));

            await expect(service.handleSignup(userData)).rejects.toThrow("Notification init failed");

            expect(User.create).toHaveBeenCalledTimes(1);
            expect(NotificationConfig.create).toHaveBeenCalledTimes(1);
        });
    });

    describe("handleLogin", () => {
        it("should login successfully and return user and token", async () => {
            const userData = {
                userName: "john_doe",
                email: "john@example.com",
                password: "securepass"
            };

            const mockUser = {
                _id: "user123",
                userName: "john_doe",
                email: "john@example.com",
                isPasswordCorrect: jest.fn().mockResolvedValue(true),
                generateAccessToken: jest.fn().mockReturnValue("mock_token"),
            };

            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            const result = await service.handleLogin(userData);

            expect(User.findOne).toHaveBeenCalledWith({
                $or: [{ userName: userData.userName }, { email: userData.email }],
            });

            expect(mockUser.isPasswordCorrect).toHaveBeenCalledWith(userData.password);
            expect(mockUser.generateAccessToken).toHaveBeenCalled();

            expect(result).toEqual({
                userFromDatabase: mockUser,
                accessToken: "mock_token"
            });
        });

        it("should throw an error if password is incorrect", async () => {
            const userData = {
                userName: "john_doe",
                email: "john@example.com",
                password: "wrongpass"
            };

            const mockUser = {
                isPasswordCorrect: jest.fn().mockResolvedValue(false),
            };

            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await expect(service.handleLogin(userData)).rejects.toThrow(
                MessageConstants.user.incorrectPassword
            );

            expect(User.findOne).toHaveBeenCalled();
            expect(mockUser.isPasswordCorrect).toHaveBeenCalledWith(userData.password);
        });

        it("should throw if user is not found", async () => {
            const userData = {
                userName: "unknown",
                email: "unknown@example.com",
                password: "doesntmatter"
            };

            (User.findOne as jest.Mock).mockResolvedValue(null);

            await expect(service.handleLogin(userData)).rejects.toThrow(
                MessageConstants.user.incorrectPassword
            );
        });
    });

    describe("handleChangePassword", () => {
        it("should change password successfully (success case)", async () => {
            const userData = {
                userName: "john_doe",
                email: "john@example.com",
                oldPassword: "old123",
                newPassword: "new456"
            };

            const mockUser = {
                password: "old123",
                isPasswordCorrect: jest.fn().mockResolvedValue(true),
                save: jest.fn().mockResolvedValue(undefined),
            };

            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            const result = await service.handleChangePassword(userData);

            expect(User.findOne).toHaveBeenCalledWith({
                $or: [{ userName: userData.userName }, { email: userData.email }]
            });

            expect(mockUser.isPasswordCorrect).toHaveBeenCalledWith(userData.oldPassword);
            expect(mockUser.password).toEqual(userData.newPassword);
            expect(mockUser.save).toHaveBeenCalledWith({ validateBeforeSave: false });
            expect(result).toBe(mockUser);
        });

        it("should throw an error if the password is incorrect (error case)", async () => {
            const userData = {
                userName: "john_doe",
                email: "john@example.com",
                oldPassword: "wrong",
                newPassword: "new456"
            };

            const mockUser = {
                isPasswordCorrect: jest.fn().mockResolvedValue(false),
            };

            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await expect(service.handleChangePassword(userData)).rejects.toThrow(
                MessageConstants.user.incorrectPassword
            );

            expect(mockUser.isPasswordCorrect).toHaveBeenCalledWith(userData.oldPassword);
        });

        it("should not crash if user is not found (null check)", async () => {
            const userData = {
                userName: "john_doe",
                email: "john@example.com",
                oldPassword: "old123",
                newPassword: "new456"
            };

            (User.findOne as jest.Mock).mockResolvedValue(null);

            await expect(service.handleChangePassword(userData)).rejects.toThrow(
                MessageConstants.user.incorrectPassword
            );
        });
    });
});