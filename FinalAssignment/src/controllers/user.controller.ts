import UserService from "../service/user.service.js";
import NotificationService from "../service/notification.service.js";
import EmailService from '../service/emailServices/email.sercvice.js';
import { MessageConstants } from "../constants/message.constants.js";
import { customObject } from "../types/types.js";
import { Logger } from "../utils/logger.util.js";

class UserController {
    userService: UserService;
    notificationService: NotificationService;
    logger: Logger;

    constructor() {
        this.userService = new UserService();
        this.notificationService = new NotificationService();
        this.logger = new Logger();
        this.signup = this.signup.bind(this);
        this.login = this.login.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    async signup(req: any, res: any) {
        try {
            const createdUser = await this.userService.handleSignup(req.body);
            return res
                .status(201)
                .json({ message: MessageConstants.user.signupSuccess, data: createdUser });
        } catch (error: any) {
            this.logger.error(error.message || MessageConstants.user.signupError);
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.user.signupError, data: error });
        }
    }

    async login(req: any, res: any) {
        try {
            let emailService = new EmailService();
            const loginResponse = await this.userService.handleLogin(req.body);
            await this.notificationService.startNotificationScheduler(loginResponse.userFromDatabase as customObject);
            emailService.startEmailScheduler(loginResponse.userFromDatabase as customObject);
            return res
                .status(200)
                .cookie("accessToken", loginResponse.accessToken)
                .json({ message: MessageConstants.user.loginSuccess, data: loginResponse });
        } catch (error: any) {
            this.logger.error(error.message || MessageConstants.user.loginError);
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.user.loginError, data: error });
        }
    }

    async changePassword(req: any, res: any) {
        try {
            const fecthedUser = await this.userService.handleChangePassword(req.body);
            return res
                .status(200)
                .json({ message: MessageConstants.user.passwordChangeSuccess, data: fecthedUser });
        } catch (error: any) {
            this.logger.error(error.message || MessageConstants.user.passwordChangeError);
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.user.passwordChangeError, data: error });
        }
    }
}

export default new UserController();