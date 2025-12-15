
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') }); // Load root .env?? No, server .env

const prisma = new PrismaClient();

async function main() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@beresinaja.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    console.log(`Seeding Admin: ${adminEmail}`);

    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!existingAdmin) {
        await prisma.user.create({
            data: {
                name: 'Super Admin',
                email: adminEmail,
                password: adminPassword, // Plain text for now as requested
                role: 'admin',
                phone: '081234567890',
                address: 'Kantor Pusat BeresinAja'
            },
        });
        console.log('Admin user created successfully.');
    } else {
        console.log('Admin user already exists.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
