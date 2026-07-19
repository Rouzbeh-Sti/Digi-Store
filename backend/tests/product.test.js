const request = require('supertest');
const app = require('../server');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

// 1. Mock Prisma
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        product: {
            findMany: jest.fn(),
            create: jest.fn(),
        },
        user: { findUnique: jest.fn() } // Added to bypass the ban check middleware
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

// 2. Mock JWT
jest.mock('jsonwebtoken');

const prisma = new PrismaClient();

describe('Product APIs', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        // Mock user as not banned to allow middleware progression
        prisma.user.findUnique.mockResolvedValue({ isBanned: false });
    });

    describe('Product Catalog & Search', () => {
        it('should return a list of all public products', async () => {
            // Input structure matching the exact database query format
            const mockProducts = [
                { id: 1, title: 'React Course', price: 50000, category: 'Course', _count: { orderItems: 5 } },
                { id: 2, title: 'Clean Code', price: 40000, category: 'Book', _count: { orderItems: 12 } }
            ];
            
            // Expected output structure matching the controller transformations
            const expectedOutput = [
                { id: 1, title: 'React Course', price: 50000, category: 'Course', purchaseCount: 5 },
                { id: 2, title: 'Clean Code', price: 40000, category: 'Book', purchaseCount: 12 }
            ];

            prisma.product.findMany.mockResolvedValue(mockProducts);

            const response = await request(app).get('/api/products');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(expectedOutput);
            expect(prisma.product.findMany).toHaveBeenCalledTimes(1);
        });
    });

    describe('Product Management for Sellers', () => {
        it('should allow a SELLER to create a new digital product', async () => {
            jwt.verify.mockReturnValue({ userId: 1, role: 'SELLER' });

            const newProductData = { 
                title: 'Next.js Template', 
                description: 'Great template', 
                price: 99000, 
                category: 'Course',
                fileUrl: 'https://link.com'
            };
            const createdProduct = { id: 3, ...newProductData, sellerId: 1, status: 'PENDING' };

            prisma.product.create.mockResolvedValue(createdProduct);

            const response = await request(app)
                .post('/api/seller/product')
                .set('Authorization', 'Bearer fake-seller-token')
                .send(newProductData);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("محصول با موفقیت ثبت شد و در انتظار تایید مدیریت است.");
            expect(response.body.product).toEqual(createdProduct);
        });

        it('should block a BUYER from creating a product', async () => {
            jwt.verify.mockReturnValue({ userId: 2, role: 'BUYER' });

            const response = await request(app)
                .post('/api/seller/product')
                .set('Authorization', 'Bearer fake-buyer-token')
                .send({ title: 'Hacked Product', price: 10000, category: 'Course' });

            expect(response.status).toBe(403);
            expect(response.body.message).toBe("Access denied. Seller privileges required.");
            expect(prisma.product.create).not.toHaveBeenCalled();
        });
    });
});