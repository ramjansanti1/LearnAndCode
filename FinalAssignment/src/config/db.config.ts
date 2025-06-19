import mongoose from 'mongoose';

class Database {
    private static instance: Database;

    private constructor() { }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async connect(): Promise<void> {
        try {
            console.log(`${process.env.MONGODB_URI}`);
            const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
            console.log(`MongoDB connected on host: ${connectionInstance.connection.host}`);
        } catch (error) {
            console.error(`MongoDB connection error: ${(error as Error).message}`);
        }
    }
}

export default Database;