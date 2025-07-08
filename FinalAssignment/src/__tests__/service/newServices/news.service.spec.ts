import NewsService from "../../../service/newsServices/news.service";
import News from "../../../models/news.model";
import SavedArticle from "../../../models/savedArticle.model";
import { MessageConstants } from "../../../constants/message.constants";

jest.mock("../../../models/news.model");
jest.mock("../../../models/savedArticle.model");

describe("ExternalNewsService", () => {
    let service: NewsService;
    const mockNewsSourceInstance = {
        fetchNewsFromExternalApiByCategory: jest.fn(),
        processArticlesToStoreInDB: jest.fn()
    };
    const mockArticleId = "article456";
    const mockUser = { _id: "user123" };

    beforeEach(() => {
        service = new NewsService();
        jest.clearAllMocks();
    });

    describe("handleGetNews", () => {
        it("should return paginated news with total pages (page given)", async () => {
            const mockNews = [{ title: "Article 1" }, { title: "Article 2" }];
            const mockCount = 40;

            (News.find as jest.Mock).mockReturnValue({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                sort: jest.fn().mockResolvedValue(mockNews)
            });
            (News.countDocuments as jest.Mock).mockResolvedValue(mockCount);

            const result = await service.handleGetNews("2");

            expect(News.find).toHaveBeenCalledWith({ blocked: false });
            expect(News.countDocuments).toHaveBeenCalledWith({ blocked: false });
            expect(result).toEqual({
                news: mockNews,
                totalPages: Math.ceil(mockCount / 20)
            });
        });

        it("should fallback to page 1 if invalid page given", async () => {
            const mockNews = [{ title: "Article 1" }];
            const mockCount = 5;

            (News.find as jest.Mock).mockReturnValue({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                sort: jest.fn().mockResolvedValue(mockNews)
            });
            (News.countDocuments as jest.Mock).mockResolvedValue(mockCount);

            const result = await service.handleGetNews("invalid");

            expect(result).toEqual({
                news: mockNews,
                totalPages: Math.ceil(mockCount / 20)
            });
        });
    });

    describe("handleGetNewsBycategory", () => {
        it("should return news and total pages for a valid category and page", async () => {
            const mockNews = [{ title: "Article A" }, { title: "Article B" }];
            const mockCount = 45;

            const sortMock = jest.fn().mockReturnThis();
            const limitMock = jest.fn().mockReturnThis();
            const skipMock = jest.fn().mockResolvedValue(mockNews);

            (News.find as jest.Mock).mockReturnValue({
                sort: sortMock,
                limit: limitMock,
                skip: skipMock
            });

            (News.countDocuments as jest.Mock).mockResolvedValue(mockCount);

            const result = await service.handleGetNewsBycategory("Technology", "2");

            expect(News.find).toHaveBeenCalledWith({ category: "Technology", blocked: false });
            expect(News.countDocuments).toHaveBeenCalledWith({ blocked: false });
            expect(result).toEqual({
                news: mockNews,
                totalPages: Math.ceil(mockCount / 20)
            });
        });

        it("should default to page 1 if page is invalid", async () => {
            const mockNews = [{ title: "Fallback Article" }];
            const mockCount = 20;

            const sortMock = jest.fn().mockReturnThis();
            const limitMock = jest.fn().mockReturnThis();
            const skipMock = jest.fn().mockResolvedValue(mockNews);

            (News.find as jest.Mock).mockReturnValue({
                sort: sortMock,
                limit: limitMock,
                skip: skipMock
            });

            (News.countDocuments as jest.Mock).mockResolvedValue(mockCount);

            const result = await service.handleGetNewsBycategory("Business", "invalid");

            expect(result).toEqual({
                news: mockNews,
                totalPages: 1
            });
        });
    });

    describe("handleGetNewsBySearchQuery", () => {
        it("should return news and total pages for a valid search query and page", async () => {
            const mockNews = [{ title: "Test Article" }];
            const mockCount = 25;

            const skipMock = jest.fn().mockResolvedValue(mockNews);
            const limitMock = jest.fn(() => ({ skip: skipMock }));
            const sortMock = jest.fn(() => ({ limit: limitMock }));
            (News.find as jest.Mock).mockReturnValue({ sort: sortMock });
            (News.countDocuments as jest.Mock).mockResolvedValue(mockCount);

            const result = await service.handleGetNewsBySearchQuery("test", "2");

            expect(News.find).toHaveBeenCalledWith({
                $and: [
                    { blocked: false },
                    {
                        $or: [
                            { title: { $regex: "test", $options: "i" } },
                            { content: { $regex: "test", $options: "i" } },
                            { description: { $regex: "test", $options: "i" } },
                        ],
                    },
                ],
            });

            expect(result).toEqual({
                news: mockNews,
                totalPages: Math.ceil(mockCount / 20),
            });
        });

        it("should default to page 1 when page is invalid", async () => {
            const mockNews = [{ title: "Fallback Article" }];
            const mockCount = 10;

            const skipMock = jest.fn().mockResolvedValue(mockNews);
            const limitMock = jest.fn(() => ({ skip: skipMock }));
            const sortMock = jest.fn(() => ({ limit: limitMock }));
            (News.find as jest.Mock).mockReturnValue({ sort: sortMock });
            (News.countDocuments as jest.Mock).mockResolvedValue(mockCount);

            const result = await service.handleGetNewsBySearchQuery("news", "not-a-number");

            expect(result).toEqual({
                news: mockNews,
                totalPages: 1,
            });
        });
    });

    describe("handleGetNewsByDate", () => {
        it("should return news within the date range", async () => {
            const mockNews = [{ title: "News A" }, { title: "News B" }];
            const mockStartDate = "2024-01-01";
            const mockEndDate = "2024-01-05";

            const sortMock = jest.fn(() => ({
                limit: jest.fn().mockResolvedValue(mockNews)
            }));

            (News.find as jest.Mock).mockReturnValue({ sort: sortMock });

            const result = await service.handleGetNewsByDate({
                startDate: mockStartDate,
                endDate: mockEndDate
            });

            const expectedStart = new Date(mockStartDate);
            const expectedEnd = new Date(mockEndDate);
            expectedEnd.setHours(23, 59, 59, 999);

            expect(News.find).toHaveBeenCalledWith({
                createdAt: {
                    $gte: expectedStart,
                    $lte: expectedEnd
                },
                blocked: false
            });

            expect(result).toEqual(mockNews);
        });
    });

    describe("handleGetSavedNewsArticle", () => {
        it("should return saved articles and total pages (success case)", async () => {
            const user = { _id: "user123" };
            const page = "2";
            const savedArticlesMock = [
                { articleId: "a1" },
                { articleId: "a2" }
            ];
            const newsArticleMocks = [
                { title: "News A" },
                { title: "News B" }
            ];

            (SavedArticle.find as jest.Mock).mockReturnValue({
                skip: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({
                        sort: jest.fn().mockResolvedValue(savedArticlesMock)
                    })
                })
            });

            (News.findById as jest.Mock)
                .mockResolvedValueOnce(newsArticleMocks[0])
                .mockResolvedValueOnce(newsArticleMocks[1]);

            (SavedArticle.countDocuments as jest.Mock).mockResolvedValue(40);

            const result = await service.handleGetSavedNewsArticle(user, page);

            expect(SavedArticle.find).toHaveBeenCalledWith({ userId: user._id });
            expect(News.findById).toHaveBeenCalledWith("a1");
            expect(News.findById).toHaveBeenCalledWith("a2");

            expect(result).toEqual({
                articles: newsArticleMocks,
                totalPages: 2
            });
        });

        it("should throw error when no saved articles are found", async () => {
            const user = { _id: "user123" };

            (SavedArticle.find as jest.Mock).mockReturnValue({
                skip: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({
                        sort: jest.fn().mockResolvedValue(null)
                    })
                })
            });

            await expect(service.handleGetSavedNewsArticle(user, "1")).rejects.toThrow(
                MessageConstants.article.saveNotFound
            );
        });
    });

    describe("handleSaveNewsArticle", () => {
        it("should create and return a saved article (success case)", async () => {
            const mockUser = { _id: "user123" };
            const articleId = "article456";
            const savedArticleMock = {
                savedArticleId: "article456-user123",
                articleId,
                userId: "user123"
            };

            (SavedArticle.create as jest.Mock).mockResolvedValue(savedArticleMock);

            const result = await service.handleSaveNewsArticle(articleId, mockUser);

            expect(SavedArticle.create).toHaveBeenCalledWith({
                savedArticleId: "article456-user123",
                articleId: "article456",
                userId: "user123"
            });

            expect(result).toEqual(savedArticleMock);
        });

        it("should throw an error if article saving fails", async () => {
            const mockUser = { _id: "user123" };
            const articleId = "article456";

            (SavedArticle.create as jest.Mock).mockResolvedValue(null);

            await expect(service.handleSaveNewsArticle(articleId, mockUser)).rejects.toThrow(
                MessageConstants.article.saveNotFound
            );
        });
    });

    describe("handleDeleteNewsArticle", () => {
        it("should delete and return the saved article (success case)", async () => {
            const mockUser = { _id: "user123" };
            const articleId = "article456";
            const deletedArticleMock = {
                articleId: "article456",
                userId: "user123",
                title: "Sample Deleted Article"
            };

            (SavedArticle.findOneAndDelete as jest.Mock).mockResolvedValue(deletedArticleMock);

            const result = await service.handleDeleteNewsArticle(articleId, mockUser);

            expect(SavedArticle.findOneAndDelete).toHaveBeenCalledWith({
                articleId: "article456",
                userId: "user123"
            });

            expect(result).toEqual(deletedArticleMock);
        });

        it("should throw an error if article is not found", async () => {
            const mockUser = { _id: "user123" };
            const articleId = "article456";

            (SavedArticle.findOneAndDelete as jest.Mock).mockResolvedValue(null);

            await expect(service.handleDeleteNewsArticle(articleId, mockUser)).rejects.toThrow(
                MessageConstants.article.saveNotFound
            );
        });
    });

    describe("handlelikeArticle", () => {
        it("should add user ID to likes if not already liked or disliked", async () => {
            const mockUser = { _id: "user123" };
            const mockArticleId = "article123";

            const mockArticle = {
                likes: [],
                dislikes: [],
                save: jest.fn().mockResolvedValue(true)
            };

            jest.spyOn(service as any, "getArticle").mockResolvedValue(mockArticle);

            const result = await service.handlelikeArticle(mockArticleId, mockUser);

            expect(result.likes).toContain("user123");
            expect(mockArticle.save).toHaveBeenCalledWith({ validateBeforeSave: false });
        });

        it("should not add user ID if already liked or disliked", async () => {
            const mockUser = { _id: "user123" };
            const mockArticleId = "article123";

            const mockArticle = {
                likes: ["user123"],
                dislikes: [],
                save: jest.fn()
            };

            jest.spyOn(service as any, "getArticle").mockResolvedValue(mockArticle);

            const result = await service.handlelikeArticle(mockArticleId, mockUser);

            expect(mockArticle.likes).toEqual(["user123"]);
            expect(mockArticle.save).toHaveBeenCalled();
        });
    });

    describe("handleDislikeArticle", () => {
        it("should add user ID to dislikes if not liked or disliked", async () => {
            const mockUser = { _id: "user123" };
            const mockArticleId = "article123";

            const mockArticle = {
                dislikes: [],
                likes: [],
                save: jest.fn().mockResolvedValue(true)
            };

            jest.spyOn(service as any, "getArticle").mockResolvedValue(mockArticle);

            const result = await service.handleDislikeArticle(mockArticleId, mockUser);

            expect(mockArticle.dislikes).toContain("user123");
            expect(mockArticle.save).toHaveBeenCalledWith({ validateBeforeSave: false });
            expect(result).toBe(mockArticle);
        });

        it("should not add user ID to dislikes if already liked or disliked", async () => {
            const mockUser = { _id: "user123" };
            const mockArticleId = "article123";

            const mockArticle = {
                dislikes: ["user123"],
                likes: [],
                save: jest.fn().mockResolvedValue(true)
            };

            jest.spyOn(service as any, "getArticle").mockResolvedValue(mockArticle);

            const result = await service.handleDislikeArticle(mockArticleId, mockUser);

            expect(mockArticle.dislikes).toEqual(["user123"]);
            expect(mockArticle.save).toHaveBeenCalled();
        });
    });

    describe("handleReportArticle", () => {
        it("should block the article if reports exceed threshold", async () => {
            const mockArticle = {
                reports: ["u1", "u2"],
                blocked: false,
                save: jest.fn().mockResolvedValue(true)
            };

            jest.spyOn(service as any, "getArticle").mockResolvedValue(mockArticle);

            const result = await service.handleReportArticle(mockArticleId, mockUser);

            expect(mockArticle.save).toHaveBeenCalledWith({ validateBeforeSave: false });
            expect(result).toEqual(mockArticle);
        });

        it("should add user to reports if not already reported", async () => {
            const mockArticle = {
                reports: [],
                blocked: false,
                save: jest.fn().mockResolvedValue(true)
            };

            jest.spyOn(service as any, "getArticle").mockResolvedValue(mockArticle);

            const result = await service.handleReportArticle(mockArticleId, mockUser);

            expect(mockArticle.reports).toContain(mockUser._id);
            expect(mockArticle.save).toHaveBeenCalledWith({ validateBeforeSave: false });
            expect(result).toEqual(mockArticle);
        });

        it("should not add user again if already reported", async () => {
            const mockArticle = {
                reports: [mockUser._id],
                blocked: false,
                save: jest.fn().mockResolvedValue(true)
            };

            jest.spyOn(service as any, "getArticle").mockResolvedValue(mockArticle);

            const result = await service.handleReportArticle(mockArticleId, mockUser);

            expect(mockArticle.reports.filter(id => id === mockUser._id).length).toBe(1);
            expect(mockArticle.blocked).toBe(false);
            expect(mockArticle.save).toHaveBeenCalled();
            expect(result).toEqual(mockArticle);
        });
    });
});