import ExternalSourceController from "../../controllers/externalSource.controller";
import ExternalSourceService from "../../service/externalSource.service";

jest.mock("../../service/externalSource.service");

describe("ExternalSourceController", () => {
    let controller: ExternalSourceController;
    let mockReq: any;
    let mockRes: any;

    beforeEach(() => {
        controller = new ExternalSourceController();
        mockReq = { body: {} };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe("getExternalSource", () => {
        it("should return external sources on success", async () => {
            const mockData = [{ source: "API1" }];
            (ExternalSourceService.prototype.handleGetExternalSource as jest.Mock).mockResolvedValue(mockData);

            await controller.getExternalSource(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ data: mockData }));
        });

        it("should handle error in getExternalSource", async () => {
            const errorMsg = "Database error";
            (ExternalSourceService.prototype.handleGetExternalSource as jest.Mock).mockRejectedValue(new Error(errorMsg));

            await controller.getExternalSource(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: errorMsg }));
        });
    });

    describe("addExternalSource", () => {
        it("should add external source on success", async () => {
            const mockData = { source: "NewAPI" };
            (ExternalSourceService.prototype.handleAddExternalSource as jest.Mock).mockResolvedValue(mockData);

            await controller.addExternalSource(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ data: mockData }));
        });

        it("should handle error in addExternalSource", async () => {
            const errorMsg = "Insert failed";
            (ExternalSourceService.prototype.handleAddExternalSource as jest.Mock).mockRejectedValue(new Error(errorMsg));

            await controller.addExternalSource(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: errorMsg }));
        });
    });

    describe("updateApiKey", () => {
        it("should update API key on success", async () => {
            const mockData = { apiKey: "12345" };
            (ExternalSourceService.prototype.handleUpdateApiKey as jest.Mock).mockResolvedValue(mockData);

            await controller.updateApiKey(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ data: mockData }));
        });

        it("should handle error in updateApiKey", async () => {
            const errorMsg = "Update failed";
            (ExternalSourceService.prototype.handleUpdateApiKey as jest.Mock).mockRejectedValue(new Error(errorMsg));

            await controller.updateApiKey(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: errorMsg }));
        });
    });
});