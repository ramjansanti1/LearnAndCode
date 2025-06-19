import mongoose from "mongoose";

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

const ExternalSource = mongoose.model("ExternalSource", externalsourceSchema);
export default ExternalSource;