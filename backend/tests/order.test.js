const request = require('supertest');
const app = require('../server');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

// 1. Mock Prisma (including the complex $transaction method)
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        product: {
            findUnique: jest.fn(),
        },
        $transaction: jest.fn(),
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

// 2. Mock JWT
jest.mock('jsonwebtoken');

const prisma = new PrismaClient();

describe('Order & Checkout APIs', () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    // Test Requirements 3 & 4: Checkout & License
    describe('Requirement 3 & 4: Single Purchase System and License Issuance', () => {

        it('should process checkout and generate a license successfully', async () => {
            // Simulate a logged-in buyer
            jwt.verify.mockReturnValue({ userId: 2, role: 'BUYER' });

            // Mock finding the product in the database
            const mockProduct = { id: 1, title: 'React Masterclass', price: 150 };
            prisma.product.findUnique.mockResolvedValue(mockProduct);

            // Mock the successful Prisma transaction result
            const mockTransactionResult = {
                order: { id: 10, buyerId: 2, totalAmount: 150, status: 'COMPLETED' },
                transaction: { id: 20, amount: 150, status: 'SUCCESS' },
                license: { id: 30, licenseKey: 'REAC-A1B2-C3D4-E5F6', isValid: true }
            };
            prisma.$transaction.mockResolvedValue(mockTransactionResult);

            // Execute the API request
            const response = await request(app)
                .post('/api/orders/checkout')
                .set('Authorization', 'Bearer fake-buyer-token')
                .send({ productId: 1, paymentMethod: 'CREDIT_CARD' });

            // Assertions
            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Purchase successful! License generated.");
            expect(response.body.license.licenseKey).toBe('REAC-A1B2-C3D4-E5F6');
            expect(prisma.product.findUnique).toHaveBeenCalledTimes(1);
            expect(prisma.$transaction).toHaveBeenCalledTimes(1);
        });

        it('should return 404 if the requested product does not exist', async () => {
            // Simulate a logged-in buyer
            jwt.verify.mockReturnValue({ userId: 2, role: 'BUYER' });

            // Mock the product NOT being found
            prisma.product.findUnique.mockResolvedValue(null);

            // Execute the API request with a bad product ID
            const response = await request(app)
                .post('/api/orders/checkout')
                .set('Authorization', 'Bearer fake-buyer-token')
                .send({ productId: 999 });

            // Assertions
            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Product not found.");
            expect(prisma.$transaction).not.toHaveBeenCalled(); // Ensure no purchase was attempted
        });
    });
});