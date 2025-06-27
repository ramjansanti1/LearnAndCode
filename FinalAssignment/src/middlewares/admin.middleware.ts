import { MessageConstants } from "../constants/message.constants.js";

export default class AdminMiddleware {
    async checkAdmin(req: any, res: any, next: Function) {
        try {
            if (req.user?.isAdmin) {
                return next();
            } else {
                return res.status(403).json({ message: MessageConstants.middleware.accessDenied });
            }
        } catch (error) {
            console.error("Admin check error:", error);
            return res.status(500).json({ message: MessageConstants.middleware.checkError });
        }
    }
}