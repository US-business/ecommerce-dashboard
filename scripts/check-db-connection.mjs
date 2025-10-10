import pg from 'pg';
import fs from 'fs';
import path from 'path';

// Function to parse .env.local
function loadEnv(filePath) {
    const envPath = path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(envPath)) {
        console.error(`🔴 .env.local file not found at ${envPath}`);
        process.exit(1);
    }
    const envFile = fs.readFileSync(envPath, 'utf-8');
    envFile.split('\n').forEach(line => {
        const match = line.match(/^([^#=]+)=(.+)/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            process.env[key] = value;
        }
    });
}

// Load environment variables
loadEnv('.env.local');

const { Pool } = pg;

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.error('🔴 DATABASE_URL not found in .env.local');
    process.exit(1);
}

console.log('🔵 Attempting to connect to the database...');

const pool = new Pool({
    connectionString: dbUrl,
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('🔴 Error connecting to the database:', err.stack);
        process.exit(1);
    }
    console.log('✅ Successfully connected to the database!');
    client.query('SELECT NOW()', (err, result) => {
        release();
        if (err) {
            console.error('🔴 Error during query:', err.stack);
            process.exit(1);
        }
        console.log('🕒 Server time:', result.rows[0].now);
        pool.end();
    });
});
