import { MessageConstants } from "../constants/message.constants.js";
import User from "../models/user.model.js";
import { customObject } from "../types/types.js";

export default class UserService {
    async handleSignup(userData: customObject) {
        const user = await User.create({
            userName: userData.userName,
            email: userData.email,
            password: userData.password
        });
        return user;
    }

    async handleLogin(userData: customObject) {
        const userFromDatabase = await User.findOne({
            $or: [{ userName: userData.userName }, { email: userData.email }]
        });
        const isPasswordValid = await userFromDatabase?.isPasswordCorrect(userData.password);
        if (!isPasswordValid) {
            throw new Error(MessageConstants.user.incorrectPassword);
        }
        const accessToken = userFromDatabase?.generateAccessToken();
        return {
            userFromDatabase,
            accessToken
        }
    }

    async handleChangePassword(userData: customObject) {
        const userFromDatabase = await User.findOne({
            $or: [{ userName: userData.userName }, { email: userData.email }]
        });
        const isPasswordCorrect = await userFromDatabase?.isPasswordCorrect(userData.oldPassword);
        if (!isPasswordCorrect) {
            throw new Error(MessageConstants.user.incorrectPassword);
        }
        if (userFromDatabase) {
            userFromDatabase.password = userData.newPassword;
        }
        await userFromDatabase?.save({ validateBeforeSave: false });
        return userFromDatabase;
    }
}