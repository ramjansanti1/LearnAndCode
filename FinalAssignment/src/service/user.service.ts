import User from "../models/user.model.js";

export default class UserService {
    async handleSignup(userData: { [key: string]: any }) {
        const user = await User.create({
            userName: userData.userName,
            email: userData.email,
            password: userData.password
        });
        return user;
    }

    async handleLogin(userData: { [key: string]: any }) {
        const userFromDatabase = await User.findOne({
            $or: [{ userName: userData.userName }, { email: userData.email }]
        });
        const isPasswordValid = await userFromDatabase?.isPasswordCorrect(userData.password);
        if (!isPasswordValid) {
            throw new Error("INVALID_PASSWORD_ERROR");
        }
        const accessToken = userFromDatabase?.generateAccessToken();
        return {
            userFromDatabase,
            accessToken
        }
    }

    async handleChangePassword(userData: { [key: string]: any }) {
        const userFromDatabase = await User.findOne({
            $or: [{ userName: userData.userName }, { email: userData.email }]
        });
        const isPasswordCorrect = await userFromDatabase?.isPasswordCorrect(userData.oldPassword);
        if (!isPasswordCorrect) {
            throw new Error("UNAUTHORIZED_ACCESS_ERROR");
        }
        if (userFromDatabase) {
            userFromDatabase.password = userData.newPassword;
        }
        await userFromDatabase?.save({ validateBeforeSave: false });
        return userFromDatabase;
    }
}