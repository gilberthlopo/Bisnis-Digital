const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.log('.env does not exist');
    process.exit(1);
}

const envConfig = dotenv.parse(fs.readFileSync(envPath));

console.log('Keys found:', Object.keys(envConfig));
if (envConfig.DATABASE_URL) {
    console.log('DATABASE_URL starts with:', envConfig.DATABASE_URL.substring(0, 15));
    // check for garbage chars
    if (envConfig.DATABASE_URL.includes('\uFFFD')) {
        console.log('WARNING: DATABASE_URL contains replacement characters (encoding issue)');
    }
} else {
    console.log('DATABASE_URL is MISSING');
}
