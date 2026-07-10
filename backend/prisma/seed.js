const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash("password123", 10);

    const admin = await prisma.user.create({
        data: {
            email: "admin@digistore.com",
            fullName: "System Admin",
            password: hashedPassword,
            role: "ADMIN"
        }
    });

    const seller = await prisma.user.create({
        data: {
            email: "seller@digistore.com",
            fullName: "Tech Seller",
            password: hashedPassword,
            role: "SELLER",
            storeName: "DigiTech Academy",
            phone: "09123456789",
            bio: "برترین اکادمی اموزش برنامه نویسی و مهندسی نرم افزار"
        }
    });

    const buyer = await prisma.user.create({
        data: {
            email: "buyer@digistore.com",
            fullName: "Normal User",
            password: hashedPassword,
            role: "BUYER"
        }
    });

    await prisma.product.createMany({
        data: [
            {
                title: "React Masterclass 2026",
                description: "Complete guide to React and Next.js for modern web development.",
                price: 250000,
                category: "Course",
                sellerId: seller.id
            },
            {
                title: "Node.js Backend Architecture",
                description: "Learn how to build scalable backend systems with Express and Prisma.",
                price: 180000,
                category: "Course",
                sellerId: seller.id
            },
            {
                title: "Clean Code Book (PDF)",
                description: "A handbook of agile software craftsmanship.",
                price: 45000,
                category: "Book",
                sellerId: seller.id
            },
            {
                title: "System Design Interview (PDF)",
                description: "Prepare for system design interviews with real world examples.",
                price: 60000,
                category: "Book",
                sellerId: seller.id
            },
            {
                title: "Windows 11 Pro License",
                description: "Lifetime activation key for Windows 11 Pro.",
                price: 500000,
                category: "License",
                sellerId: seller.id
            },
            {
                title: "JetBrains All Products Pack",
                description: "1 Year subscription for all JetBrains IDEs.",
                price: 1200000,
                category: "License",
                sellerId: seller.id
            }
        ]
    });

    console.log("Database seeded successfully with Admin, Seller, Buyer, and 6 products!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });