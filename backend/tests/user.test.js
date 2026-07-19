const request = require('supertest');
const app = require('../server');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 1. Mock Prisma and Bcrypt
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        user: { 
            findUnique: jest.fn(),
            update: jest.fn()
        }
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const prisma = new PrismaClient();

describe('User Profile & Security APIs', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        // Bypass middleware ban check
        prisma.user.findUnique.mockResolvedValue({ isBanned: false, password: 'hashedPassword' });
    });

    describe('PUT /api/user/profile', () => {
        it('should update user profile successfully', async () => {
            jwt.verify.mockReturnValue({ userId: 1, role: 'BUYER' });
            
            const updatedUser = { id: 1, fullName: 'Updated Name' };
            prisma.user.update.mockResolvedValue(updatedUser);

            const response = await request(app)
                .put('/api/user/profile')
                .set('Authorization', 'Bearer fake-token')
                .send({ fullName: 'Updated Name' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("اطلاعات پروفایل با موفقیت بروزرسانی شد.");
            expect(prisma.user.update).toHaveBeenCalledTimes(1);
        });
    });

    describe('PUT /api/user/password', () => {
        it('should change password successfully when current password is correct', async () => {
            jwt.verify.mockReturnValue({ userId: 1, role: 'BUYER' });
            
            bcrypt.compare.mockResolvedValue(true);
            bcrypt.hash.mockResolvedValue('newHashedPassword');
            prisma.user.update.mockResolvedValue({ id: 1 });

            const response = await request(app)
                .put('/api/user/password')
                .set('Authorization', 'Bearer fake-token')
                .send({ currentPassword: 'oldPass', newPassword: 'newPass' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("رمز عبور شما با موفقیت تغییر کرد.");
            expect(prisma.user.update).toHaveBeenCalledTimes(1);
        });

        it('should reject password change if current password is wrong', async () => {
            jwt.verify.mockReturnValue({ userId: 1, role: 'BUYER' });
            
            bcrypt.compare.mockResolvedValue(false); // Simulate wrong password

            const response = await request(app)
                .put('/api/user/password')
                .set('Authorization', 'Bearer fake-token')
                .send({ currentPassword: 'wrongOldPass', newPassword: 'newPass' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("رمز عبور فعلی اشتباه است.");
            expect(prisma.user.update).not.toHaveBeenCalled();
        });
    });
});