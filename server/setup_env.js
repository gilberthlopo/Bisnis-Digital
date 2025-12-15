const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const content = `DATABASE_URL="postgresql://placeholder:password@localhost:5432/db"
DIRECT_URL="postgresql://placeholder:password@localhost:5432/db"`;

try {
    fs.writeFileSync(envPath, content, { encoding: 'utf8' });
    console.log('.env file written successfully to:', envPath);
} catch (err) {
    console.error('Failed to write .env:', err);
    process.exit(1);
}
