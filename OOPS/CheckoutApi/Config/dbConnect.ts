const { Client } = require('pg');

export class Database {
    client: any;

    constructor() {
        this.client = new Client({
            user: 'myuser',
            host: 'localhost',
            database: 'mydatabase',
            password: 'mypassword',
            port: 5432,
        });
    }

    async connect() {
        try {
            await this.client.connect();
            console.log('Connected to PostgreSQL!');
        } catch (err) {
            console.error('Database connection error', err);
            process.exit(1);
        }
    }

    async disconnect() {
        try {
            await this.client.end();
            console.log('Disconnected from PostgreSQL!');
        } catch (err) {
            console.error('Error disconnecting', err);
        }
    }
}