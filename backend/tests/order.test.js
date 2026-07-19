const request = require('supertest');
const app = require('../server');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

// 1. Mock Prisma
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        $transaction: jest.fn(),
        user: { findUnique: jest.fn() } // Added to bypass the ban check middleware
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

// 2. Mock JWT
jest.mock('jsonwebtoken');

const prisma = new PrismaClient();

describe('Order & Checkout APIs', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        // Mock user as not banned to allow middleware progression
        prisma.user.findUnique.mockResolvedValue({ isBanned: false });
    });

    describe('Requirement 3 & 4: Cart Checkout and Processing', () => {
        it('should process cart checkout successfully', async () => {
            jwt.verify.mockReturnValue({ userId: 2, role: 'BUYER' });

            const mockTransactionResult = {
                order: { id: 10, buyerId: 2, totalAmount: 150000, status: 'COMPLETED' },
                transaction: { id: 20, amount: 150000, status: 'SUCCESS' }
            };
            prisma.$transaction.mockResolvedValue(mockTransactionResult);

            const response = await request(app)
                .post('/api/orders/checkout-cart')
                .set('Authorization', 'Bearer fake-buyer-token')
                .send({ 
                    items: [{ id: 1, type: 'PRODUCT' }], 
                    paymentMethod: 'CREDIT_CARD' 
                });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("خرید با موفقیت انجام شد.");
            expect(prisma.$transaction).toHaveBeenCalledTimes(1);
        });

        it('should return 400 if the cart is empty', async () => {
            jwt.verify.mockReturnValue({ userId: 2, role: 'BUYER' });

            const response = await request(app)
                .post('/api/orders/checkout-cart')
                .set('Authorization', 'Bearer fake-buyer-token')
                .send({ items: [] });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("سبد خرید خالی است.");
            expect(prisma.$transaction).not.toHaveBeenCalled(); 
        });
    });
});