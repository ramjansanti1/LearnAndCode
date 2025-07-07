import UserController from "../../controllers/user.controller";
import UserService from "../../service/user.service";
import NotificationService from "../../service/notification.service";
import Nodemailer from "../../service/emailServices/email.sercvice";

jest.mock("../../service/user.service");
jest.mock("../../service/notification.service");
jest.mock("../../service/emailServices/email.sercvice.js");

describe("NewsController", () => {
    let controller: typeof UserController;
    let mockReq: any;
    let mockRes: any;

    beforeEach(() => {
        controller = UserController;
        mockReq = { query: {}, user: {}, body: { email: "test@example.com", password: "123456" } };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            cookie: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe("signup", () => {
        it("should handle successful signup", async () => {
            const createdUser = { id: 1, email: "test@example.com" };
            (UserService.prototype.handleSignup as jest.Mock).mockResolvedValue(createdUser);

            await controller.signup(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: expect.any(String),
                data: createdUser
            });
        });

        it("should handle signup error", async () => {
            const errorMsg = "Signup failed";
            const error = new Error(errorMsg);
            (UserService.prototype.handleSignup as jest.Mock).mockRejectedValue(error);

            await controller.signup(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: errorMsg,
                data: error
            });
        });
    });

    describe("login", () => {
        it("should handle successful login", async () => {
            const user = { id: 1, email: "test@example.com" };
            const loginResponse = { accessToken: "fakeToken", userFromDatabase: user };

            (UserService.prototype.handleLogin as jest.Mock).mockResolvedValue(loginResponse);
            (NotificationService.prototype.startNotificationScheduler as jest.Mock).mockResolvedValue(undefined);
            (Nodemailer as unknown as jest.Mock).mockImplementation(() => ({
                startEmailScheduler: jest.fn()
            }));

            await controller.login(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.cookie).toHaveBeenCalledWith("accessToken", "fakeToken");
            expect(mockRes.json).toHaveBeenCalledWith({
                message: expect.any(String),
                data: loginResponse
            });
        });

        it("should handle login error", async () => {
            const errorMsg = "Invalid credentials";
            const error = new Error(errorMsg);
            (UserService.prototype.handleLogin as jest.Mock).mockRejectedValue(error);

            await controller.login(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: errorMsg,
                data: error
            });
        });
    });

    describe("changePassword", () => {
        it("should handle successful password change", async () => {
            const mockUser = { id: 1, email: "test@example.com" };
            (UserService.prototype.handleChangePassword as jest.Mock).mockResolvedValue(mockUser);

            await controller.changePassword(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: expect.any(String),
                data: mockUser
            });
        });

        it("should handle error in password change", async () => {
            const errorMsg = "Password update failed";
            const error = new Error(errorMsg);
            (UserService.prototype.handleChangePassword as jest.Mock).mockRejectedValue(error);

            await controller.changePassword(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: errorMsg,
                data: error
            });
        });
    });
});