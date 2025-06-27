import { MessageConstants } from "../constants/message.constants.js";
import ExternalSourceService from "../service/externalSource.service.js";

export default class ExternalSourceController {
    externalSourceService: ExternalSourceService;

    constructor() {
        this.externalSourceService = new ExternalSourceService();
        this.getExternalSource = this.getExternalSource.bind(this);
        this.addExternalSource = this.addExternalSource.bind(this);
        this.updateApiKey = this.updateApiKey.bind(this);
        this.activateSource = this.activateSource.bind(this);
        this.decativateSource = this.decativateSource.bind(this);
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

    async activateSource(req: any, res: any) {
        this.updateStatus(req, res, 'active');
    }

    async decativateSource(req: any, res: any) {
        this.updateStatus(req, res, 'inactive');
    }

    private async updateStatus(req: any, res: any, status: 'active' | 'inactive') {
        try {
            const fecthedExternalSourcces = await this.externalSourceService.handleUpdateStatus(req.body, status);
            return res
                .status(200)
                .json({ message: MessageConstants.externalSource.statusUpdateSuccess, data: fecthedExternalSourcces });
        } catch (error: any) {
            return res
                .status(500)
                .json({ message: error.message || MessageConstants.externalSource.statusUpdateError, data: error });
        }
    }
}