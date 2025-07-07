import { MessageConstants } from "../constants/message.constants.js";
import ExternalSourceService from "../service/externalSource.service.js";

export default class ExternalSourceController {
    externalSourceService: ExternalSourceService;

    constructor() {
        this.externalSourceService = new ExternalSourceService();
        this.getExternalSource = this.getExternalSource.bind(this);
        this.addExternalSource = this.addExternalSource.bind(this);
        this.updateApiKey = this.updateApiKey.bind(this);
    }

    async getExternalSource(req: any, res: any) {
        try {
            const fecthedExternalSourcces = await this.externalSourceService.handleGetExternalSource();
            return res
                .status(200)
                .json({ message: MessageConstants.externalSource.fetchSuccess, data: fecthedExternalSourcces });
        } catch (error: any) {
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.externalSource.fetchError, data: error });
        }
    }

    async addExternalSource(req: any, res: any) {
        try {
            const fecthedExternalSourcces = await this.externalSourceService.handleAddExternalSource(req.body);
            return res
                .status(200)
                .json({ message: MessageConstants.externalSource.addSuccess, data: fecthedExternalSourcces });
        } catch (error: any) {
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.externalSource.addError, data: error });
        }
    }

    async updateApiKey(req: any, res: any) {
        try {
            const fecthedExternalSourcces = await this.externalSourceService.handleUpdateApiKey(req.body);
            return res
                .status(200)
                .json({ message: MessageConstants.externalSource.apiKeyUpdateSuccess, data: fecthedExternalSourcces });
        } catch (error: any) {
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.externalSource.apiKeyUpdateError, data: error });
        }
    }
}