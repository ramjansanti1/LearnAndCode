import ExternalNewsService from "../../../service/newsServices/externalNews.service";
import Category from "../../../models/category.model";

jest.mock("../../../models/news.model");
jest.mock("../../../models/category.model");

describe("ExternalNewsService", () => {
    let service: ExternalNewsService;
    const mockNewsSourceInstance = {
        fetchNewsFromExternalApiByCategory: jest.fn(),
        processArticlesToStoreInDB: jest.fn()
    };

    beforeEach(() => {
        service = new ExternalNewsService();
        jest.spyOn(service, "addDataToDb").mockResolvedValue(undefined);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("fetchNewsFromApi", () => {
        it("should fetch and store news articles for active categories", async () => {
            const categories = [
                { category: "sports", status: true },
                { category: "politics", status: false },
                { category: "technology", status: true }
            ];
            const articles = [{ title: "Sample Article" }];
            const processed = [{ title: "Processed Article" }];

            (Category.find as jest.Mock).mockResolvedValue(categories);
            mockNewsSourceInstance.fetchNewsFromExternalApiByCategory.mockResolvedValue(articles);
            mockNewsSourceInstance.processArticlesToStoreInDB.mockReturnValue(processed);

            await service.fetchNewsFromApi(mockNewsSourceInstance);

            expect(Category.find).toHaveBeenCalled();
            expect(mockNewsSourceInstance.fetchNewsFromExternalApiByCategory).toHaveBeenCalledTimes(2);
            expect(mockNewsSourceInstance.fetchNewsFromExternalApiByCategory).toHaveBeenCalledWith("sports");
            expect(mockNewsSourceInstance.fetchNewsFromExternalApiByCategory).toHaveBeenCalledWith("technology");
            expect(service.addDataToDb).toHaveBeenCalledTimes(2);
            expect(service.addDataToDb).toHaveBeenCalledWith(processed);
        });

        it("should not call fetch if no active categories", async () => {
            (Category.find as jest.Mock).mockResolvedValue([
                { category: "finance", status: false }
            ]);

            await service.fetchNewsFromApi(mockNewsSourceInstance);

            expect(mockNewsSourceInstance.fetchNewsFromExternalApiByCategory).not.toHaveBeenCalled();
            expect(service.addDataToDb).not.toHaveBeenCalled();
        });

        it("should handle empty categories array", async () => {
            (Category.find as jest.Mock).mockResolvedValue([]);

            await service.fetchNewsFromApi(mockNewsSourceInstance);

            expect(mockNewsSourceInstance.fetchNewsFromExternalApiByCategory).not.toHaveBeenCalled();
            expect(service.addDataToDb).not.toHaveBeenCalled();
        });
    });
});