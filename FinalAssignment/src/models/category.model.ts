import mongoose from "mongoose";

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

const Category = mongoose.model("Category", categorySchema);
export default Category;