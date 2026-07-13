const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    // Clear existing records to ensure zero conflicts during setup
    await prisma.review.deleteMany();
    await prisma.license.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.userSubscription.deleteMany();
    await prisma.subscriptionPlan.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash("password123", 10);

    // 1. Core System Administrators
    const admin = await prisma.user.create({
        data: {
            email: "admin@digistore.com",
            fullName: "System Admin",
            password: hashedPassword,
            role: "ADMIN"
        }
    });

    // 2. Verified Specialized Sellers
    const techSeller = await prisma.user.create({
        data: {
            email: "seller@digistore.com",
            fullName: "Tech Seller",
            password: hashedPassword,
            role: "SELLER",
            storeName: "DigiTech Academy",
            phone: "09123456789",
            bio: "برترین آکادمی آموزش برنامه نویسی و مهندسی نرم افزار"
        }
    });

    const bookSeller = await prisma.user.create({
        data: {
            email: "bookseller@digistore.com",
            fullName: "Amin Book Store",
            password: hashedPassword,
            role: "SELLER",
            storeName: "کتابخانه دیجیتال امین",
            phone: "09198765432",
            bio: "مرجع انتشار تخصصی کتاب‌های مهندسی و علوم رایانه"
        }
    });

    // 3. Platform Buyers (Customers)
    const buyer1 = await prisma.user.create({
        data: { email: "buyer1@digistore.com", fullName: "Mahan Soltani", password: hashedPassword, role: "BUYER" }
    });

    const buyer2 = await prisma.user.create({
        data: { email: "buyer2@digistore.com", fullName: "Erfan Baneshi", password: hashedPassword, role: "BUYER" }
    });

    const buyer3 = await prisma.user.create({
        data: { email: "buyer3@digistore.com", fullName: "Rouzbeh Mirmotahari", password: hashedPassword, role: "BUYER" }
    });

    // 4. Shared Subscription Plans for Online Courses (DigiCourse Model)
    const monthlyPlan = await prisma.subscriptionPlan.create({
        data: { title: "اشتراک ماهانه دیجی‌کورس", description: "دسترسی آنلاین کامل به تمامی دوره‌های آموزشی ویدئویی به مدت ۳۰ روز", price: 95000, duration: "MONTHLY", isActive: true }
    });

    const yearlyPlan = await prisma.subscriptionPlan.create({
        data: { title: "اشتراک سالانه دیجی‌کورس", description: "دسترسی آنلاین کامل به تمامی دوره‌های آموزشی ویدئویی به مدت ۳۶۵ روز", price: 790000, duration: "YEARLY", isActive: true }
    });

    // 5. Product Registry Simulation (Approved, Pending, and Rejected Statuses)
    // Category 'Course' products have stream URLs, while 'Book' products contain download paths.
    const course1 = await prisma.product.create({
        data: { title: "React Masterclass 2026", description: "Complete streaming guide to React and Next.js.", price: 250000, category: "Course", fileUrl: "https://stream.digistore.com/react2026", status: "APPROVED", sellerId: techSeller.id }
    });

    const course2 = await prisma.product.create({
        data: { title: "Node.js Backend Architecture", description: "Learn scalable backend systems with Express and Prisma.", price: 180000, category: "Course", fileUrl: "https://stream.digistore.com/nodejs-arch", status: "APPROVED", sellerId: techSeller.id }
    });

    const coursePending = await prisma.product.create({
        data: { title: "Flutter Mobile Development", description: "Cross-platform mobile apps architecture.", price: 320000, category: "Course", fileUrl: "https://stream.digistore.com/flutter-dev", status: "PENDING", sellerId: techSeller.id }
    });

    const book1 = await prisma.product.create({
        data: { title: "Clean Code Book (PDF)", description: "A handbook of agile software craftsmanship.", price: 45000, category: "Book", fileUrl: "https://storage.digistore.com/files/books/clean-code.pdf", status: "APPROVED", sellerId: bookSeller.id }
    });

    const license1 = await prisma.product.create({
        data: { title: "Windows 11 Pro License", description: "Lifetime digital activation key for Windows 11 Pro.", price: 500000, category: "License", fileUrl: "", status: "APPROVED", sellerId: techSeller.id }
    });

    const rejectedProduct = await prisma.product.create({
        data: { title: "Cracked Software Pack v2", description: "Illegal cracked applications download index.", price: 15000, category: "General", fileUrl: "https://storage.digistore.com/cracked.zip", status: "REJECTED", sellerId: techSeller.id }
    });

    // 6. User Subscriptions Generation
    const now = new Date();
    // Active subscription for buyer1
    await prisma.userSubscription.create({
        data: { userId: buyer1.id, subscriptionPlanId: monthlyPlan.id, startDate: now, endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), isActive: true }
    });

    // Expired subscription for buyer2
    await prisma.userSubscription.create({
        data: { userId: buyer2.id, subscriptionPlanId: monthlyPlan.id, startDate: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000), endDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), isActive: false }
    });

    // 7. Core Order Simulation (Single Purchase Flows & Transaction Logging)
    // Buyer 1 purchases a downloaded asset directly (Clean Code PDF)
    const order1 = await prisma.order.create({
        data: {
            buyerId: buyer1.id,
            totalAmount: book1.price,
            status: 'COMPLETED',
            items: { create: [{ productId: book1.id, price: book1.price }] }
        },
        include: { items: true }
    });

    await prisma.transaction.create({
        data: { orderId: order1.id, amount: book1.price, paymentMethod: "ZARINPAL", status: "SUCCESS" }
    });

    await prisma.license.create({
        data: { licenseKey: "BOOK-CLEAN-CODE-A1B2", productId: book1.id, orderItemId: order1.items[0].id, downloadCount: 1, isValid: true }
    });

    // Buyer 3 purchases a software operational asset directly (Windows 11 License)
    const order2 = await prisma.order.create({
        data: {
            buyerId: buyer3.id,
            totalAmount: license1.price,
            status: 'COMPLETED',
            items: { create: [{ productId: license1.id, price: license1.price }] }
        },
        include: { items: true }
    });

    await prisma.transaction.create({
        data: { orderId: order2.id, amount: license1.price, paymentMethod: "SHAPARAK", status: "SUCCESS" }
    });

    await prisma.license.create({
        data: { licenseKey: "WIN11-PRO-X9R2-Z7M1", productId: license1.id, orderItemId: order2.items[0].id, downloadCount: 0, isValid: true }
    });

    console.log("Database successfully seeded with comprehensive real-world simulated data matching SRS requirements!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });