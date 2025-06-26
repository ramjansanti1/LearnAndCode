import { Document, Model } from "mongoose";

export interface IUser extends Document {
    userName: string;
    email: string;
    password: string;
    isAdmin: Boolean;
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
}
