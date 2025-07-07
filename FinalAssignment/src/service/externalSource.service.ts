import { MessageConstants } from "../constants/message.constants.js";
import ExternalSource from "../models/externalSource.model.js"
import { customObject } from "../types/types.js";

export default class ExternalSourceService {
    async handleGetExternalSource() {
        const fecthedExternalSourcces = await ExternalSource.find({});
        if (!fecthedExternalSourcces) {
            throw new Error(MessageConstants.externalSource.fetchError);
        }
        return fecthedExternalSourcces;
    }

    async handleAddExternalSource(externalSourceData: customObject) {
        const addedExternalSource = await ExternalSource.create(
            {
                serverName: externalSourceData.serverName,
                apiKey: externalSourceData.apiKey
            }
        );
        if (!addedExternalSource) {
            throw new Error(MessageConstants.externalSource.addError);
        }
        return addedExternalSource;
    }

    async handleUpdateApiKey(apiData: customObject) {
        const fecthedExternalSources = await ExternalSource.findOne({ serverName: apiData.serverName });
        if (!fecthedExternalSources) {
            throw new Error(MessageConstants.externalSource.fetchError);
        }
        if (fecthedExternalSources) {
            fecthedExternalSources.apiKey = apiData.apiKey;
            fecthedExternalSources.status = apiData.status;
        }
        await fecthedExternalSources?.save({ validateBeforeSave: false });
        return fecthedExternalSources;
    }
}