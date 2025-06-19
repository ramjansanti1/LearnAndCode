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
                .json({ message: "External sources fetched successfully", data: fecthedExternalSourcces });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Error fetching sources", data: error });
        }
    }

    async addExternalSource(req: any, res: any) {
        try {
            const fecthedExternalSourcces = await this.externalSourceService.handleAddExternalSource(req.body);
            return res
                .status(200)
                .json({ message: "External source added successfully", data: fecthedExternalSourcces });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Error adding source", data: error });
        }
    }

    async updateApiKey(req: any, res: any) {
        try {
            const fecthedExternalSourcces = await this.externalSourceService.handleUpdateApiKey(req.body);
            return res
                .status(200)
                .json({ message: "External source API updated successfully", data: fecthedExternalSourcces });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Error updating source", data: error });
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
                .json({ message: "External source status updated successfully", data: fecthedExternalSourcces });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Error updating source", data: error });
        }
    }
}