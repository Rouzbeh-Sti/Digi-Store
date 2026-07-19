const request = require('supertest');
const app = require('../server');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

// 1. Mock Prisma
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        user: { findUnique: jest.fn() },
        product: { findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() }
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

jest.mock('jsonwebtoken');

const prisma = new PrismaClient();

describe('Seller Dashboard APIs', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        // Bypass middleware ban check and enforce SELLER role
        prisma.user.findUnique.mockResolvedValue({ isBanned: false, role: 'SELLER' });
    });

    describe('GET /api/seller/analytics', () => {
        it('should return compiled seller analytics and products', async () => {
            jwt.verify.mockReturnValue({ userId: 1, role: 'SELLER' });

            // Mock complex relational data structure
            prisma.product.findMany.mockResolvedValue([
                {
                    id: 1, title: 'Course 1', price: 1000, 
                    orderItems: [{ price: 1000, order: { status: 'COMPLETED', buyer: { email: 'a@a.com' } } }],
                    reviews: []
                }
            ]);

            const response = await request(app)
                .get('/api/seller/analytics')
                .set('Authorization', 'Bearer seller-token');

            expect(response.status).toBe(200);
            expect(response.body.totalEarnings).toBe(1000);
            expect(response.body.totalSales).toBe(1);
            expect(response.body.products.length).toBe(1);
        });
    });

    describe('PUT /api/seller/product-edit', () => {
        it('should update product if seller owns it', async () => {
            jwt.verify.mockReturnValue({ userId: 1, role: 'SELLER' });

            // Mock product ownership verification
            prisma.product.findUnique.mockResolvedValue({ id: 1, sellerId: 1 });
            prisma.product.update.mockResolvedValue({ id: 1, status: 'PENDING' });

            const response = await request(app)
                .put('/api/seller/product-edit')
                .set('Authorization', 'Bearer seller-token')
                .send({ productId: 1, title: 'Updated Title', price: 2000, category: 'Course' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Product modified successfully and returned to queue.");
            expect(prisma.product.update).toHaveBeenCalledTimes(1);
        });

        it('should block update if seller does not own the product', async () => {
            jwt.verify.mockReturnValue({ userId: 1, role: 'SELLER' });

            // Mock product owned by a different seller (sellerId: 2)
            prisma.product.findUnique.mockResolvedValue({ id: 1, sellerId: 2 });

            const response = await request(app)
                .put('/api/seller/product-edit')
                .set('Authorization', 'Bearer seller-token')
                .send({ productId: 1, title: 'Hacked Title' });

            expect(response.status).toBe(403);
            expect(response.body.message).toBe("Unauthorized operation on this asset resource.");
            expect(prisma.product.update).not.toHaveBeenCalled();
        });
    });
});