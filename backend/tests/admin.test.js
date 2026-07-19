const request = require('supertest');
const app = require('../server');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

// 1. Mock Prisma
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        user: { findUnique: jest.fn() },
        product: { update: jest.fn(), findMany: jest.fn() }
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

// 2. Mock JWT
jest.mock('jsonwebtoken');

const prisma = new PrismaClient();

describe('Admin Operations APIs', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/admin/verify-product', () => {
        it('should allow ADMIN to update product status', async () => {
            // Mock standard middleware requirements
            jwt.verify.mockReturnValue({ userId: 1, role: 'ADMIN' });
            prisma.user.findUnique.mockResolvedValue({ isBanned: false, role: 'ADMIN' });

            const updatedProduct = { id: 10, title: 'Test Product', status: 'APPROVED' };
            prisma.product.update.mockResolvedValue(updatedProduct);

            const response = await request(app)
                .post('/api/admin/verify-product')
                .set('Authorization', 'Bearer admin-token')
                .send({ productId: 10, status: 'APPROVED' });

            expect(response.status).toBe(200);
            expect(response.body.product.status).toBe('APPROVED');
            expect(prisma.product.update).toHaveBeenCalledTimes(1);
        });

        it('should reject BUYER from accessing admin routes', async () => {
            // Mock buyer trying to access admin endpoint
            jwt.verify.mockReturnValue({ userId: 2, role: 'BUYER' });
            prisma.user.findUnique.mockResolvedValue({ isBanned: false, role: 'BUYER' });

            const response = await request(app)
                .post('/api/admin/verify-product')
                .set('Authorization', 'Bearer buyer-token')
                .send({ productId: 10, status: 'APPROVED' });

            expect(response.status).toBe(403);
            expect(response.body.message).toBe("Access denied. Administrative privileges required.");
            expect(prisma.product.update).not.toHaveBeenCalled();
        });
    });
});