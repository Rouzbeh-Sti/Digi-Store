const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

/**
 * Improved Order Seeder for Recommendation Testing
 * 
 * KEY PRINCIPLE: Every product that appears in recommendations
 * must be bought by AT LEAST 2 users. Otherwise collaborative filtering
 * has no signal to work with.
 * 
 * Strategy:
 * 1. Define "anchor products" per category (popular items bought by many)
 * 2. Each buyer buys anchor products + their specialty products
 * 3. This creates strong co-purchase signals across ALL categories
 */

function generateLicenseKey(title) {
    const prefix = title.substring(0, 4).toUpperCase().padEnd(4, 'X');
    const randomHex = crypto.randomBytes(6).toString('hex').toUpperCase();
    return `${prefix}-${randomHex.slice(0, 4)}-${randomHex.slice(4, 8)}-${randomHex.slice(8, 12)}`;
}

async function seedOrders() {
    console.log("🛒 Starting IMPROVED order seed for recommendation testing...");

    const buyer1 = await prisma.user.findUnique({ where: { email: "buyer1@digistore.com" } });
    const buyer2 = await prisma.user.findUnique({ where: { email: "buyer2@digistore.com" } });
    const buyer3 = await prisma.user.findUnique({ where: { email: "buyer3@digistore.com" } });

    if (!buyer1 || !buyer2 || !buyer3) {
        console.error("❌ Run main seed.js first.");
        process.exit(1);
    }

    const getProduct = async (title) => {
        return await prisma.product.findFirst({ where: { title } });
    };

    const createOrder = async (buyerId, productTitles, paymentMethod = 'ZARINPAL') => {
        const products = [];
        for (const title of productTitles) {
            const p = await getProduct(title);
            if (p) products.push(p);
        }
        if (products.length === 0) return;

        const totalAmount = products.reduce((sum, p) => sum + p.price, 0);

        const order = await prisma.order.create({
            data: {
                buyerId,
                totalAmount,
                status: 'COMPLETED',
                items: {
                    create: products.map(p => ({
                        productId: p.id,
                        price: p.price
                    }))
                }
            },
            include: { items: true }
        });

        await prisma.transaction.create({
            data: {
                orderId: order.id,
                amount: totalAmount,
                paymentMethod,
                status: 'SUCCESS'
            }
        });

        for (const item of order.items) {
            const product = products.find(p => p.id === item.productId);
            if (product && product.category !== 'Course') {
                await prisma.license.create({
                    data: {
                        licenseKey: generateLicenseKey(product.title),
                        productId: product.id,
                        orderItemId: item.id,
                        isValid: true
                    }
                });
            }
        }

        return order;
    };

    // ═══════════════════════════════════════════════════════════════════════
    // ANCHOR PRODUCTS: Bought by ALL 3 buyers (creates universal signals)
    // ═══════════════════════════════════════════════════════════════════════
    console.log("  🔗 Creating ANCHOR purchases (bought by all 3 users)...");

    // These create the backbone of collaborative filtering
    const anchorCourses = ['React', 'TypeScript'];
    const anchorBooks = ['Clean Code'];
    const anchorLicenses = ['JetBrains All Products Pack'];

    for (const title of anchorCourses) {
        await createOrder(buyer1.id, [title]);
        await createOrder(buyer2.id, [title]);
        await createOrder(buyer3.id, [title]);
    }
    for (const title of anchorBooks) {
        await createOrder(buyer1.id, [title]);
        await createOrder(buyer2.id, [title]);
        await createOrder(buyer3.id, [title]);
    }
    for (const title of anchorLicenses) {
        await createOrder(buyer1.id, [title]);
        await createOrder(buyer2.id, [title]);
        await createOrder(buyer3.id, [title]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // CATEGORY ANCHORS: Bought by 2 users per category
    // This ensures every category has co-purchase signals
    // ═══════════════════════════════════════════════════════════════════════
    console.log("  🔗 Creating CATEGORY ANCHOR purchases...");

    // Web Dev anchors (buyer1 + buyer2)
    await createOrder(buyer1.id, ['Next.js', 'Node.js']);
    await createOrder(buyer2.id, ['Next.js', 'Vue.js']);
    await createOrder(buyer1.id, ['GraphQL', 'REST API Design']);
    await createOrder(buyer2.id, ['GraphQL']);

    // Mobile anchors (buyer2 + buyer3)
    await createOrder(buyer2.id, ['Flutter', 'React Native']);
    await createOrder(buyer3.id, ['Flutter', 'Swift UI']);
    await createOrder(buyer2.id, ['iOS Development']);
    await createOrder(buyer3.id, ['iOS Development', 'Android Development']);

    // Data Science anchors (buyer1 + buyer3)
    await createOrder(buyer1.id, ['Python for Data Science']);
    await createOrder(buyer3.id, ['Python for Data Science', 'Machine Learning Basics']);
    await createOrder(buyer1.id, ['Data Visualization']);
    await createOrder(buyer3.id, ['Data Visualization', 'Deep Learning with PyTorch']);

    // Book anchors (buyer1 + buyer2 + buyer3 mixed)
    await createOrder(buyer1.id, ['Design Patterns']);
    await createOrder(buyer2.id, ['Design Patterns', 'The Pragmatic Programmer']);
    await createOrder(buyer3.id, ['The Pragmatic Programmer', 'Introduction to Algorithms']);
    await createOrder(buyer1.id, ['Refactoring']);
    await createOrder(buyer3.id, ['Refactoring']);

    // License anchors
    await createOrder(buyer1.id, ['VS Code Pro (GitHub Copilot)']);
    await createOrder(buyer2.id, ['VS Code Pro (GitHub Copilot)', 'Figma Professional']);
    await createOrder(buyer1.id, ['Docker Desktop Pro']);
    await createOrder(buyer3.id, ['Docker Desktop Pro', 'PyCharm Professional']);

    // ═══════════════════════════════════════════════════════════════════════
    // SPECIALTY CLUSTERS: Each buyer's unique interests
    // These create the "personalized" feel while anchors provide overlap
    // ═══════════════════════════════════════════════════════════════════════
    console.log("  👤 Creating BUYER 1 specialty (Web Dev + DevOps)...");
    await createOrder(buyer1.id, ['Express.js', 'NestJS']);
    await createOrder(buyer1.id, ['JavaScript Advanced', 'ES6+ Features']);
    await createOrder(buyer1.id, ['Docker & Kubernetes', 'CI/CD Pipelines']);
    await createOrder(buyer1.id, ['Terraform', 'Infrastructure as Code']);
    await createOrder(buyer1.id, ['AWS Solutions Architect']);
    await createOrder(buyer1.id, ['WebStorm License', 'DataGrip License']);
    await createOrder(buyer1.id, ['GitHub Actions', 'Postman Team']);
    await createOrder(buyer1.id, ['Code Complete', 'Working Effectively with Legacy Code']);
    await createOrder(buyer1.id, ['Head First Design Patterns']);

    console.log("  👤 Creating BUYER 2 specialty (Mobile + Design)...");
    await createOrder(buyer2.id, ['Kotlin Multiplatform', 'Cross-platform Architecture']);
    await createOrder(buyer2.id, ['Mobile UX Design', 'App Store Optimization']);
    await createOrder(buyer2.id, ['Adobe Creative Cloud', 'Sketch License']);
    await createOrder(buyer2.id, ['Adobe Photoshop', 'Adobe Illustrator']);
    await createOrder(buyer2.id, ['Canva Pro', 'InVision Studio']);
    await createOrder(buyer2.id, ['Notion Team', 'Slack Pro']);
    await createOrder(buyer2.id, ['Software Architecture in Practice']);
    await createOrder(buyer2.id, ['The Clean Coder']);

    console.log("  👤 Creating BUYER 3 specialty (Data Science + AI)...");
    await createOrder(buyer3.id, ['TensorFlow Mastery', 'NLP with Python']);
    await createOrder(buyer3.id, ['Computer Vision', 'Time Series Analysis']);
    await createOrder(buyer3.id, ['MLOps', 'Big Data with Spark']);
    await createOrder(buyer3.id, ['Statistical Analysis', 'Feature Engineering']);
    await createOrder(buyer3.id, ['Model Deployment', 'A/B Testing']);
    await createOrder(buyer3.id, ['TablePlus License', 'Notion Team']);
    await createOrder(buyer3.id, ['Reinforcement Learning']);
    await createOrder(buyer3.id, ['Domain-Driven Design']);

    // ═══════════════════════════════════════════════════════════════════════
    // CROSS-CATEGORY DISCOVERY purchases
    // Users sometimes buy outside their main interest — creates variety
    // ═══════════════════════════════════════════════════════════════════════
    console.log("  🌉 Creating CROSS-CATEGORY discovery purchases...");

    // Web dev buyer discovers data science
    await createOrder(buyer1.id, ['Python for Data Science']);  // Already anchor
    await createOrder(buyer1.id, ['Machine Learning Basics']);

    // Mobile buyer discovers web dev
    await createOrder(buyer2.id, ['React']);  // Already anchor
    await createOrder(buyer2.id, ['Node.js']);

    // Data science buyer discovers web dev
    await createOrder(buyer3.id, ['React']);  // Already anchor
    await createOrder(buyer3.id, ['TypeScript']);  // Already anchor
    await createOrder(buyer3.id, ['Next.js']);

    // Book crossovers
    await createOrder(buyer1.id, ['Introduction to Algorithms']);
    await createOrder(buyer2.id, ['Clean Code']);  // Already anchor
    await createOrder(buyer2.id, ['Refactoring']);  // Already anchor
    await createOrder(buyer3.id, ['Design Patterns']);  // Already anchor

    console.log("✅ Order seed complete!");
    console.log(`📊 Total orders: ${await prisma.order.count()}`);
    console.log(`📊 Total licenses: ${await prisma.license.count()}`);

    // Verify co-purchase signals
    console.log("\n📈 Co-purchase signal verification:");
    const verifyCoPurchase = async (title) => {
        const product = await getProduct(title);
        if (!product) return;
        const buyers = await prisma.order.count({
            where: {
                status: 'COMPLETED',
                items: { some: { productId: product.id } }
            }
        });
        console.log(`   ${title}: ${buyers} buyer(s)`);
    };

    await verifyCoPurchase('React');
    await verifyCoPurchase('TypeScript');
    await verifyCoPurchase('Clean Code');
    await verifyCoPurchase('Python for Data Science');
    await verifyCoPurchase('Flutter');
    await verifyCoPurchase('Machine Learning Basics');

    console.log("\n🧪 Test commands:");
    console.log("   1. Login as buyer1@digistore.com → Dashboard → should see web dev + some ML");
    console.log("   2. Login as buyer3@digistore.com → Dashboard → should see ML/AI dominant");
    console.log("   3. Register NEW user → buy React + TypeScript → should see Next.js, Node.js, Vue.js");
    console.log("   4. NEW user → buy Python DS + ML Basics → should see Deep Learning, TensorFlow, NLP");
}

if (require.main === module) {
    seedOrders()
        .catch((e) => {
            console.error("❌ Order seed failed:", e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}

module.exports = { seedOrders };
