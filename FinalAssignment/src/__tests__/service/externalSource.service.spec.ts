import ExternalSourceService from "../../service/externalSource.service.js";
import ExternalSource from "../../models/externalSource.model.js";
import { MessageConstants } from "../../constants/message.constants.js";

jest.mock("../../models/externalSource.model.js");

describe("ExternalSourceService", () => {
    let service: ExternalSourceService;

    beforeEach(() => {
        service = new ExternalSourceService();
        jest.clearAllMocks();
    });

    describe("handleGetExternalSource", () => {
        it("should return external sources (success case)", async () => {
            const mockSources = [
                { id: 1, name: "API 1" },
                { id: 2, name: "API 2" },
            ];

            (ExternalSource.find as jest.Mock).mockResolvedValue(mockSources);

            const result = await service.handleGetExternalSource();

            expect(ExternalSource.find).toHaveBeenCalledWith({});
            expect(result).toEqual(mockSources);
        });

        it("should throw error if no sources found (null/undefined)", async () => {
            (ExternalSource.find as jest.Mock).mockResolvedValue(null);

            await expect(service.handleGetExternalSource()).rejects.toThrow(
                MessageConstants.externalSource.fetchError
            );

            expect(ExternalSource.find).toHaveBeenCalledWith({});
        });
    });

    describe("handleAddExternalSource", () => {
        it("should add an external source (success case)", async () => {
            const mockInput = {
                serverName: "Server1",
                apiKey: "API-123"
            };

            const mockResponse = { id: "123", ...mockInput };

            (ExternalSource.create as jest.Mock).mockResolvedValue(mockResponse);

            const result = await service.handleAddExternalSource(mockInput);

            expect(ExternalSource.create).toHaveBeenCalledWith(mockInput);
            expect(result).toEqual(mockResponse);
        });

        it("should throw error if external source creation fails", async () => {
            const mockInput = {
                serverName: "Server2",
                apiKey: "API-456"
            };

            (ExternalSource.create as jest.Mock).mockResolvedValue(null);

            await expect(service.handleAddExternalSource(mockInput)).rejects.toThrow(
                MessageConstants.externalSource.addError
            );
        });
    });

    describe("handleUpdateApiKey", () => {
        it("should update API key and status if external source is found", async () => {
            const mockInput = {
                serverName: "NewsAPI",
                apiKey: "NEW-KEY-123",
                status: true
            };

            const mockDoc = {
                serverName: "NewsAPI",
                apiKey: "OLD-KEY",
                status: false,
                save: jest.fn().mockResolvedValue(undefined)
            };

            (ExternalSource.findOne as jest.Mock).mockResolvedValue(mockDoc);

            const result = await service.handleUpdateApiKey(mockInput);

            expect(ExternalSource.findOne).toHaveBeenCalledWith({ serverName: mockInput.serverName });
            expect(mockDoc.apiKey).toBe(mockInput.apiKey);
            expect(mockDoc.status).toBe(mockInput.status);
            expect(mockDoc.save).toHaveBeenCalledWith({ validateBeforeSave: false });
            expect(result).toBe(mockDoc);
        });

        it("should throw an error if external source is not found", async () => {
            const mockInput = {
                serverName: "NonExistentAPI",
                apiKey: "irrelevant",
                status: false
            };

            (ExternalSource.findOne as jest.Mock).mockResolvedValue(null);

            await expect(service.handleUpdateApiKey(mockInput)).rejects.toThrow(
                MessageConstants.externalSource.fetchError
            );
        });
    });
});