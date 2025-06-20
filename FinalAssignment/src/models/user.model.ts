import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { IUser } from "../interfaces/user.interface.js";

const userSchema = new Schema<IUser>(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            set: (value: string) => value.toLowerCase()
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^\S+@\S+\.\S+$/
        },
        password: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName
        },
        process.env.ACCESS_TOKEN_SECRET as string
    );
};

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = model<IUser>("User", userSchema);
export default User;