const request = require('supertest');
const app = require('../server');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 1. Mock Prisma
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        }
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

// 2. Mock external dependencies
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const prisma = new PrismaClient();

describe('Authentication APIs', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const newUser = {
                email: 'test@digistore.com',
                password: 'password123',
                fullName: 'Test User'
            };

            prisma.user.findUnique.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashedPassword');
            prisma.user.create.mockResolvedValue({ id: 1, ...newUser, password: 'hashedPassword', role: 'BUYER' });
            jwt.sign.mockReturnValue('fake-jwt-token');

            const response = await request(app).post('/api/auth/register').send(newUser);

            expect(response.status).toBe(201);
            expect(response.body.token).toBe('fake-jwt-token');
            expect(prisma.user.create).toHaveBeenCalledTimes(1);
        });

        it('should return 400 if email already exists', async () => {
            prisma.user.findUnique.mockResolvedValue({ email: 'test@digistore.com' });

            const response = await request(app).post('/api/auth/register').send({
                email: 'test@digistore.com',
                password: 'password123',
                fullName: 'Duplicate User'
            });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("این ایمیل قبلا در سیستم ثبت شده است.");
            expect(prisma.user.create).not.toHaveBeenCalled();
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login user and return a token', async () => {
            const mockDbUser = { id: 1, email: 'test@digistore.com', password: 'hashedPassword', isBanned: false, role: 'BUYER' };
            
            prisma.user.findUnique.mockResolvedValue(mockDbUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('fake-jwt-token');

            const response = await request(app).post('/api/auth/login').send({
                email: 'test@digistore.com',
                password: 'password123'
            });

            expect(response.status).toBe(200);
            expect(response.body.token).toBe('fake-jwt-token');
        });

        it('should block a banned user from logging in', async () => {
            const mockDbUser = { id: 2, email: 'banned@digistore.com', password: 'hashedPassword', isBanned: true };
            
            prisma.user.findUnique.mockResolvedValue(mockDbUser);

            const response = await request(app).post('/api/auth/login').send({
                email: 'banned@digistore.com',
                password: 'password123'
            });

            expect(response.status).toBe(403);
            expect(response.body.message).toBe("حساب کاربری شما توسط مدیریت مسدود شده است.");
        });
    });
});