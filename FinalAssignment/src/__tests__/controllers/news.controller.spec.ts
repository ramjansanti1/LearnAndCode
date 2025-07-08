import NewsController from "../../controllers/news.controller";
import NewsService from "../../service/newsServices/news.service";

jest.mock("../../service/newsServices/news.service");

describe("NewsController", () => {
    let controller: typeof NewsController;
    let mockReq: any;
    let mockRes: any;

    beforeEach(() => {
        controller = NewsController;
        mockReq = { query: {}, user: {} };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe("getNews", () => {
        it("should return news list", async () => {
            const mockData = [{ title: "News Title" }];
            (NewsService.prototype.handleGetNews as jest.Mock).mockResolvedValue(mockData);

            await controller.getNews(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ data: mockData }));
        });

        it("should handle error in getNews", async () => {
            const error = new Error("Fetch failed");
            (NewsService.prototype.handleGetNews as jest.Mock).mockRejectedValue(error);

            await controller.getNews(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: error.message }));
        });
    });

    describe("getNewsByDate", () => {
        it("should return news by date when service succeeds", async () => {
            const mockData = [{ title: "News 1", date: "2024-01-01" }];
            (NewsService.prototype.handleGetNewsByDate as jest.Mock).mockResolvedValue(mockData);

            await controller.getNewsByDate(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: expect.any(String),
                data: mockData
            });
        });

        it("should handle error if service fails", async () => {
            const error = new Error("Failed to fetch");
            (NewsService.prototype.handleGetNewsByDate as jest.Mock).mockRejectedValue(error);

            await controller.getNewsByDate(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: error.message,
                data: error
            });
        });
    });

    describe("getSavedNewsArticle", () => {
        it("should return saved articles on success", async () => {
            const mockSavedArticles = [{ title: "Saved Article 1" }];
            mockReq.user = { id: "user123" };
            mockReq.query.page = 1;

            (NewsService.prototype.handleGetSavedNewsArticle as jest.Mock).mockResolvedValue(mockSavedArticles);

            await controller.getSavedNewsArticle(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: expect.any(String),
                data: mockSavedArticles
            });
        });

        it("should handle error when service fails", async () => {
            const error = new Error("Service failed");
            mockReq.user = { id: "user123" };
            mockReq.query.page = 1;

            (NewsService.prototype.handleGetSavedNewsArticle as jest.Mock).mockRejectedValue(error);

            await controller.getSavedNewsArticle(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: error.message,
                data: error
            });
        });
    });

    describe("saveNewsArticle", () => {
        it("should return saved article on success", async () => {
            const mockArticle = { id: "article123", title: "Saved Article" };
            mockReq.query.articleId = "article123";
            mockReq.user = { id: "user123" };

            (NewsService.prototype.handleSaveNewsArticle as jest.Mock).mockResolvedValue(mockArticle);

            await controller.saveNewsArticle(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: expect.any(String),
                data: mockArticle
            });
        });

        it("should handle error when save fails", async () => {
            const error = new Error("Save failed");
            mockReq.query.articleId = "article123";
            mockReq.user = { id: "user123" };

            (NewsService.prototype.handleSaveNewsArticle as jest.Mock).mockRejectedValue(error);

            await controller.saveNewsArticle(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: error.message,
                data: error
            });
        });
    });

    describe("deleteNewsArticle", () => {
        it("should return deleted article on success", async () => {
            const mockDeletedArticle = { id: "article123", deleted: true };
            mockReq.query.articleId = "article123";
            mockReq.user = { id: "user123" };

            (NewsService.prototype.handleDeleteNewsArticle as jest.Mock).mockResolvedValue(mockDeletedArticle);

            await controller.deleteNewsArticle(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: expect.any(String),
                data: mockDeletedArticle
            });
        });

        it("should handle error if deletion fails", async () => {
            const error = new Error("Deletion failed");
            mockReq.query.articleId = "article123";
            mockReq.user = { id: "user123" };

            (NewsService.prototype.handleDeleteNewsArticle as jest.Mock).mockRejectedValue(error);

            await controller.deleteNewsArticle(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: error.message,
                data: error
            });
        });
    });

    describe("likeArticle", () => {
        it("should return liked article on success", async () => {
            const mockLikedArticle = { id: "article123", likedBy: ["user123"] };
            mockReq.query.articleId = "article123";
            mockReq.user = { id: "user123" };

            (NewsService.prototype.handlelikeArticle as jest.Mock).mockResolvedValue(mockLikedArticle);

            await controller.likeArticle(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: expect.any(String),
                data: mockLikedArticle
            });
        });

        it("should handle error if like fails", async () => {
            const error = new Error("Like failed");
            mockReq.query.articleId = "article123";
            mockReq.user = { id: "user123" };

            (NewsService.prototype.handlelikeArticle as jest.Mock).mockRejectedValue(error);

            await controller.likeArticle(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: error.message,
                data: error
            });
        });
    });

    describe("dislikeArticle", () => {
        it("should return disliked article on success", async () => {
            const mockDislikedArticle = { id: "article123", dislikedBy: ["user123"] };
            mockReq.query.articleId = "article123";
            mockReq.user = { id: "user123" };

            (NewsService.prototype.handleDislikeArticle as jest.Mock).mockResolvedValue(mockDislikedArticle);

            await controller.dislikeArticle(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: expect.any(String),
                data: mockDislikedArticle
            });
        });

        it("should handle error if dislike fails", async () => {
            const error = new Error("Dislike failed");
            mockReq.query.articleId = "article123";
            mockReq.user = { id: "user123" };

            (NewsService.prototype.handleDislikeArticle as jest.Mock).mockRejectedValue(error);

            await controller.dislikeArticle(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: error.message,
                data: error
            });
        });
    });

    describe("reportArticle", () => {
        it("should return reported article on success", async () => {
            const mockReportedArticle = { id: "article123", reportedBy: ["user123"] };
            mockReq.query.articleId = "article123";
            mockReq.user = { id: "user123" };

            (NewsService.prototype.handleReportArticle as jest.Mock).mockResolvedValue(mockReportedArticle);

            await controller.reportArticle(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: expect.any(String),
                data: mockReportedArticle
            });
        });

        it("should handle error if reporting fails", async () => {
            const error = new Error("Reporting failed");
            mockReq.query.articleId = "article123";
            mockReq.user = { id: "user123" };

            (NewsService.prototype.handleReportArticle as jest.Mock).mockRejectedValue(error);

            await controller.reportArticle(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: error.message,
                data: error
            });
        });
    });
});