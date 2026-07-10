const request = require('supertest');
const app = require('../server');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

// 1. Mock Prisma so we don't need a real database connection for tests
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        product: {
            findMany: jest.fn(),
            create: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

// 2. Mock JWT so we can simulate logged-in users
jest.mock('jsonwebtoken');

const prisma = new PrismaClient();

describe('Product APIs', () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    // Test Requirement 1: Product Catalog & Search
    describe('Product Catalog & Search', () => {

        it('should return a list of all products for buyers', async () => {
            // Setup mock data
            const mockProducts = [
                { id: 1, title: 'React Course', price: 50 },
                { id: 2, title: 'Node.js Guide', price: 40 }
            ];
            prisma.product.findMany.mockResolvedValue(mockProducts);

            // Execute the API request
            const response = await request(app).get('/api/products');

            // Assertions
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockProducts);
            expect(prisma.product.findMany).toHaveBeenCalledTimes(1);
        });
    });

    // Test Requirement 2: Product Management for Sellers
    describe('Product Management for Sellers', () => {

        it('should allow a SELLER to create a new digital product', async () => {
            // Simulate a valid token for a SELLER
            jwt.verify.mockReturnValue({ userId: 1, role: 'SELLER' });

            const newProductData = { title: 'Next.js Template', description: 'Great template', price: 99 };
            const createdProduct = { id: 3, ...newProductData, sellerId: 1 };

            prisma.product.create.mockResolvedValue(createdProduct);

            // Execute the API request
            const response = await request(app)
                .post('/api/products')
                .set('Authorization', 'Bearer fake-seller-token')
                .send(newProductData);

            // Assertions
            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Product created successfully!");
            expect(response.body.product).toEqual(createdProduct);
        });

        it('should block a BUYER from creating a product', async () => {
            // Simulate a valid token, but for a standard BUYER
            jwt.verify.mockReturnValue({ userId: 2, role: 'BUYER' });

            const response = await request(app)
                .post('/api/products')
                .set('Authorization', 'Bearer fake-buyer-token')
                .send({ title: 'Hacked Product', price: 10 });

            // Assertions
            expect(response.status).toBe(403);
            expect(response.body.message).toBe("Access denied. This action requires Seller privileges.");
            expect(prisma.product.create).not.toHaveBeenCalled();
        });
    });
});