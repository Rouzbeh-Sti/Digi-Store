const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

/**
 * Order Seeder for Recommendation System Testing
 * 
 * Creates realistic purchase patterns across all buyers to test:
 * 1. Collaborative filtering (users who bought X also bought Y)
 * 2. Category-based recommendations
 * 3. Popular product boosting
 * 
 * Purchase Patterns Designed:
 * - buyer1 (Mahan): Web dev enthusiast → buys React, Next.js, Node.js, TypeScript courses + related books
 * - buyer2 (Erfan): Mobile dev focus → Flutter, React Native, Swift + mobile design books
 * - buyer3 (Rouzbeh): Data Science → Python ML, Deep Learning, Data Viz + stats books
 * - Mixed patterns to create clear co-purchase signals
 * 
 * Run: node prisma/order-seed.js
 */

function generateLicenseKey(title) {
    const prefix = title.substring(0, 4).toUpperCase().padEnd(4, 'X');
    const randomHex = crypto.randomBytes(6).toString('hex').toUpperCase();
    return `${prefix}-${randomHex.slice(0, 4)}-${randomHex.slice(4, 8)}-${randomHex.slice(8, 12)}`;
}

async function seedOrders() {
    console.log("🛒 Starting order seed for recommendation testing...");

    // Get buyers
    const buyer1 = await prisma.user.findUnique({ where: { email: "buyer1@digistore.com" } });
    const buyer2 = await prisma.user.findUnique({ where: { email: "buyer2@digistore.com" } });
    const buyer3 = await prisma.user.findUnique({ where: { email: "buyer3@digistore.com" } });

    if (!buyer1 || !buyer2 || !buyer3) {
        console.error("❌ Please run the main seed.js first to create buyers.");
        process.exit(1);
    }

    // Get products by title for easy reference
    const getProduct = async (title) => {
        return await prisma.product.findFirst({ where: { title } });
    };

    // Helper to create a completed order with license
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

        // Create transaction
        await prisma.transaction.create({
            data: {
                orderId: order.id,
                amount: totalAmount,
                paymentMethod,
                status: 'SUCCESS'
            }
        });

        // Create licenses for non-Course products
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

    // ═══════════════════════════════════════════════════════
    // BUYER 1 (Mahan) - Web Development Enthusiast
    // Pattern: Frontend courses + backend + related books + tools
    // ═══════════════════════════════════════════════════════
    console.log("  📦 Creating orders for Buyer 1 (Web Dev cluster)...");

    await createOrder(buyer1.id, ['React', 'Next.js', 'TypeScript']);
    await createOrder(buyer1.id, ['Node.js', 'Express.js']);
    await createOrder(buyer1.id, ['Clean Code', 'Design Patterns']);
    await createOrder(buyer1.id, ['JetBrains All Products Pack']);
    await createOrder(buyer1.id, ['Vue.js', 'GraphQL']);
    await createOrder(buyer1.id, ['The Pragmatic Programmer']);
    await createOrder(buyer1.id, ['Docker & Kubernetes', 'CI/CD Pipelines']);
    await createOrder(buyer1.id, ['VS Code Pro (GitHub Copilot)']);

    // ═══════════════════════════════════════════════════════
    // BUYER 2 (Erfan) - Mobile Development Focus
    // Pattern: Mobile courses + cross-platform + design tools
    // ═══════════════════════════════════════════════════════
    console.log("  📦 Creating orders for Buyer 2 (Mobile Dev cluster)...");

    await createOrder(buyer2.id, ['Flutter', 'React Native']);
    await createOrder(buyer2.id, ['iOS Development', 'Android Development']);
    await createOrder(buyer2.id, ['Cross-platform Architecture']);
    await createOrder(buyer2.id, ['Figma Professional']);
    await createOrder(buyer2.id, ['Swift UI', 'Kotlin Multiplatform']);
    await createOrder(buyer2.id, ['Adobe Creative Cloud']);
    await createOrder(buyer2.id, ['Mobile UX Design']);
    await createOrder(buyer2.id, ['Sketch License']);

    // ═══════════════════════════════════════════════════════
    // BUYER 3 (Rouzbeh) - Data Science & AI
    // Pattern: ML courses + Python + statistics + cloud
    // ═══════════════════════════════════════════════════════
    console.log("  📦 Creating orders for Buyer 3 (Data Science cluster)...");

    await createOrder(buyer3.id, ['Python for Data Science', 'Machine Learning Basics']);
    await createOrder(buyer3.id, ['Deep Learning with PyTorch', 'TensorFlow Mastery']);
    await createOrder(buyer3.id, ['Data Visualization', 'Statistical Analysis']);
    await createOrder(buyer3.id, ['AWS Solutions Architect']);
    await createOrder(buyer3.id, ['NLP with Python', 'Computer Vision']);
    await createOrder(buyer3.id, ['Introduction to Algorithms']);
    await createOrder(buyer3.id, ['Big Data with Spark', 'MLOps']);
    await createOrder(buyer3.id, ['PyCharm Professional']);

    // ═══════════════════════════════════════════════════════
    // OVERLAPPING PURCHASES (for collaborative filtering)
    // These create "users who bought X also bought Y" signals
    // ═══════════════════════════════════════════════════════
    console.log("  📦 Creating overlapping purchase patterns...");

    // Web dev buyers also buy: buyer1 + new simulated pattern
    await createOrder(buyer1.id, ['JavaScript Advanced', 'ES6+ Features', 'REST API Design']);

    // Another user buys React → should see Next.js, Vue.js recommended
    // (buyer1 already bought React+Next.js, so we create more React buyers)
    // We use buyer2 and buyer3 to buy some web dev stuff too
    await createOrder(buyer2.id, ['React', 'Node.js']);  // Mobile dev also learns web
    await createOrder(buyer3.id, ['React', 'TypeScript']); // Data scientist learns frontend

    // DevOps overlap
    await createOrder(buyer1.id, ['Terraform', 'Infrastructure as Code']);
    await createOrder(buyer3.id, ['Docker & Kubernetes', 'Terraform']);

    // Book lovers overlap
    await createOrder(buyer1.id, ['Refactoring', 'Code Complete']);
    await createOrder(buyer2.id, ['Clean Code', 'The Clean Coder']);
    await createOrder(buyer3.id, ['Clean Code', 'Design Patterns']);

    // Tool overlap
    await createOrder(buyer1.id, ['GitHub Actions', 'Postman Team']);
    await createOrder(buyer2.id, ['Postman Team', 'Notion Team']);
    await createOrder(buyer3.id, ['Notion Team', 'Obsidian Sync']);

    // ═══════════════════════════════════════════════════════
    // POPULAR PRODUCTS (bought by multiple users)
    // These should get boosted in recommendations
    // ═══════════════════════════════════════════════════════
    console.log("  📦 Creating popular product signals...");

    // React is popular - all 3 buyers have it or related
    await createOrder(buyer1.id, ['React']);
    await createOrder(buyer2.id, ['React']);
    await createOrder(buyer3.id, ['React']);

    // Clean Code is popular
    await createOrder(buyer1.id, ['Clean Code']);
    await createOrder(buyer2.id, ['Clean Code']);
    await createOrder(buyer3.id, ['Clean Code']);

    // Docker popular
    await createOrder(buyer1.id, ['Docker & Kubernetes']);
    await createOrder(buyer3.id, ['Docker & Kubernetes']);

    // ═══════════════════════════════════════════════════════
    // CATEGORY CROSSOVER (for content-based testing)
    // ═══════════════════════════════════════════════════════
    console.log("  📦 Creating category crossover patterns...");

    // Web dev buyer buys a license
    await createOrder(buyer1.id, ['WebStorm License']);
    await createOrder(buyer1.id, ['DataGrip License']);

    // Mobile dev buyer buys books
    await createOrder(buyer2.id, ['Head First Design Patterns']);
    await createOrder(buyer2.id, ['Software Architecture in Practice']);

    // Data scientist buys tools
    await createOrder(buyer3.id, ['Jupyter-related tools', 'TablePlus License']);

    console.log("✅ Order seed complete!");
    console.log(`📊 Total orders created: ${await prisma.order.count()}`);
    console.log(`📊 Total licenses created: ${await prisma.license.count()}`);
    console.log("\n🧪 Test the recommendation system:");
    console.log("   1. Login as buyer1@digistore.com (password: password123)");
    console.log("   2. Check Buyer Dashboard for 'پیشنهادات ویژه برای شما'");
    console.log("   3. Visit a product page for 'خریداران این محصول، این‌ها را هم خریدند'");
    console.log("\n🔍 Expected recommendations:");
    console.log("   - buyer1 (bought React, Next.js) → should see Vue.js, Angular, Node.js");
    console.log("   - buyer2 (bought Flutter, React Native) → should see Swift UI, Kotlin Multiplatform");
    console.log("   - buyer3 (bought Python DS, ML) → should see Deep Learning, NLP, Data Viz");
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

