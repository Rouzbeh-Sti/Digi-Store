const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const prisma = new PrismaClient();

const generateLicenseKey = (prefix) => {
    const cleanPrefix = prefix.replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase().padEnd(4, 'X');
    const randomHex = crypto.randomBytes(6).toString('hex').toUpperCase();
    return `${cleanPrefix}-${randomHex.slice(0, 4)}-${randomHex.slice(4, 8)}-${randomHex.slice(8, 12)}`;
};

async function main() {
    console.log("🌱 Starting Realistic Database Seeding...");

    // 1. Clean existing data
    await prisma.review.deleteMany();
    await prisma.license.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.userSubscription.deleteMany();
    await prisma.subscriptionPlan.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    const defaultPassword = await bcrypt.hash("12345678", 10);

    // 2. Create Users
    console.log("👥 Creating Users...");
    const admin = await prisma.user.create({
        data: { email: "admin@digistore.ir", fullName: "مدیر کل سیستم", password: defaultPassword, role: "ADMIN" }
    });

    const sellerDev = await prisma.user.create({
        data: { email: "erfan@digistore.ir", fullName: "عرفان پنجه‌شاهی", password: defaultPassword, role: "SELLER", storeName: "آکادمی توسعه‌دهندگان", bio: "توسعه‌دهنده ارشد بک‌اند و مدرس معماری نرم‌افزار." }
    });

    const sellerMedia = await prisma.user.create({
        data: { email: "edit@digistore.ir", fullName: "رضا محمدی", password: defaultPassword, role: "SELLER", storeName: "استودیو گرافیک و تدوین", bio: "متخصص پریمیر، افترافکت و تولیدکننده ابزارهای گرافیکی." }
    });

    const sellerTech = await prisma.user.create({
        data: { email: "hvac@digistore.ir", fullName: "علی تاسیسات", password: defaultPassword, role: "SELLER", storeName: "فنی‌کاران پایتخت", bio: "مرجع آموزش‌های تخصصی تعمیرات و ابزارهای مهندسی." }
    });

    const buyers = [];
    for (let i = 1; i <= 26; i++) {
        buyers.push(await prisma.user.create({
            data: { email: `student${i}@sbu.ac.ir`, fullName: `کاربر تستی ${i}`, password: defaultPassword, role: "BUYER" }
        }));
    }

    // 3. Create Subscription Plans
    console.log("💳 Creating Subscription Plans...");
    const monthlyPlan = await prisma.subscriptionPlan.create({
        data: { title: "اشتراک ماهانه دیجی‌کورس", price: 150000, duration: "MONTHLY", isActive: true }
    });
    const yearlyPlan = await prisma.subscriptionPlan.create({
        data: { title: "اشتراک سالانه (اقتصادی)", price: 1200000, duration: "YEARLY", isActive: true }
    });

    // 4. Create Realistic Products
    console.log("📦 Creating Real-World Products...");
    
    const realProducts = [
        // Developer Courses (Seller: Erfan)
        { title: "دوره جامع React.js و Next.js 14", desc: "آموزش پروژه محور فرانت‌اند با جدیدترین آپدیت‌ها.", price: 950000, cat: "Course", sellerId: sellerDev.id, sub: true },
        { title: "معماری نرم‌افزار و Design Patterns", desc: "تسلط بر الگوهای طراحی در سی‌شارپ و جاوا.", price: 650000, cat: "Course", sellerId: sellerDev.id, sub: true },
        { title: "مسترکلاس Node.js و Express", desc: "ساخت API های مقیاس‌پذیر و سریع.", price: 800000, cat: "Course", sellerId: sellerDev.id, sub: true },
        { title: "آموزش Docker و Kubernetes", desc: "استقرار و مدیریت کانتینرها در محیط عملیاتی.", price: 1100000, cat: "Course", sellerId: sellerDev.id, sub: true },
        { title: "توسعه اپلیکیشن با Flutter 3", desc: "ساخت اپ‌های اندروید و iOS با یک سورس‌کد.", price: 850000, cat: "Course", sellerId: sellerDev.id, sub: true },
        { title: "آموزش جامع TypeScript", desc: "کدنویسی امن‌تر و تمیزتر در دنیای جاوااسکریپت.", price: 400000, cat: "Course", sellerId: sellerDev.id, sub: true },
        { title: "توسعه بازی 2D با Unity", desc: "ساخت بازی‌های دو بعدی مشابه Hollow Knight.", price: 750000, cat: "Course", sellerId: sellerDev.id, sub: false },
        { title: "مبانی پایگاه داده PostgreSQL", desc: "طراحی، بهینه‌سازی و کوئری‌نویسی پیشرفته.", price: 500000, cat: "Course", sellerId: sellerDev.id, sub: true },
        { title: "آموزش CI/CD با GitHub Actions", desc: "خودکارسازی فرآیند تست و استقرار نرم‌افزار.", price: 600000, cat: "Course", sellerId: sellerDev.id, sub: true },
        { title: "مقدمه‌ای بر هوش مصنوعی با Python", desc: "آموزش پایه یادگیری ماشین و شبکه‌های عصبی.", price: 1200000, cat: "Course", sellerId: sellerDev.id, sub: false },
        
        // Books (Seller: Erfan)
        { title: "کتاب Clean Code (ترجمه فارسی)", desc: "نسخه PDF کتاب رابرت مارتین با کیفیت بالا.", price: 85000, cat: "Book", sellerId: sellerDev.id, sub: false },
        { title: "کتاب The Pragmatic Programmer", desc: "راهنمای عملی برنامه‌نویسان حرفه‌ای (زبان اصلی).", price: 95000, cat: "Book", sellerId: sellerDev.id, sub: false },
        { title: "کتاب Refactoring - ویرایش دوم", desc: "بهبود طراحی کدهای موجود نوشته مارتین فاولر.", price: 110000, cat: "Book", sellerId: sellerDev.id, sub: false },
        { title: "کتاب Domain-Driven Design", desc: "نسخه اورجینال کتاب اریک ایوانز.", price: 150000, cat: "Book", sellerId: sellerDev.id, sub: false },
        { title: "جزوه خلاصه الگوریتم و ساختمان داده", desc: "مناسب برای آمادگی کنکور ارشد مهندسی کامپیوتر.", price: 45000, cat: "Book", sellerId: sellerDev.id, sub: false },
        
        // Developer Licenses (Seller: Erfan)
        { title: "لایسنس JetBrains All Products", desc: "اشتراک یک ساله اورجینال برای تمامی محصولات جت‌برینز.", price: 2500000, cat: "License", sellerId: sellerDev.id, sub: false },
        { title: "لایسنس WebStorm 2026", desc: "فعال‌سازی قانونی وب‌استورم.", price: 900000, cat: "License", sellerId: sellerDev.id, sub: false },
        { title: "لایسنس Docker Desktop Pro", desc: "اشتراک حرفه‌ای داکر دسکتاپ مخصوص تیم‌ها.", price: 1800000, cat: "License", sellerId: sellerDev.id, sub: false },
        { title: "اشتراک GitHub Copilot", desc: "فعال‌سازی هوش مصنوعی گیت‌هاب کوپایلت برای یک سال.", price: 3200000, cat: "License", sellerId: sellerDev.id, sub: false },
        { title: "لایسنس Postman Professional", desc: "ابزار تست API برای تیم‌های توسعه.", price: 1400000, cat: "License", sellerId: sellerDev.id, sub: false },

        // Media Courses (Seller: Reza)
        { title: "آموزش جامع Adobe Premiere Pro", desc: "تدوین حرفه‌ای ویدیو برای یوتیوب و سینما.", price: 850000, cat: "Course", sellerId: sellerMedia.id, sub: true },
        { title: "موشن گرافیک با After Effects", desc: "تکنیک‌های ساخت تیزرهای تبلیغاتی.", price: 1100000, cat: "Course", sellerId: sellerMedia.id, sub: true },
        { title: "ادیت عکس با Photoshop", desc: "از رتوش پرتره تا طراحی پوستر.", price: 650000, cat: "Course", sellerId: sellerMedia.id, sub: true },
        { title: "آموزش طراحی رابط کاربری (UI/UX)", desc: "طراحی حرفه‌ای اپلیکیشن با Figma.", price: 950000, cat: "Course", sellerId: sellerMedia.id, sub: true },
        { title: "تکنیک‌های نورپردازی در عکاسی", desc: "آموزش عملی در استودیو.", price: 700000, cat: "Course", sellerId: sellerMedia.id, sub: false },
        
        // Media Assets & Licenses (Seller: Reza)
        { title: "پکیج ترانزیشن‌های پریمیر (بسته طلایی)", desc: "بیش از 500 ترانزیشن حرفه‌ای.", price: 250000, cat: "Book", sellerId: sellerMedia.id, sub: false },
        { title: "پلاگین Element 3D برای افترافکت", desc: "لایسنس قانونی پلاگین سه بعدی.", price: 1200000, cat: "License", sellerId: sellerMedia.id, sub: false },
        { title: "پروژه‌های آماده Figma برای فروشگاه", desc: "کیت طراحی UI شامل 150 صفحه.", price: 400000, cat: "Book", sellerId: sellerMedia.id, sub: false },
        { title: "لایسنس Adobe Creative Cloud", desc: "دسترسی یک ساله به تمامی برنامه‌های ادوبی.", price: 4500000, cat: "License", sellerId: sellerMedia.id, sub: false },
        { title: "اشتراک Envato Elements", desc: "دسترسی به میلیون‌ها فایل گرافیکی.", price: 1800000, cat: "License", sellerId: sellerMedia.id, sub: false },

        // Technical & HVAC Courses (Seller: Ali)
        { title: "دوره جامع تعمیرات پکیج شوفاژ دیواری", desc: "ورود سریع به بازار کار تاسیسات.", price: 1500000, cat: "Course", sellerId: sellerTech.id, sub: false },
        { title: "آموزش نصب و عیب‌یابی کولر گازی", desc: "از صفر تا صد نصب اسپلیت.", price: 1200000, cat: "Course", sellerId: sellerTech.id, sub: true },
        { title: "نقشه‌خوانی برق صنعتی", desc: "آموزش تابلو برق و مدارات فرمان.", price: 800000, cat: "Course", sellerId: sellerTech.id, sub: true },
        { title: "طراحی تاسیسات با AutoCAD", desc: "ترسیم نقشه‌های مکانیکی ساختمان.", price: 900000, cat: "Course", sellerId: sellerTech.id, sub: true },
        { title: "آموزش جوشکاری لوله‌های مسی", desc: "آموزش عملی جوشکاری تبرید.", price: 650000, cat: "Course", sellerId: sellerTech.id, sub: false },
        
        // Technical Books & Licenses (Seller: Ali)
        { title: "کتاب هندبوک تاسیسات ASHRAE", desc: "مرجع اصلی مهندسی مکانیک سیالات.", price: 180000, cat: "Book", sellerId: sellerTech.id, sub: false },
        { title: "استانداردهای ملی ساختمان (مبحث 14 و 16)", desc: "فایل PDF مباحث مقررات ملی.", price: 60000, cat: "Book", sellerId: sellerTech.id, sub: false },
        { title: "لایسنس نرم‌افزار Carrier HAP", desc: "محاسبه بار حرارتی و برودتی ساختمان.", price: 2100000, cat: "License", sellerId: sellerTech.id, sub: false },
        { title: "نرم‌افزار EES (نسخه اورجینال)", desc: "لایسنس نرم‌افزار طراحی سیستم‌های تهویه.", price: 1600000, cat: "License", sellerId: sellerTech.id, sub: false },
        { title: "بانک خطاهای پکیج‌های ایرانی", desc: "فایل PDF شامل کدهای خطای ایران‌رادیاتور و بوتان.", price: 40000, cat: "Book", sellerId: sellerTech.id, sub: false }
    ];

    const dbProducts = [];
    for (const p of realProducts) {
        dbProducts.push(await prisma.product.create({
            data: {
                title: p.title,
                description: p.desc,
                price: p.price,
                category: p.cat,
                fileUrl: p.cat === 'License' ? "" : `https://storage.digistore.ir/${crypto.randomBytes(4).toString('hex')}`,
                status: Math.random() > 0.9 ? "PENDING" : "APPROVED",
                sellerId: p.sellerId,
                allowSubscription: p.sub
            }
        }));
    }

    // 5. Create Subscriptions
    console.log("🎫 Activating Subscriptions...");
    for (let i = 0; i < 10; i++) {
        await prisma.userSubscription.create({
            data: {
                userId: buyers[i].id, subscriptionPlanId: monthlyPlan.id,
                startDate: new Date(), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), isActive: true
            }
        });
    }

    // 6. Generate 120 Realistic Orders
    console.log("🛒 Simulating 120 Orders & Transactions...");
    const approvedProducts = dbProducts.filter(p => p.status === "APPROVED");
    
    for (let i = 1; i <= 120; i++) {
        const buyer = buyers[Math.floor(Math.random() * buyers.length)];
        const product = approvedProducts[Math.floor(Math.random() * approvedProducts.length)];
        const isSuccess = Math.random() > 0.15; 
        const orderStatus = isSuccess ? 'COMPLETED' : 'FAILED';

        const order = await prisma.order.create({
            data: {
                buyerId: buyer.id, totalAmount: product.price, status: orderStatus,
                items: { create: [{ productId: product.id, price: product.price }] }
            },
            include: { items: true }
        });

        await prisma.transaction.create({
            data: {
                orderId: order.id, amount: product.price, paymentMethod: "ZARINPAL",
                status: isSuccess ? "SUCCESS" : "FAILED",
                authority: `ZRN-${crypto.randomBytes(8).toString('hex').toUpperCase()}`
            }
        });

        if (isSuccess && product.category !== 'Course') {
            await prisma.license.create({
                data: {
                    licenseKey: generateLicenseKey(product.title),
                    productId: product.id, orderItemId: order.items[0].id, isValid: true
                }
            });
        }
    }

    // 7. Generate Real-looking Reviews
    console.log("💬 Generating Reviews...");
    const reviewsSet = [
        { r: 5, c: "واقعاً عالی بود، خیلی تو پروژه‌های کاری کمکم کرد." },
        { r: 5, c: "لایسنس درجا فعال شد، دمتون گرم." },
        { r: 4, c: "محتوا خوب بود ولی کاش کیفیت ویدیوها بالاتر بود." },
        { r: 5, c: "بهترین خریدی بود که از این سایت داشتم." },
        { r: 3, c: "معمولی بود، انتظار بیشتری داشتم راستش." },
        { r: 4, c: "فایل PDF کامل و خوانا بود." },
        { r: 5, c: "پشتیبانی عالی و فعال‌سازی سریع." },
        { r: 2, c: "خیلی پیچیده توضیح داده شده بود، مناسب مبتدی‌ها نیست." },
        { r: 5, c: "ممنون از استاد عزیز بابت تدریس فوق‌العاده‌شون." }
    ];

    const completedOrders = await prisma.orderItem.findMany({
        where: { order: { status: 'COMPLETED' }, productId: { not: null } },
        include: { order: true }
    });

    const reviewedPairs = new Set();

    for (const item of completedOrders) {
        const pairKey = `${item.order.buyerId}-${item.productId}`;
        if (!reviewedPairs.has(pairKey) && Math.random() > 0.3) { 
            reviewedPairs.add(pairKey);
            const reviewTemplate = reviewsSet[Math.floor(Math.random() * reviewsSet.length)];

            await prisma.review.create({
                data: {
                    rating: reviewTemplate.r, comment: reviewTemplate.c,
                    userId: item.order.buyerId, productId: item.productId
                }
            });
        }
    }

    // 8. Update Product Metrics
    console.log("📊 Recalculating Product Metrics...");
    for (const p of approvedProducts) {
        const aggregations = await prisma.review.aggregate({
            where: { productId: p.id },
            _avg: { rating: true },
            _count: { id: true }
        });
        
        if (aggregations._count.id > 0) {
            await prisma.product.update({
                where: { id: p.id },
                data: { averageRating: aggregations._avg.rating, reviewCount: aggregations._count.id }
            });
        }
    }

    console.log("✅ Realistic Database Seeding Completed!");
}

main()
    .catch((e) => {
        console.error("❌ Seeding Failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });