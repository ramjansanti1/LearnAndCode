import ExternalSource from "../models/externalSource.model.js"

export default class ExternalSourceService {
    async handleGetExternalSource() {
        const fecthedExternalSourcces = await ExternalSource.find({});
        if (!fecthedExternalSourcces) {
            throw new Error("No external source found");
        }
        return fecthedExternalSourcces;
    }

    async handleAddExternalSource(externalSourceData: { [key: string]: any }) {
        const addedExternalSource = await ExternalSource.create(
            {
                serverName: externalSourceData.serverName,
                apiKey: externalSourceData.apiKey
            }
        );
        if (!addedExternalSource) {
            throw new Error("Error adding source");
        }
        return addedExternalSource;
    }

    async handleUpdateApiKey(apiData: { [key: string]: any }) {
        const fecthedExternalSources = await ExternalSource.findOne({ serverName: apiData.serverName });
        if (!fecthedExternalSources) {
            throw new Error("No external source found");
        }
        if (fecthedExternalSources) {
            fecthedExternalSources.apiKey = apiData.apiKey;
        }
        await fecthedExternalSources?.save({ validateBeforeSave: false });
        return fecthedExternalSources;
    }

    async handleUpdateStatus(serverData: { [key: string]: any }, status: 'active' | 'inactive') {
        const fecthedExternalSources = await ExternalSource.findOne({ serverName: serverData.serverName });
        if (!fecthedExternalSources) {
            throw new Error("No external source found");
        }
        if (fecthedExternalSources) {
            fecthedExternalSources.status = status;
        }
        await fecthedExternalSources?.save({ validateBeforeSave: false });
        return fecthedExternalSources;
    }
}