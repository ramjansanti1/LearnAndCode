import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export default class AuthMiddleware {
    async verifyJWT(req: any, res: any, next: Function) {
        try {
            const token = req.cookies?.accessToken;
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as {
                _id: string,
                userName: string,
                email: string,
                password: string
            };
            const user = await User.findById(decodedToken?._id).select("-password")
            req.user = user;
            next();
        } catch (error) {
            throw new Error("INVALID_TOKEN_ERROR");
        }
    }
}