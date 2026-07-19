const request = require('supertest');
const app = require('../server');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

// 1. Mock Prisma
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        user: { findUnique: jest.fn() },
        subscriptionPlan: { findMany: jest.fn() },
        userSubscription: { findFirst: jest.fn() }
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

jest.mock('jsonwebtoken');
const prisma = new PrismaClient();

describe('Subscription System APIs', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        prisma.user.findUnique.mockResolvedValue({ isBanned: false, role: 'BUYER' });
    });

    describe('GET /api/subscriptions/plans', () => {
        it('should return a list of active subscription plans', async () => {
            const mockPlans = [{ id: 1, title: 'Monthly Plan', isActive: true }];
            prisma.subscriptionPlan.findMany.mockResolvedValue(mockPlans);

            // Public route, no auth required
            const response = await request(app).get('/api/subscriptions/plans');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockPlans);
        });
    });

    describe('GET /api/subscriptions/status', () => {
        it('should return active subscription status for authenticated user', async () => {
            jwt.verify.mockReturnValue({ userId: 1, role: 'BUYER' });

            const activeSub = { id: 1, isActive: true, endDate: new Date() };
            prisma.userSubscription.findFirst.mockResolvedValue(activeSub);

            const response = await request(app)
                .get('/api/subscriptions/status')
                .set('Authorization', 'Bearer token');

            expect(response.status).toBe(200);
            expect(response.body.hasActiveSubscription).toBe(true);
            expect(response.body.subscription.id).toBe(1);
        });
    });
});