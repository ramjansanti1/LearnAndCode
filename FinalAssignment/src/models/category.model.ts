import mongoose from "mongoose";
import { MessageConstants } from "../constants/message.constants";

const categorySchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
            unique: true
        },
        status: {
            type: Boolean,
            required: true,
            default: true
        }
    },
    {
        timestamps: true,
        autoIndex: true
    }
);

const Category = mongoose.model(MessageConstants.model.category, categorySchema);
export default Category;