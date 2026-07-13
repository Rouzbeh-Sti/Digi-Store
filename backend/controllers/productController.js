const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createProduct = async (req, res) => {
    try {
        const { title, description, price, category, fileUrl } = req.body;
        const sellerId = req.user.userId;

        if (!title || !price || !category) {
            return res.status(400).json({ message: "وارد کردن عنوان، قیمت و دسته‌بندی الزامی است." });
        }

        if (category !== 'License' && !fileUrl) {
            return res.status(400).json({ message: "برای این نوع محصول، وارد کردن لینک فایل یا استریم الزامی است." });
        }

        const newProduct = await prisma.product.create({
            data: {
                title,
                description,
                price: parseFloat(price),
                category,
                fileUrl: category === 'License' ? '' : fileUrl,
                status: 'PENDING',
                sellerId: sellerId
            }
        });

        res.status(201).json({
            message: "محصول با موفقیت ثبت شد و در انتظار تایید مدیریت است.",
            product: newProduct
        });
    } catch (error) {
        console.error("Create Product Error:", error);
        res.status(500).json({ message: "خطا در ثبت محصول جدید در پایگاه داده." });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const { search } = req.query;
        const products = await prisma.product.findMany({
            where: {
                status: 'APPROVED',
                ...(search && {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } }
                    ]
                })
            },
            include: {
                seller: { select: { fullName: true, storeName: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(products);
    } catch (error) {
        console.error("Get All Products Error:", error);
        res.status(500).json({ message: "Failed to fetch marketplace products." });
    }
};

module.exports = { createProduct, getAllProducts };