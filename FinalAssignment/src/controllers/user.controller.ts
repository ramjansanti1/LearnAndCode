import UserService from "../service/user.service.js";

class UserController {
    userService: UserService;

    constructor() {
        this.userService = new UserService();
        this.signup = this.signup.bind(this);
        this.login = this.login.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    async signup(req: any, res: any) {
        try {
            const createdUser = await this.userService.handleSignup(req.body);
            return res
                .status(201)
                .json({ message: "User created successfully", data: createdUser });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Error siginig up", data: error });
        }
    }

    async login(req: any, res: any) {
        try {
            const loginResponse = await this.userService.handleLogin(req.body);
            return res
                .status(200)
                .cookie("accessToken", loginResponse.accessToken)
                .json({ message: "logged in successfully", data: loginResponse });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Error logging up", data: error });
        }
    }

    async changePassword(req: any, res: any) {
        try {
            const fecthedUser = await this.userService.handleChangePassword(req.body);
            return res
                .status(200)
                .json({ message: "Password changed successfully", data: fecthedUser });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Error logging up", data: error });
        }
    }
}

export default new UserController();