export default class AdminMiddleware {
    async checkAdmin(req: any, res: any, next: Function) {
        try {
            if (req.user?.isAdmin) {
                return next();
            } else {
                return res.status(403).json({ message: "Access denied. Admins only." });
            }
        } catch (error) {
            console.error("Admin check error:", error);
            return res.status(500).json({ message: "Something went wrong" });
        }
    }
} 