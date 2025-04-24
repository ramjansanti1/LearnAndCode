const { Client } = require('pg');

const client = new Client({
    user: 'myuser',
    host: 'localhost',
    database: 'mydatabase',
    password: 'mypassword',
    port: 5432,
});

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL!');
    } catch (err: any) {
        console.error('Database connection error', err.stack);
        process.exit(1); 
    }
}

export { client, connectDB };
