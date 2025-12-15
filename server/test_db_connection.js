const { Client } = require('pg');

// Using the provided credentials
const connectionString = 'postgresql://postgres.pncmtqpqtboinvkeuhcp:%40gilbrandon1803@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true';

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

async function testConnection() {
    try {
        console.log('Connecting to:', connectionString.replace(/:([^:@]+)@/, ':****@')); // Hide password in log
        await client.connect();
        console.log('Connected successfully!');
        const res = await client.query('SELECT NOW()');
        console.log('Server time:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('Connection failed:', err);
        process.exit(1);
    }
}

testConnection();
