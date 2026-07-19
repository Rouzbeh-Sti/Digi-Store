const request = require('supertest');
const app = require('../server');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

// 1. Mock Prisma
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        user: { findUnique: jest.fn() },
        orderItem: { findMany: jest.fn() },
        userSubscription: { findFirst: jest.fn() },
        product: { findUnique: jest.fn() }
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

jest.mock('jsonwebtoken');
const prisma = new PrismaClient();

describe('Buyer Library & Subscription APIs', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        prisma.user.findUnique.mockResolvedValue({ isBanned: false, role: 'BUYER' });
    });

    describe('GET /api/buyer/dashboard', () => {
        it('should return purchased items for the buyer', async () => {
            jwt.verify.mockReturnValue({ userId: 1, role: 'BUYER' });

            const mockPurchases = [{ id: 1, product: { title: 'Book 1' } }];
            prisma.orderItem.findMany.mockResolvedValue(mockPurchases);

            const response = await request(app)
                .get('/api/buyer/dashboard')
                .set('Authorization', 'Bearer buyer-token');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockPurchases);
        });
    });

    describe('GET /api/buyer/digicourse/:productId', () => {
        it('should grant access to subscription-allowed product if user has active sub', async () => {
            jwt.verify.mockReturnValue({ userId: 1, role: 'BUYER' });

            // Mock active subscription
            prisma.userSubscription.findFirst.mockResolvedValue({ isActive: true });
            // Mock product allowing subscription
            prisma.product.findUnique.mockResolvedValue({ id: 1, allowSubscription: true, title: 'Course 1' });

            const response = await request(app)
                .get('/api/buyer/digicourse/1')
                .set('Authorization', 'Bearer buyer-token');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("دسترسی از طریق دیجی‌کورس تایید شد.");
        });

        it('should deny access if user has no active subscription', async () => {
            jwt.verify.mockReturnValue({ userId: 1, role: 'BUYER' });

            // Mock NO active subscription
            prisma.userSubscription.findFirst.mockResolvedValue(null);

            const response = await request(app)
                .get('/api/buyer/digicourse/1')
                .set('Authorization', 'Bearer buyer-token');

            expect(response.status).toBe(403);
            expect(response.body.message).toBe("شما اشتراک فعال دیجی‌کورس ندارید. لطفاً اشتراک تهیه کنید.");
        });
    });
});