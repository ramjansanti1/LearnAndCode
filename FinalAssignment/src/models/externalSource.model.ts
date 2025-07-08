import mongoose from "mongoose";
import { MessageConstants } from "../constants/message.constants.js";

const externalsourceSchema = new mongoose.Schema(
    {
        serverName: {
            type: String,
            required: true,
            unique: true
        },
        apiKey: {
            type: String
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        }
    },
    {
        timestamps: true,
        autoIndex: true
    }
);

const ExternalSource = mongoose.model(MessageConstants.model.externalSource, externalsourceSchema);
export default ExternalSource;